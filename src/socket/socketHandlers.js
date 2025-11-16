import { Notification } from "../schema/notificationSchema.js";
import { io } from "../app.js";
import { User } from "../schema/userSchema.js";
import jwt from "jsonwebtoken";
import { getConversations } from "../repository/chatRepository.js";
import { Conversation } from "../schema/conversationSchema.js";
import { Message } from "../schema/messageSchema.js";
import { addUser, getUserNumber, getUserSocket, removeUser, users } from "./userManager.js";
import { ACCESS_SECRET_KEY } from "../config/serverConfig.js";

export const handleConnection = async(io, socket) => {

    console.log(`⚡ Socket connected: ${socket.id}`);
    const { userId, accessToken } = socket.handshake.query;

    jwt.verify(accessToken, ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("❌ Invalid token, disconnecting socket");
        return socket.disconnect(true);
      }
    
      console.log("✅ Token verified for:", decoded.userName);
    });


    if(!userId) {
      socket.emit("authError", { message: "Invalid user" });
      return socket.disconnect(true);
    }

    const user = await User.findById(userId).select("userName");

    //if user not found in DB
    if(!user) {
        socket.emit("authError", { message: "Invalid user" });
        return socket.disconnect(true);
    }

    //fetch not Deliverd messages
    const notDeliverdMessages = await Message.find({ 
        receiver: userId, 
        delivered: false 
    });

    // Send them
    notDeliverdMessages.forEach(async (msg) => {
      socket.emit('receiveMessage', msg);
      msg.delivered = true;
      await msg.save();
    });

    const undeliveredNotifs = await Notification.find({
      userId,
      delivered: false
    });

    undeliveredNotifs.forEach(async notif => {
        socket.emit("notification:newJob", notif);
        notif.delivered = true;
        await notif.save();
    });

    //Add user in user Map();
    addUser(userId, socket.id);
    io.emit("onlineMembers", getUserNumber());
    socket.userId = userId;
    console.log(`✅ ${user.userName} joined`);

    // 1️⃣ Fetch all conversations for this user
  const conversations = await getConversations({ userId });
    
  // 2️⃣ Get all peers (other participants)
  const peers = conversations
    .map((conv) =>
      conv.participants.find((p) => p._id.toString() !== userId.toString())
    )
    .filter(Boolean)
    .map((p) => p._id.toString());

  // 3️⃣ Notify online peers that this user came online
  peers.forEach((peerId) => {
    const peerSocket = getUserSocket(peerId);
    if (peerSocket) {
      io.to(peerSocket).emit("userJoinedChat", userId);
    }
  });

  // 4️⃣ Send list of currently-online peers to this user
  const onlinePeers = peers.filter((peerId) => users.has(peerId));
  socket.emit("onlineParticipants", onlinePeers);


    socket.on("sendMessage", async({ sender, receiver, text }) => {
        try {
          console.log(text,sender, receiver, `message received`);

          let conversation = (
            // In message creation
            await Conversation.findOneAndUpdate(
              { participants: { $all: [sender, receiver] } },
              { new: true, upsert: true }
            )) ||
            (await Conversation.create({ participants: [sender, receiver] }));
            
            const message = await Message.create({
              conversationId: conversation._id,
              sender,
              receiver,
              text,
            });
            
            socket.emit("messageDeliverd", message);

            await notify("message", {
              userId: receiver,
              from: user.userName,
              data: message
            });

            const receiverSocketId = getUserSocket(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", message);
                message.delivered = true;
                await message.save();
            }else {
                console.log(`💤 Receiver ${receiver} is offline. Message stored.`);
            }
        
            io.to(socket.id).emit("messageSent", message);
        } catch (error) {
            console.error("❌ Message send error:", error);
        }
    });

    socket.on("logout", () => {
        removeUser(socket.userId);
        io.emit("onlineMembers", getUserNumber());
        peers.forEach((peerId) => {
        const peerSocket = getUserSocket(peerId);
            if (peerSocket) {
              io.to(peerSocket).emit("userLeftChat", userId);
            }
        });
        console.log(`❌ User logged out: ${socket.userId}`);
        console.log(`❌ ${user.userName} logged out`);
        socket.disconnect(true);
    });

    socket.on("disconnect", () => {
        removeUser(socket.userId);
        io.emit("onlineMembers", getUserNumber());
        peers.forEach((peerId) => {
        const peerSocket = getUserSocket(peerId);
            if (peerSocket) {
              io.to(peerSocket).emit("userLeftChat", userId);
            }
        });
        console.log(`❌ User disconnected: ${socket.userId}`);
        console.log(`❌ ${user.userName} left`);
    });
}


export async function notify(event, payload) {
    
    // 🔔 1️⃣ JOB NOTIFICATIONS
    if (event === "job") {

        const allUsers = await User.find({}, "_id");

        for (const user of allUsers) {
            const notif = await Notification.create({
                userId: user._id,
                type: "job",
                from: payload.from,
                data: {
                    jobId: payload.jobId,
                    role: payload.role,
                    companyName: payload.companyName,
                    location: payload.location
                }
            });

            const socketId = getUserSocket(user._id.toString());

            if (socketId) {
                io.to(socketId).emit("notification:newJob", notif);

                notif.delivered = true;
                await notif.save();
            }
        }
        return;
    }

    // 🔔 2️⃣ POST NOTIFICATIONS (followers)
    else if (event === "post") {

        const user = await User.findById(payload.owner).select("followers");

        for (let follower of user.followers) {

            const notif = await Notification.create({
                userId: follower,
                type: "post",
                from: payload.from,
                data: {
                    postId: payload.postId,
                    owner: payload.owner,
                    text: payload.text
                }
            });

            const socketId = getUserSocket(follower.toString());

            if (socketId) {
                io.to(socketId).emit("notification:post", notif);

                notif.delivered = true;
                await notif.save();
            }
        }
        return;
    }

    // 🔔 3️⃣ MESSAGE NOTIFICATIONS
    else if (event === "message") {

        const notif = await Notification.create({
            userId: payload.userId,
            type: "message",
            from: payload.from,
            data: {
                messageId: payload.data._id,
                receiver: payload.data.receiver,
                sender: payload.data.sender,
                conversationId: payload.data.conversationId
            }
        });

        const socketId = getUserSocket(payload.userId.toString());

        if (socketId) {
            io.to(socketId).emit("notification:message", notif);

            notif.delivered = true;
            await notif.save();
        }

        return;
    }
}