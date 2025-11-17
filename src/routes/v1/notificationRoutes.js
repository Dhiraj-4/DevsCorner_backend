import express from "express";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import { deleteNotif, getUnseenNotif } from "../../controller/notificationController.js";


const router = express.Router();

router.get("/unseen", accessTokenValidator, getUnseenNotif);

router.delete("/delete", accessTokenValidator, deleteNotif);

export default router;