import { Job } from "../schema/jobPostSchema.js";
import { User } from "../schema/userSchema.js";

export const getJob = async({ jobId }) => {
    const job = await Job.findOne({ jobId });
    return job;
}
export const jobPost = async({ jobId, userName, applyLink, companyName, text, role }) => {
    //find if jobId already exists
    const exists = await Job.findOne({ jobId });

    if(exists) throw { message: "job duplication", status: 400};

    const user = await User.findOne({ userName }).select("_id");

    if(!user) throw { message: "invalid user" };

    const post = await Job.create({
        jobId,
        role,
        owner: user._id,
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

export const getOwnersJobs = async ({ userName, limit, skip }) => {
    const user = await User.findOne({ userName }).select("_id");
    if (!user) return [];

    const jobs = await Job.find({ owner: user._id })
                          .skip(skip)
                          .limit(limit)
                          .populate("owner", "fullName userName profileImage");

    return jobs;
};

export const getJobs = async({ limit, skip }) => {
    const jobs = await Job.find()
                            .skip(skip)
                            .limit(limit)
                            .populate("owner", "fullName userName profileImage");
    return jobs;
}

export const deleteJob = async({ jobId }) => {
    const job = await Job.findOneAndDelete({ jobId });
    return job;
}

export const isOwner = async({ jobId, userName }) => {
    const oldJob = await getJob({ jobId });
    
    if(!oldJob) throw { message: "invalid job id", status: 400 };
    
    let user = await User.findOne({ userName }).select("_id");
    
    if(oldJob.owner != user._id) throw { message: "invalid owner", status: 403};
}