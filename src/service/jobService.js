import { getJob, isJobOwner, jobPost as jobPostRepository } from "../repository/jobRepository.js";
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
    udpateExperience as udpateExperienceRepository,
    uploadBrandImage as uploadBrandImageRepository,
    deleteBrandImage as deleteBrandImageRepository
} from "../repository/jobRepository.js"
import { parseLocation } from "../utils/isValidLocation.js";
import { AWS_BUCKET_NAME, AWS_REGION } from "../config/serverConfig.js";
import { s3 } from "../config/awsConfig.js";

export const jobPost = async({ userName, text, applyLink, companyName, role, location, locationType, salary, experience}) => {
    const createPost = {};
    
    if(!parseLocation(location)) throw { status: 400, message: "invalid location" };

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

    if(!parseLocation(location)) throw { status: 400, message: "Invalid location" };

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
        locationType: locationType.toLowerCase().trim()
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

export const generateBrandImageUploadUrl = async ({ fileName, fileType, jobId, userName }) => {
  await isJobOwner({ userName, jobId });

  const job = await getJob({ jobId });

  // 1. Delete old brand image if it exists
  if (job.brandImage) {
    try {
      const oldKey = job.brandImage.replace(
        `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`,
        ""
      );

      await s3.deleteObject({
        Bucket: AWS_BUCKET_NAME,
        Key: oldKey,
      }).promise();

      console.log(`🗑 Deleted old brand image: ${oldKey}`);
    } catch (err) {
      console.error("Failed to delete old brand image:", err);
    }
  }

  // 2. Create a new pre-signed upload URL
  const key = `brand-images/${jobId}-${Date.now()}-${fileName}`;

  const s3Params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Expires: 60, // valid for 60 seconds
    ContentType: fileType
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
  const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

  // 3. Return pre-signed upload URL and file URL
  return { uploadUrl, fileUrl };
};

export const uploadBrandImage = async({ fileUrl, userName, jobId }) => {
  await isJobOwner({ userName, jobId });

  if(fileUrl) {
    const job = await uploadBrandImageRepository({ fileUrl, jobId });
    return job;
  } else {
    throw {
      message: 'fileUrl missing',
      status: 400
    }
  }
}

export const deleteBrandImage = async({ jobId, userName }) => {
    await isJobOwner({ userName, jobId });

    const oldJob = await getJob({ jobId });

  if (oldJob.brandImage) {
    try {
      const oldKey = oldJob.brandImage.replace(
        `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`,
        ""
      );

      await s3.deleteObject({
        Bucket: AWS_BUCKET_NAME,
        Key: oldKey,
      }).promise();

      console.log(`🗑 Deleted old brand image: ${oldKey}`);
    } catch (err) {
      console.error("Failed to delete old brand image:", err);
    }
  }

  const job = await deleteBrandImageRepository({ jobId });

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