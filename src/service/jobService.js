import { jobPost as jobPostRepository } from "../repository/jobRepository.js";
import {
    getJob as getJobRepository,
    updateJobText as updateJobTextRepository
} from "../repository/jobRepository.js"

export const jobPost = async({ owner, text, applyLink, companyName }) => {
    const createPost = {};

    if(applyLink) createPost.applyLink = applyLink;
    else createPost.applyLink = "";

    if(companyName) createPost.companyName = companyName;
    else createPost.companyName = "indie";

    const jobId = `${owner}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const job = await jobPostRepository({
        jobId,
        owner,
        text,
        applyLink: createPost.applyLink,
        companyName: createPost.companyName
    });

    return job;
}

export const updateJobText = async({ userName, jobId, text }) => {
    if(!jobId) throw { message: "missing job id", status: 400 };
    const oldJob = await getJobRepository({ jobId });

    if(!oldJob) throw { message: "invalid job id", status: 400 };
    if(oldJob != userName) throw { message: "invalid owner", status: 403};

    const job = await updateJobTextRepository({
        text,
        jobId
    });

    return job;
}
