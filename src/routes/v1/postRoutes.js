import express from "express";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import { postValidator } from "../../validators/postValidators/postValidator.js";
import { createPost, deletePost, getOwnersPosts, getPosts, toggleDislike, toggleLike, updateText } from "../../controller/postController.js";
import { postZodSchema } from "../../validators/postValidators/postZodSchema.js";

const router = express.Router();

router.post("/", accessTokenValidator, postValidator(postZodSchema("create")), createPost);

router.patch("/update-text", accessTokenValidator, postValidator(postZodSchema("update-text")), updateText);

router.patch("/toggle-like", accessTokenValidator, postValidator(postZodSchema("toggle-reaction")), toggleLike);

router.patch("/toggle-dislike", accessTokenValidator, postValidator(postZodSchema("toggle-reaction")), toggleDislike);

router.get("/my-posts", accessTokenValidator, getOwnersPosts);

router.get("/", accessTokenValidator, getPosts);

router.delete("/delete", accessTokenValidator, postValidator(postZodSchema("delete")), deletePost);

export default router;