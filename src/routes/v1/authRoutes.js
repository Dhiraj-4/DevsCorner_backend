import express from 'express';
import { authValidator } from '../../validators/authValidators/authZodValidator.js';
import { signupSchema } from '../../validators/authValidators/signupZodSchema.js';
import { forgotPassword, googleAuth, initiateSignup, login, logout, resetPassword, updatePassword, verifySignup } from '../../controller/authController.js';
import { optTokenValidator } from '../../validators/authValidators/otpTokenValidator.js';
import { loginSchema } from '../../validators/authValidators/loginZodSchema.js';
import { renewAccessToken } from '../../controller/refreshTokenController.js';
import { refreshTokenValidator } from '../../validators/authValidators/refreshTokenValidator.js';
import { forgotPasswdSchema } from '../../validators/authValidators/forgotPasswdZodSchema.js';
import { passwordResetTokenValidator } from '../../validators/authValidators/passwordResetTokenValidator.js';
import { updatePasswordSchema } from '../../validators/authValidators/passwordSchema.js';
import { forgotPassLimiter, loginLimiter, signupLimiter } from '../../utils/rateLimiting.js';
import { googleAuthValidator } from '../../validators/authValidators/googleAuthValidator.js';

const router = express.Router();

router.post('/signup/initiate', signupLimiter, authValidator(signupSchema), initiateSignup);
router.post('/signup/verify', signupLimiter, optTokenValidator, verifySignup);

router.post('/login', loginLimiter, authValidator(loginSchema), login);

router.post('/logout', refreshTokenValidator, logout);

//returns otpVerificationTokn and sends otp
router.post('/forgot-password', forgotPassLimiter, authValidator(forgotPasswdSchema) ,forgotPassword);

//verifies otp and otpVerificationTokn and returns passwordResetToken
router.post("/reset-password/initiate", forgotPassLimiter, optTokenValidator, resetPassword);

//verifies passwordResetToken and resets password
router.post("/update-password", forgotPassLimiter, passwordResetTokenValidator, authValidator(updatePasswordSchema), updatePassword);

router.post('/refresh', refreshTokenValidator, renewAccessToken);

router.post("/google", googleAuthValidator, googleAuth);

export default router;