import express from "express";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import { commentZodSchema } from "../../validators/commentValidators/commentZodSchema.js";
import { commentValidator } from "../../validators/commentValidators/commentValidator.js";
import { createComment, deleteComment, getComments, toggleDislike, toggleLike, updateText } from "../../controller/commentController.js";

const router = express.Router();

router.post("/post", accessTokenValidator, commentValidator(commentZodSchema("create")), createComment);

router.patch("/update-text", accessTokenValidator, commentValidator(commentZodSchema("update-text")), updateText);

router.patch("/toggle-like", accessTokenValidator, commentValidator(commentZodSchema("toggle-reaction")), toggleLike);

router.patch("/toggle-dislike", accessTokenValidator, commentValidator(commentZodSchema("toggle-reaction")), toggleDislike);

// router.get("/my-posts", accessTokenValidator, getOwnersPosts);

router.get("/", accessTokenValidator, getComments);

router.delete("/delete", accessTokenValidator, commentValidator(commentZodSchema("delete")), deleteComment);

export default router;