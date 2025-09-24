import { Job } from "../schema/jobPostSchema.js";

export const getJob = async({ jobId }) => {
    const job = await Job.findOne({ jobId });
    return job;
}
export const jobPost = async({ jobId, owner, applyLink, companyName, text }) => {
    //find if jobId already exists
    const exists = await Job.findOne({ jobId });

    if(exists) throw { message: "job duplication", status: 400};

    const post = await Job.create({
        jobId,
        owner,
        applyLink,
        companyName,
        text
    });

    return post;
}

export const updateJobText = async({ text, jobId }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { text }, { new: true });

    return job;
}