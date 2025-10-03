import { errorResponse, successResponse } from "../utils/responseHelper.js";
import { 
    jobPost as jobPostService,
    updateJobText as updateJobTextService,
    updateApplyLink as updateApplyLinkService,
    updateCompanyName as updateCompanyNameService,
    deleteApplyLink as deleteApplyLinkService,
    deleteCompanyName as deleteCompanyNameService,
    deleteJob as deleteJobService,
    updateRole as updateRoleService,
    getOwnersJobs as getOwnersJobsService,
    getJobs as getJobsService
} from "../service/jobService.js";

export const jobPost = async(req, res) => {
    try {
        const job = await jobPostService({
            userName: req.user.userName,
            text: req.body.text,
            applyLink: req.body?.applyLink,
            companyName: req.body?.companyName,
            role: req.body.role
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
            jobId: req.body.jobId
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

export const updateApplyLink = async(req, res) => {
    try {
        const job = await updateApplyLinkService({
            userName: req.user.userName,
            jobId: req.body.jobId,
            applyLink: req.body.applyLink
        });

        return successResponse({
            message: "updated job apply link",
            status: 200,
            res: res,
            info: job
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateCompanyName = async(req, res) => {
    try {
        const job = await updateCompanyNameService({
            userName: req.user.userName,
            jobId: req.body.jobId,
            companyName: req.body.companyName
        });

        return successResponse({
            message: "updated job company name",
            status: 200,
            res: res,
            info: job
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteApplyLink = async(req, res) => {
    try {
        const job = await deleteApplyLinkService({
            userName: req.user.userName,
            jobId: req.body.jobId
        });

        return successResponse({
            message: "deleted job apply link",
            status: 200,
            res: res,
            info: job
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteCompanyName = async(req, res) => {
    try {
        const job = await deleteCompanyNameService({
            userName: req.user.userName,
            jobId: req.body.jobId
        });

        return successResponse({
            message: "deleted job company name",
            status: 200,
            res: res,
            info: job
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateRole = async(req, res) => {
    try {
        const job = await updateRoleService({
            userName: req.user.userName,
            role: req.body.role,
            jobId: req.body.jobId
        });

        return successResponse({
            message: "updated role",
            status: 200,
            res: res,
            info: job
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getOwnersJobs = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const response = await getOwnersJobsService({
            userName: req.user.userName,
            page
        });

        return successResponse({
            message: "Fetched Owner's jobs",
            status: 200,
            res: res,
            info: response
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getJobs = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        const response = await getJobsService({
            page
        });

        return successResponse({
            message: "Fetched jobs",
            status: 200,
            res: res,
            info: response
        });
    } catch (error) {
        return errorResponse({ error, res });        
    }
}

export const deleteJob = async(req, res) => {
    try {
        const job = await deleteJobService({
            userName: req.user.userName,
            jobId: req.body.jobId
        });

        return successResponse({
            message: "deleted job",
            status: 200,
            res: res,
            info: job
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}