import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { 
    jobPost as jobPostService,
    updateJobText as updateJobTextService
} from "../service/jobService.js";

export const jobPost = async(req, res) => {
    try {
        const job = await jobPostService({
            owner: req.user.userName,
            text: req.body.text,
            applyLink: req.body?.applyLink,
            companyName: req.body?.companyName
        });

        return successResponse({
            message: "job post created",
            status: 201,
            res: res,
            info: job
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateJobText = async(req, res) => {
    try {
        const job = await updateJobTextService({
            userName: req.user.userName,
            text: req.body.text,
            jobId: req.body?.jobId
        });

        return successResponse({
            message: "job text changed",
            status: 200,
            res: res,
            info: job
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}