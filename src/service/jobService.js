import { isJobOwner, jobPost as jobPostRepository } from "../repository/jobRepository.js";
import { v4 as uuidv4 } from "uuid";
import leoProfanity from 'leo-profanity';
import {
    updateJobText as updateJobTextRepository,
    updateApplyLink as updateApplyLinkRepository,
    updateCompanyName as updateCompanyNameRepository,
    deleteJob as deleteJobRepository,
    updateRole as updateRoleRespository,
    getOwnersJobs as getOwnersJobsRepository,
    getJobs as getJobsRepository,
    updateLocation as updateLocationRepository,
    updateLocationType as updateLocationTypeRepository,
    updateSalary as updateSalaryRepository,
    udpateExperience as udpateExperienceRepository
} from "../repository/jobRepository.js"
import { verifyLocation } from "../utils/isValidLocation.js";

export const jobPost = async({ userName, text, applyLink, companyName, role, location, locationType, salary, experience}) => {
    const createPost = {};
    
    if(!(await verifyLocation(location))) throw { status: 400, message: "invalid location" };

    if((locationType.toLowerCase() !== "hybrid") && (locationType.toLowerCase() !== "remote") && (locationType.toLowerCase() !== "fulltime")) {
        throw { status: 400, message: "Invalid location type" }
    }
    
    if(applyLink) createPost.applyLink = applyLink;
    else createPost.applyLink = "";

    let cleanText = leoProfanity.clean(text);

    if(companyName) createPost.companyName = companyName;
    else createPost.companyName = "indie";

    const jobId = uuidv4();

    const job = await jobPostRepository({
        jobId,
        role,
        userName,
        text: cleanText,
        applyLink: createPost.applyLink,
        companyName: createPost.companyName,
        location,
        locationType,
        salary,
        experience
    });

    return job;
}

export const updateJobText = async({ userName, jobId, text }) => {

    await isJobOwner({ userName, jobId });

    let cleanText = leoProfanity.clean(text);

    const job = await updateJobTextRepository({
        text: cleanText,
        jobId
    });

    return job;
}

export const updateLocation = async({ userName, jobId, location }) => {
    await isJobOwner({ userName, jobId });

    if(!(await verifyLocation(location))) throw { status: 400, message: "Invalid location" };

    const job = await updateLocationRepository({
        jobId,
        location
    });

    return job;
}

export const updateLocationType = async({ userName, jobId, locationType }) => {
    await isJobOwner({ userName, jobId });

    if( (locationType.toLowerCase() !== "hybrid") &&
        (locationType.toLowerCase() !== "remote") &&
        (locationType.toLowerCase() !== "fulltime")
    ) {
        throw { status: 400, message: "Invalid location type" }
    }

    const job = await updateLocationTypeRepository({
        jobId,
        locationType
    });

    return job;
}

export const updateSalary = async({ userName, jobId, salary }) => {
    await isJobOwner({ userName, jobId });

    const job = await updateSalaryRepository({
        jobId,
        salary
    });

    return job;
}

export const udpateExperience = async({ userName, jobId, experience }) => {
    await isJobOwner({ userName, jobId });

    const job = await udpateExperienceRepository({
        jobId,
        experience
    });

    return job;
}

export const updateApplyLink = async({ userName, jobId, applyLink }) => {
    await isJobOwner({ userName, jobId });;

    const job = await updateApplyLinkRepository({
        jobId,
        applyLink
    });

    return job;
}

export const updateCompanyName = async({ userName, companyName, jobId }) => {
    await isJobOwner({ userName, jobId });

    const job = await updateCompanyNameRepository({
        jobId,
        companyName
    });

    return job;
}

export const deleteApplyLink = async({ userName, jobId }) => {
    await isJobOwner({ userName, jobId });

    const job = await updateApplyLinkRepository({
        jobId,
        applyLink: ""
    });

    return job;
}

export const deleteCompanyName = async({ userName, jobId }) => {
    await isJobOwner({ userName, jobId });

    const job = await updateCompanyNameRepository({
        jobId,
        companyName: "indie"
    });

    return job;
}

export const updateRole = async({ userName, jobId, role }) => {
    await isJobOwner({ userName, jobId });

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

    return jobs
}

export const getJobs = async({ page }) => {
    const limit = 10;
    const skip = (page - 1) * limit;

    const jobs = getJobsRepository({
        limit,
        skip
    });

    return jobs;
}

export const deleteJob = async({ userName, jobId }) => {
    await isJobOwner({ userName, jobId });

    const job = await deleteJobRepository({
        jobId
    });

    return job;
}