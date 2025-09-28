import { jobPost as jobPostRepository } from "../repository/jobRepository.js";
import { v4 as uuidv4 } from "uuid";
import {
    getJob as getJobRepository,
    updateJobText as updateJobTextRepository,
    updateApplyLink as updateApplyLinkRepository,
    updateCompanyName as updateCompanyNameRepository,
    deleteJob as deleteJobRepository,
    updateRole as updateRoleRespository,
    getOwnersJobs as getOwnersJobsRepository
} from "../repository/jobRepository.js"

export const jobPost = async({ owner, text, applyLink, companyName, role }) => {
    const createPost = {};

    if(applyLink) createPost.applyLink = applyLink;
    else createPost.applyLink = "";

    if(companyName) createPost.companyName = companyName;
    else createPost.companyName = "indie";

    const jobId = uuidv4();

    const job = await jobPostRepository({
        jobId,
        role,
        owner,
        text,
        applyLink: createPost.applyLink,
        companyName: createPost.companyName
    });

    return job;
}

export const updateJobText = async({ userName, jobId, text }) => {

    const oldJob = await getJobRepository({ jobId });

    if(!oldJob) throw { message: "invalid job id", status: 400 };
    if(oldJob.owner != userName) throw { message: "invalid owner", status: 403};

    const job = await updateJobTextRepository({
        text,
        jobId
    });

    return job;
}

export const updateApplyLink = async({ userName, jobId, applyLink }) => {
    const oldJob = await getJobRepository({ jobId });

    if(!oldJob) throw { message: "invalid job id", status: 400 };
    if(oldJob.owner != userName) throw { message: "invalid owner", status: 403};

    if(!(await isUrlReachable(applyLink))) throw { message: "invalid apply link", status: 400 };

    const job = await updateApplyLinkRepository({
        jobId,
        applyLink
    });

    return job;
}

export const updateCompanyName = async({ userName, companyName, jobId }) => {
    const oldJob = await getJobRepository({ jobId });

    if(!oldJob) throw { message: "invalid job id", status: 400 };
    if(oldJob.owner != userName) throw { message: "invalid owner", status: 403};

    const job = await updateCompanyNameRepository({
        jobId,
        companyName
    });

    return job;
}

export const deleteApplyLink = async({ userName, jobId }) => {
    const oldJob = await getJobRepository({ jobId });

    if(!oldJob) throw { message: "invalid job id", status: 400 };
    if(oldJob.owner != userName) throw { message: "invalid owner", status: 403};

    const job = await updateApplyLinkRepository({
        jobId,
        applyLink: ""
    });

    return job;
}

export const deleteCompanyName = async({ userName, jobId }) => {
    const oldJob = await getJobRepository({ jobId });

    if(!oldJob) throw { message: "invalid job id", status: 400 };
    if(oldJob.owner != userName) throw { message: "invalid owner", status: 403};

    const job = await updateCompanyNameRepository({
        jobId,
        companyName: "indie"
    });

    return job;
}

export const updateRole = async({ userName, jobId, role }) => {
    const oldJob = await getJobRepository({ jobId });

    if(!oldJob) throw { message: "invalid job id", status: 400 };
    if(oldJob.owner != userName) throw { message: "invalid owner", status: 403};

    const job = updateRoleRespository({
        jobId,
        role
    });

    return job;
}

export const getOwnersJobs = async({ userName }) => {

    const jobs = getOwnersJobsRepository({
        userName
    });

    return jobs;
}

export const deleteJob = async({ userName, jobId }) => {
    const oldJob = await getJobRepository({ jobId });

    if(!oldJob) throw { message: "invalid job id", status: 400 };
    if(oldJob.owner != userName) throw { message: "invalid owner", status: 403};

    const job = await deleteJobRepository({
        jobId
    });

    return job;
}