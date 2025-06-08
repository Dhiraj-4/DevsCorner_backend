import { 
    getMe as getMeService,
    updateProfileHandler as updateProfileHandlerService,
    generateUploadUrl as generateUploadUrlService,
    uploadProfileImage as uploadProfileImageService
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
            role: req.body.role,
            socials: req.body.socials,
            location: req.body.location,
            website: req.body.website,
            userName: req.user.userName
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
            fileType: req.body.fileType
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