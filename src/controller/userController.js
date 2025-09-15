import { 
    getMe as getMeService,
    updateProfileHandler as updateProfileHandlerService,
    generateUploadUrl as generateUploadUrlService,
    uploadProfileImage as uploadProfileImageService,
    generateResumeUploadUrl as generateResumeUploadUrlService,
    uploadResume as uploadResumeService,
    deleteResume as deleteResumeService,
    getResumeDownloadUrl as getResumeDownloadUrlService,
    deleteProfileImage as deleteProfileImageService
} from '../service/userService.js'
import { errorResponse, successResponse } from "../utils/responseHelper.js";

export const getMe = async(req, res) => {
    try {
        const user = await getMeService({
            userName: req.user.userName
        });
        return successResponse({
            message: 'fetched user',
            status: 200,
            res: res,
            info: user
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateProfileHandler = async(req, res) => {
    try {
        const user = await updateProfileHandlerService({
            fullName: req.body.fullName,
            bio: req.body.bio,
            skills: req.body.skills,
            location: req.body.location,
            resume: req.body.resume,
            socials: req.body.socials,
            userName: req.user.userName,
        });

        return successResponse({
            message: 'User updated',
            status: 200,
            info: user,
            res: res
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const generateUploadUrl = async(req, res) => {
    try {
        const { uploadUrl, fileUrl } = await generateUploadUrlService({
            fileName: req.body.fileName,
            fileType: req.body.fileType,
            userName: req.user.userName
        });

        return successResponse({
            message: 'Fetched pre-signed url',
            status: 200,
            info: { uploadUrl, fileUrl },
            res: res
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const uploadProfileImage = async(req, res) => {
    try {
        const user = await uploadProfileImageService({
            fileUrl: req.body.fileUrl,
            userName: req.user.userName
        });

        return successResponse({
            message: 'profile image uploaded',
            res: res,
            info: user,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const generateResumeUploadUrl = async(req, res) => {
    try {
        const { uploadUrl, fileUrl } = await generateResumeUploadUrlService({
            fileName: req.body.fileName,
            fileType: req.body.fileType,
            userName: req.user.userName
        });

        return successResponse({
            message: 'Fetched pre-signed url',
            status: 200,
            info: { uploadUrl, fileUrl },
            res: res
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const uploadResume = async(req, res) => {
    try {
        const user = await uploadResumeService({
            fileUrl: req.body.fileUrl,
            userName: req.user.userName
        });

        return successResponse({
            message: 'resume uploaded',
            res: res,
            info: user,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteResume = async(req, res) => {
    try {
        const updatedUser = await deleteResumeService({ userName: req.user.userName });

        return successResponse({
            message: 'resume deleted',
            res: res,
            info: updatedUser,
            status: 200
        });

    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getResumeDownloadUrl = async(req, res) => {
    try {
        const url = await getResumeDownloadUrlService({
            userName: req.user.userName
        });

        return successResponse({
            message: 'resume url',
            res: res,
            info: url,
            status: 200
        });

    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteProfileImage = async(req, res) => {
    try {
        await deleteProfileImageService({
            userName: req.user.userName
        });

        return successResponse({
            message: 'deleted profile image',
            res: res,
            info: "",
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}