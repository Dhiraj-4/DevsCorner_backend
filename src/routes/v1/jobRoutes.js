import express from "express";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import { jobValidator } from "../../validators/jobValidators/jobValidator.js";
import { jobZodSchema } from "../../validators/jobValidators/jobZodSchema.js";
import { 
    deleteApplyLink, deleteCompanyName, deleteJob, getJobs, 
    getOwnersJobs, jobPost, udpateExperience, updateApplyLink, updateCompanyName, 
    updateJobText, updateLocation, updateLocationType, updateRole, 
    updateSalary
} from "../../controller/jobController.js";

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

// update location
router.patch("/update-location", accessTokenValidator, jobValidator(jobZodSchema("update-location")), updateLocation);

// update location type
router.patch("/update-locationType", accessTokenValidator, jobValidator(jobZodSchema("udpate-locationType")), updateLocationType);

// update salary
router.patch("/update-salary", accessTokenValidator, jobValidator(jobZodSchema("update-salary")), updateSalary);

// update experience
router.patch("/update-experience", accessTokenValidator, jobValidator(jobZodSchema("update-experience")), udpateExperience);

//get jobs and my-jobs

router.get("/my-jobs", accessTokenValidator, getOwnersJobs);

router.get("/", accessTokenValidator, getJobs);

//delete job post

router.delete("/delete", accessTokenValidator, jobValidator(jobZodSchema("delete")), deleteJob);


export default router;