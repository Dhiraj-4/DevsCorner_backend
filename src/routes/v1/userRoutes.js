import express from 'express';
import { accessTokenValidator } from '../../validators/authValidators/accessTokenValidator.js';
import { deleteLocation, deleteProfileImage, deleteResume, deleteSkill, deleteSocialLinks, generateResumeUploadUrl, generateUploadUrl, getMe, getResumeDownloadUrl, updateProfileHandler, uploadLocation, uploadProfileImage, uploadResume, uploadSkills, uploadSocialLinks } from '../../controller/userController.js';
import { userValidator } from '../../validators/userValidators/userValidator.js';
import { updateSchema } from '../../validators/userValidators/updateValidator.js';
import { fileValidator } from '../../validators/userValidators/fileUploader/fileValidator.js';
import { fileSchema } from '../../validators/userValidators/fileUploader/fileValidatorSchema.js';
import { socialLinksValidator } from '../../validators/userValidators/socail links validator/socailLinksValidator.js';
import { socialLinksSchema } from '../../validators/userValidators/socail links validator/socialLinksZodSchema.js';
import { skillsValidator } from '../../validators/userValidators/skills validator/skillsValidator.js';
import { skillsSchema } from '../../validators/userValidators/skills validator/skillsZodSchema.js';
import { locationValidator } from '../../validators/userValidators/locationValidator/locationValidator.js';
import { locationSchema } from '../../validators/userValidators/locationValidator/locationSchema.js';

const router = express.Router();

router.get('/me', accessTokenValidator, getMe);

router.patch('/update-profile', accessTokenValidator, userValidator(updateSchema), updateProfileHandler);

router.post("/generate-upload-url", accessTokenValidator, fileValidator(fileSchema), generateUploadUrl);

router.post("/genarate-resume-upload-url", accessTokenValidator, fileValidator(fileSchema), generateResumeUploadUrl);

router.patch('/upload-profile-image', accessTokenValidator, uploadProfileImage);

router.delete("/profile-image", accessTokenValidator, deleteProfileImage);

router.post("/upload-social-links", accessTokenValidator, socialLinksValidator(socialLinksSchema), uploadSocialLinks);

router.delete("/delete-social-links", accessTokenValidator, socialLinksValidator(socialLinksSchema), deleteSocialLinks);

router.patch("/uplaod-resume", accessTokenValidator, uploadResume);

router.delete("/delete-resume", accessTokenValidator, deleteResume);

router.get("/resume", accessTokenValidator, getResumeDownloadUrl);

router.post("/upload-skills", accessTokenValidator, skillsValidator(skillsSchema), uploadSkills);

router.delete("/delete-skill", accessTokenValidator, skillsValidator(skillsSchema), deleteSkill);

router.post("/upload-location", accessTokenValidator, locationValidator(locationSchema), uploadLocation);

router.delete("/delete-location", accessTokenValidator, deleteLocation);


export default router;