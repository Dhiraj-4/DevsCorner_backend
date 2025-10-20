import { Conversation } from "../schema/conversationSchema.js"
import { Message } from "../schema/messageSchema.js";

export const findConversation = async({ userId, receiverId }) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [ userId, receiverId ]}
  })
  .populate("participants","userName profileImage fullName");

  return conversation;
}

export const createConversation = async({ userId, receiverId }) => {
  const conversation = await Conversation.create({
    participants: [ userId, receiverId ]
  })
  .populate("participants","userName profileImage fullName");

  return conversation;
}
export const getConversations = async ({ userId }) => {
  const conversations = await Conversation.find({
    participants: { $in: [userId] },
  })
    .populate("participants", "userName profileImage fullName") // optional: populate user data
    .sort({ updatedAt: -1 }); // latest chat on top

  return conversations;
};


export const getMessages = async ({ conversationId, userId, skip, limit }) => {
  // Verify the user is part of this conversation (security check)
  // Optional, but always good practice
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw {status: 400, message:"Conversation not found"};

  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw {status: 403, message:"Unauthorized access to this conversation"};
  }

  // Fetch messages — newest first
  const messages = await Message.find({ conversationId })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  return messages;
};
