import express from "express";
import { accessTokenValidator } from "../../validators/authValidators/accessTokenValidator.js";
import { jobValidator } from "../../validators/jobValidators/jobValidator.js";
import { jobZodSchema } from "../../validators/jobValidators/jobZodSchema.js";
import { 
    deleteApplyLink, deleteBrandImage, deleteCompanyName, deleteJob, generateBrandImageUploadUrl, getJobs, 
    getOwnersJobs, jobPost, udpateExperience, updateApplyLink, updateCompanyName, 
    updateJobText, updateLocation, updateLocationType, updateRole, 
    updateSalary,
    uploadBrandImage
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

// get pre signed url
router.post("/genarate-brand-image-upload-url", accessTokenValidator, jobValidator(jobZodSchema("generate-upload-url")), generateBrandImageUploadUrl);

// upload brand image
router.patch("/upload-brandImage", accessTokenValidator, jobValidator(jobZodSchema("upload-brand-image")), uploadBrandImage);

// delete brand image
router.patch("/delete-brandImage", accessTokenValidator, jobValidator(jobZodSchema("delete")), deleteBrandImage);

//get jobs and my-jobs

router.get("/my-jobs", accessTokenValidator, getOwnersJobs);

router.get("/", accessTokenValidator, getJobs);

//delete job post

router.delete("/delete", accessTokenValidator, jobValidator(jobZodSchema("delete")), deleteJob);


export default router;