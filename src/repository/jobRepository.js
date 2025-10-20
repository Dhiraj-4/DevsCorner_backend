import { Job } from "../schema/jobPostSchema.js";
import { User } from "../schema/userSchema.js";

export const getJob = async({ jobId }) => {
    const job = await Job.findOne({ jobId }).populate("owner","userName");
    return job;
}
export const jobPost = async({ jobId, userName, applyLink, companyName, text, role, location, locationType, salary, experience }) => {
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
        text,
        location,
        locationType,
        salary,
        experience
    });

    return post;
}

export const updateJobText = async({ text, jobId }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { text }, { new: true });

    return job;
}

export const updateLocation = async({ jobId, location }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { location }, { new: true });
    return job;
}

export const updateLocationType = async({ jobId, locationType }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { locationType }, { new: true });
    return job;
}

export const updateSalary = async({ jobId, salary }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { salary }, { new: true });
    return job;
}

export const udpateExperience = async({ jobId, experience }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { experience }, { new: true });
    return job;
}

export const uploadBrandImage = async({ fileUrl, jobId }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { brandImage: fileUrl }, { new: true });
    return job;
}

export const deleteBrandImage = async({ jobId }) => {
    const job = await Job.findOneAndUpdate({ jobId }, { brandImage: "" }, { new: true });
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
    const job = await Job.findOneAndUpdate({ jobId }, { role }, { new: true });
    return job;
}

export const getOwnersJobs = async ({ userName, limit, skip }) => {
    const user = await User.findOne({ userName }).select("_id");
    if (!user) return [];

    const jobs = await Job.find({ owner: user._id })
                          .sort({ updatedAt: -1 })
                          .skip(skip)
                          .limit(limit)
                          .populate("owner", "fullName userName profileImage");

    return jobs;
};

export const getJobs = async({ limit, skip }) => {
    const jobs = await Job.find()
                            .sort({ updatedAt: -1 })
                            .skip(skip)
                            .limit(limit)
                            .populate("owner", "fullName userName profileImage");
    return jobs;
}

export const deleteJob = async({ jobId }) => {
    const job = await Job.findOneAndDelete({ jobId });
    return job;
}

export const isJobOwner = async({ jobId, userName }) => {
    const oldJob = await getJob({ jobId });
    
    if(!oldJob) throw { message: "invalid job id", status: 400 };
    
    let user = await User.findOne({ userName }).select("_id");
    
    if(String(oldJob.owner._id) != String(user._id)) throw { message: "invalid owner", status: 403};
}