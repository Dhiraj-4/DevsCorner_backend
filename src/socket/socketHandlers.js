import { Conversation } from "../schema/conversationSchema.js";
import { Message } from "../schema/messageSchema.js";
import { User } from "../schema/userSchema.js"
import { addUser, getUserSocket, removeUser } from "./userManager.js";

export const handleConnection = async(io, socket) => {

    console.log(`⚡ Socket connected: ${socket.id}`);
    const { userId } = socket.handshake.query;
    
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
    socket.userId = userId;
    console.log(`✅ ${user.userName} joined`);

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

    socket.on("disconnect", () => {
        removeUser(socket.userId);
        console.log(`❌ User disconnected: ${socket.userId}`);
    });
}
