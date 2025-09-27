import { Job } from "../schema/jobPostSchema.js";

export const getJob = async({ jobId }) => {
    const job = await Job.findOne({ jobId });
    return job;
}
export const jobPost = async({ jobId, owner, applyLink, companyName, text, role }) => {
    //find if jobId already exists
    const exists = await Job.findOne({ jobId });

    if(exists) throw { message: "job duplication", status: 400};

    const post = await Job.create({
        jobId,
        role,
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

export const updateApplyLink = async({ applyLink, jobId }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { applyLink }, { new: true });
    return job;
}

export const updateCompanyName = async({ companyName, jobId }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { companyName }, { new: true });
    return job; 
}

export const updateRole = async({ role, jobId }) => {
    const job = await Job.findByIdAndUpdate({ jobId }, { role }, { new: true });
    return job;
}

export const deleteJob = async({ jobId }) => {
    const job = await Job.findOneAndDelete({ jobId });
    return job;
}