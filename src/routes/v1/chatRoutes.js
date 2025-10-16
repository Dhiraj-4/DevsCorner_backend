import { createConversation, getConversations, getMessages } from "../../controller/chatController.js";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import express from "express";

const router = express.Router();

router.post("/conversations", accessTokenValidator, createConversation);

router.get('/conversations', accessTokenValidator, getConversations);

router.get('/messages', accessTokenValidator, getMessages);

export default router;