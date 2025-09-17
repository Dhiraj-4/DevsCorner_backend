import { 
    getMe as getMeService,
    updateBioFullName as updateBioFullNameService,
    generateUploadUrl as generateUploadUrlService,
    uploadProfileImage as uploadProfileImageService,
    generateResumeUploadUrl as generateResumeUploadUrlService,
    uploadResume as uploadResumeService,
    deleteResume as deleteResumeService,
    getResumeDownloadUrl as getResumeDownloadUrlService,
    deleteProfileImage as deleteProfileImageService,
    uploadSocialLinks as uploadSocialLinksService,
    deleteSocialLinks as deleteSocialLinksService,
    uploadSkills as uploadSkillsService,
    deleteSkill as deleteSkillService,
    uploadLocation as uploadLocationService,
    deleteLocation as deleteLocationService
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

export const updateBioFullName = async(req, res) => {
    try {
        const user = await updateBioFullNameService({
            fullName: req.body?.fullName,
            bio: req.body?.bio,
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

export const uploadSocialLinks = async(req, res) => {
    try {
        const updatedUser = await uploadSocialLinksService({
            github: req.body?.socialLinks?.github,
            twitter: req.body?.socialLinks?.twitter,
            linkedin: req.body?.socialLinks?.linkedin,
            userName: req.user.userName,
        });

        return successResponse({
            message: 'uploaded social links',
            res: res,
            info: updatedUser,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteSocialLinks = async(req, res) => {
    try {
        const updatedUser = await deleteSocialLinksService({
            github: req.body?.socialLinks?.github,
            twitter: req.body?.socialLinks?.twitter,
            linkedin: req.body?.socialLinks?.linkedin,
            userName: req.user.userName,
        });

        return successResponse({
            message: 'uploaded social links',
            res: res,
            info: updatedUser,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const uploadSkills = async(req, res) => {
    try {
        const updatedUser = await uploadSkillsService({
            userName: req.user.userName,
            skill: req.body.skill
        });

        return successResponse({
            message: 'uploaded skills',
            res: res,
            info: updatedUser,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteSkill = async(req, res) => {
    try {
        const updatedUser = await deleteSkillService({
            userName: req.user.userName,
            skill: req.body.skill
        });

        return successResponse({
            message: 'deleted skills',
            res: res,
            info: updatedUser,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const uploadLocation = async(req, res) => {
    try {
        await uploadLocationService({
            userName: req.user.userName,
            location: req.body.location
        });

        return successResponse({
            message: 'uploaded location',
            res: res,
            info: req.body.location,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteLocation = async(req, res) => {
    try {
        await deleteLocationService({
            userName: req.user.userName
        });

        return successResponse({
            message: 'deleted location',
            res: res,
            info: "",
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}