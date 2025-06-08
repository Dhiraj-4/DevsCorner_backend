import {
    initiateSignup as initiateSignupService,
    verifySignup as verifySignupService,
    login as loginService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
    updatePassword as updatePasswordService
} from '../service/authService.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';

export const initiateSignup = async(req, res) => {
    try {
        const otpVerificationToken = await initiateSignupService({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            fullName: req.body.fullName,
            userName: req.body.userName
        });

        return successResponse({
            message: "Otp send",
            res: res,
            status: 200,
            info: otpVerificationToken
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const verifySignup = async(req, res) => {
    try {
            await verifySignupService({
            email: req.user.email,
            userName: req.user.userName,
            fullName: req.user.fullName,
            role: req.user.role,
            password: req.user.password,
            otp: req.user.otp,
            enteredOtp: req.body.otp
        });
        
        return successResponse({
            message: "User created",
            status: 201,
            info: '',
            res
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const login = async(req, res) => {
    try {
        const response = await loginService({
            identifier: req.body.identifier,
            password: req.body.password
        });

        res.status(200).cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
        }).json({
        message: 'Login Successful',
        success: true,
        info: response.accessToken
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const logout = async(req, res) => {
    try {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          path: "/",
        });

        return successResponse({
            message: "Logout successful",
            status: 200,
            res: res
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

// returns otpVerificationToken and send otp to the users email
export const forgotPassword = async(req, res) => {
    try {
        const otpVerificationToken = await forgotPasswordService({
            identifier: req.body.identifier
        });

        return successResponse({
            message: 'Otp send',
            status: 200,
            res: res,
            info: otpVerificationToken
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const resetPassword = async(req, res) => {
    try {
        const passwordResetToken = await resetPasswordService({
            otp: req.body.otp,
            userName: req.user.userName
        });

        return successResponse({
            message: 'Fetch password reset token',
            status: 200,
            info: passwordResetToken,
            res: res
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updatePassword = async(req, res) => {

    const authHeader = req.headers['authorization'];
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access token missing or malformed',
            success: false
        });
    }
    const accessToken = authHeader.split(' ')[1];

    try {
        await updatePasswordService({
            passwordResetToken: accessToken,
            password: req.body.password
        });

        return successResponse({
            message: "password updated",
            status: 200,
            res: res
        })
    } catch (error) {
        return errorResponse({ error, res });
    }
}