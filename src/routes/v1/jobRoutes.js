import express from "express";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import { jobValidator } from "../../validators/jobValidators/jobValidator.js";
import { jobZodSchema } from "../../validators/jobValidators/jobZodSchema.js";
import { deleteApplyLink, deleteCompanyName, deleteJob, getJobs, getOwnersJobs, jobPost, updateApplyLink, updateCompanyName, updateJobText, updateRole } from "../../controller/jobController.js";

const router = express.Router();

router.post("/post", accessTokenValidator, jobValidator(jobZodSchema("create")), jobPost);

//update text
router.patch("/update-text", accessTokenValidator, jobValidator(jobZodSchema("update-text")), updateJobText);

//update and delete applyLink

router.patch("/update-applyLink", accessTokenValidator, jobValidator(jobZodSchema("update-applylink")), updateApplyLink);

router.delete("/delete-applyLink", accessTokenValidator, jobValidator(jobZodSchema("delete")), deleteApplyLink);

//update and delete companyName;

router.patch("/update-companyName", accessTokenValidator, jobValidator(jobZodSchema("update-companyname")), updateCompanyName);

router.delete("/delete-companyName", accessTokenValidator, jobValidator(jobZodSchema("delete")), deleteCompanyName);


//update role

router.patch("/update-role", accessTokenValidator, jobValidator(jobZodSchema("update-role")), updateRole);


//get jobs and my-jobs

router.get("/my-jobs", accessTokenValidator, getOwnersJobs);

router.get("/", accessTokenValidator, getJobs);

//delete job post

router.delete("/delete", accessTokenValidator, jobValidator(jobZodSchema("delete")), deleteJob);


export default router;