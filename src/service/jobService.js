import { isOwner, jobPost as jobPostRepository } from "../repository/jobRepository.js";
import { v4 as uuidv4 } from "uuid";
import {
    getJob as getJobRepository,
    updateJobText as updateJobTextRepository,
    updateApplyLink as updateApplyLinkRepository,
    updateCompanyName as updateCompanyNameRepository,
    deleteJob as deleteJobRepository,
    updateRole as updateRoleRespository,
    getOwnersJobs as getOwnersJobsRepository,
    getJobs as getJobsRepository
} from "../repository/jobRepository.js"

export const jobPost = async({ userName, text, applyLink, companyName, role }) => {
    const createPost = {};

    if(applyLink) createPost.applyLink = applyLink;
    else createPost.applyLink = "";

    if(companyName) createPost.companyName = companyName;
    else createPost.companyName = "indie";

    const jobId = uuidv4();

    const job = await jobPostRepository({
        jobId,
        role,
        userName,
        text,
        applyLink: createPost.applyLink,
        companyName: createPost.companyName
    });

    return job;
}

export const updateJobText = async({ userName, jobId, text }) => {

    await isOwner({ userName, jobId });

    const job = await updateJobTextRepository({
        text,
        jobId
    });

    return job;
}

export const updateApplyLink = async({ userName, jobId, applyLink }) => {
    await isOwner({ userName, jobId });;

    if(!(await isUrlReachable(applyLink))) throw { message: "invalid apply link", status: 400 };

    const job = await updateApplyLinkRepository({
        jobId,
        applyLink
    });

    return job;
}

export const updateCompanyName = async({ userName, companyName, jobId }) => {
    await isOwner({ userName, jobId });

    const job = await updateCompanyNameRepository({
        jobId,
        companyName
    });

    return job;
}

export const deleteApplyLink = async({ userName, jobId }) => {
    await isOwner({ userName, jobId });

    const job = await updateApplyLinkRepository({
        jobId,
        applyLink: ""
    });

    return job;
}

export const deleteCompanyName = async({ userName, jobId }) => {
    await isOwner({ userName, jobId });

    const job = await updateCompanyNameRepository({
        jobId,
        companyName: "indie"
    });

    return job;
}

export const updateRole = async({ userName, jobId, role }) => {
    await isOwner({ userName, jobId });

    const job = updateRoleRespository({
        jobId,
        role
    });

    return job;
}

export const getOwnersJobs = async({ userName, page }) => {

    const limit = 10;
    const skip = (page - 1) * limit;

    const jobs = getOwnersJobsRepository({
        userName,
        limit,
        skip
    });

    return { 
        jobs, 
        hasMore: (limit === jobs.length) 
    };
}

export const getJobs = async({ page }) => {
    const limit = 10;
    const skip = (page - 1) * limit;

    const jobs = getJobsRepository({
        limit,
        skip
    });

    return { 
        jobs, 
        hasMore: (limit === jobs.length) 
    };
}

export const deleteJob = async({ userName, jobId }) => {
    await isOwner({ userName, jobId });

    const job = await deleteJobRepository({
        jobId
    });

    return job;
}