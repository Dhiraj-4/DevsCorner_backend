import express from "express";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import { jobValidator } from "../../validators/jobValidators/jobValidator.js";
import { jobZodSchema } from "../../validators/jobValidators/jobZodSchema.js";
import { jobPost, updateJobText } from "../../controller/jobController.js";

const router = express.Router();

router.post("/post", accessTokenValidator, jobValidator(jobZodSchema), jobPost);

//update text
router.patch("/update-text", accessTokenValidator, jobValidator(jobZodSchema), updateJobText);

//update and delete appyLink
// router.patch("/update-appyLink", accessTokenValidator, jobValidator())
//update and delete companyName;


export default router;