import { getConversations } from "../repository/chatRepository.js";
import { Conversation } from "../schema/conversationSchema.js";
import { Message } from "../schema/messageSchema.js";
import { User } from "../schema/userSchema.js"
import { addUser, getUserNumber, getUserSocket, removeUser, users } from "./userManager.js";

export const handleConnection = async(io, socket) => {

    console.log(`⚡ Socket connected: ${socket.id}`);
    const { userId } = socket.handshake.query;
    
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