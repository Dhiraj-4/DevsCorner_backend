import express from "express";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import { getUnseenNotif } from "../../controller/notificationController.js";


const router = express.Router();

router.get("/unseen", accessTokenValidator, getUnseenNotif);

export default router;