import { getMe as getMeService } from "./userService.js";
import {
    getConversations as getConversationsRepository,
    getMessages as getMessagesRepository,
    createConversation as createConversationRepository,
    findConversation as findConversationRepository
} from "../repository/chatRepository.js"

export const findConversation = async({ userId, receiverId }) => {
    const conversation = await findConversationRepository({ userId, receiverId });
    return conversation;
}
export const createConversation = async({ userId, receiverId }) => {
    if(!userId || !receiverId) throw { status: 400, message: "userId or receiverId missing"};

    const conversation = 
    (await findConversation({ userId, receiverId })) || (await createConversationRepository({ userId, receiverId }));

    return conversation;
}
export const getConversations = async({ userName }) => {
    const user = await getMeService({ userName });

    const conversations = await getConversationsRepository({ userId: user._id });

    return conversations;
}

export const getMessages = async({ conversationId, userName, page, limit }) => {
    if(!conversationId) throw { status: 400, message: "conversationId required" };

    const skip = (page - 1) * limit;
    
    const user = await getMeService({ userName });

    const messages = await getMessagesRepository({
        conversationId,
        userId: user._id,
        skip,
        limit
    });

    return messages;
}