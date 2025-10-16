import {
    getConversations as getConversationsService,
    getMessages as getMessagesService,
    createConversation as createConversationService
} from "../service/chatService.js";
import { errorResponse, successResponse } from "../utils/responseHelper.js";

export const createConversation = async(req, res) => {
    try {
        const conversation = await createConversationService({
            userId: req.body?.userId,
            receiverId: req.body?.receiverId
        });

        return successResponse({
            message: "created conversation",
            status: 201,
            res: res,
            info: conversation
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}
export const getConversations = async(req, res) => {
    try {
        const conversations = await getConversationsService({ userName: req.user.userName });

        return successResponse({
            message: "fetched conversations",
            status: 200,
            res: res,
            info: [ conversations ]
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getMessages = async(req, res) => {
    try {
        let limit = 20;
        const messages = await getMessagesService({
            conversationId: req.query?.conversationId,
            userName: req.user.userName,
            page:(req.query?.page || 1),
            limit
        });

        let hasMore = (limit === messages.length);
        return successResponse({
            message: "fetched messages",
            status: 200,
            res: res,
            info: [ messages, hasMore ]
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}