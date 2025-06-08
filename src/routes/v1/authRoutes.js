import express from 'express';
import { authValidator } from '../../validators/authValidators/authZodValidator.js';
import { signupSchema } from '../../validators/authValidators/signupZodSchema.js';
import { forgotPassword, initiateSignup, login, logout, resetPassword, updatePassword, verifySignup } from '../../controller/authController.js';
import { optTokenValidator } from '../../validators/authValidators/otpTokenValidator.js';
import { loginSchema } from '../../validators/authValidators/loginZodSchema.js';
import { renewAccessToken } from '../../controller/refreshTokenController.js';
import { refreshTokenValidator } from '../../validators/authValidators/refreshTokenValidator.js';
import { accessTokenValidator } from '../../validators/authValidators/accessTokenValidator.js';
import { forgotPasswdSchema } from '../../validators/authValidators/forgotPasswdZodSchema.js';

const router = express.Router();

router.post('/signup/initiate', authValidator(signupSchema), initiateSignup);
router.post('/signup/verify', optTokenValidator, verifySignup);

router.post('/login', authValidator(loginSchema), login);

router.post('/logout', accessTokenValidator, logout);

router.post('/forgot-password', authValidator(forgotPasswdSchema) ,forgotPassword);

router.post("/reset-password", optTokenValidator, resetPassword);

router.post("/update-password", updatePassword);

router.post('/refresh', refreshTokenValidator, renewAccessToken);

export default router;