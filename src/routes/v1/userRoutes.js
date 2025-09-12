import express from 'express';
import { accessTokenValidator } from '../../validators/authValidators/accessTokenValidator.js';
import { generateUploadUrl, getMe, updateProfileHandler, uploadProfileImage } from '../../controller/userController.js';
import { userValidator } from '../../validators/userValidators/userValidator.js';
import { updateSchema } from '../../validators/userValidators/updateValidator.js';
import { fileValidator } from '../../validators/userValidators/fileUploader/fileValidator.js';
import { fileSchema } from '../../validators/userValidators/fileUploader/fileValidatorSchema.js';

const router = express.Router();

router.get('/me', accessTokenValidator, getMe);

router.patch('/update-profile', accessTokenValidator, userValidator(updateSchema), updateProfileHandler);

router.post("/generate-upload-url", accessTokenValidator, fileValidator(fileSchema), generateUploadUrl);

router.patch('/upload-profile-image', accessTokenValidator, uploadProfileImage);

export default router;