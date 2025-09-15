import {
    getMe as getMeRepository,
    updateProfileHandler as updateProfileHandlerRepository,
    uploadProfileImage as uploadProfileImageRepository,
    uploadResume as uploadResumeRepository,
    deleteResume as deleteResumeRepository,
    deleteProfileImage as deleteProfileImageRepository
} from '../repository/userRepository.js';
import leoProfanity from 'leo-profanity';
import { isUrlReachable } from '../utils/isUrlReachable.js';
import { isValidLocation } from '../utils/isValidLocation.js';
import { s3 } from '../config/awsConfig.js';
import { AWS_BUCKET_NAME, AWS_REGION } from '../config/serverConfig.js';

export const getMe = async({ userName }) => {
    //get user info from DB
    const user = await getMeRepository({ userName });

    //if user doesn't exist then throw 404
    if(!user) throw { message: 'User not found', status: 404 };

    //return user
    return user;
}

export const updateProfileHandler = async ({ userName, fullName, resume, bio, skills, socials, location }) => {

  //created an update object and will store the fields which are not undefined or ""
  const update = {};

  // check the fields which are not undefined or empty string
  if (userName) update.userName = userName;
  if (fullName) update.fullName = fullName;
  if (resume) update.resume = resume;
  if (bio) update.bio = leoProfanity.clean(bio);
  if (skills) update.skills = skills;

  //check if the location is valid and if the website url is reachable
  if (location && await isValidLocation(location)) update.location = location;

  // check if the socials links are available and are they reachable  
  if (socials) {
    update.socials = {};
    
    if (socials.github && await isUrlReachable(socials.github)) {
      update.socials.github = socials.github;
    }

    if (socials.linkedin && await isUrlReachable(socials.linkedin)) {
      update.socials.linkedin = socials.linkedin;
    }

    if (socials.twitter && await isUrlReachable(socials.twitter)) {
      update.socials.twitter = socials.twitter;
    }
  }

  //call the repo layer with the filtered update object
  const user = await updateProfileHandlerRepository({ update });
  return user;
};

export const generateUploadUrl = async ({ fileName, fileType, userName }) => {
  const user = await getMeRepository({ userName });

  // 1. Delete old image if it exists
  if (user.profileImage) {
    try {
      const oldKey = user.profileImage.replace(
        `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`,
        ""
      );

      await s3.deleteObject({
        Bucket: AWS_BUCKET_NAME,
        Key: oldKey,
      }).promise();

      console.log(`🗑 Deleted old profile image: ${oldKey}`);
    } catch (err) {
      console.error("Failed to delete old profile image:", err);
    }
  }

  // 2. Create a new pre-signed upload URL
  const key = `profile-images/${userName}-${Date.now()}-${fileName}`;


  const s3Params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Expires: 60, // valid for 60 seconds
    ContentType: fileType,
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
  const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

  // 3. Return like before
  return { uploadUrl, fileUrl };
};

export const uploadProfileImage = async({ fileUrl, userName }) => {

  if(fileUrl) {
    const user = await uploadProfileImageRepository({ fileUrl, userName });
    return user;
  } else {
    throw {
      message: 'fileUrl missing',
      status: 400
    }
  }
}

export const generateResumeUploadUrl = async({ fileName, fileType, userName }) => {
 const user = await getMeRepository({ userName });

 
  // 1. Create a new pre-signed upload URL
  const key = `resume/${userName}-${Date.now()}-${fileName}`;

  const s3Params = {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Expires: 60, // valid for 60 seconds
    ContentType: fileType
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
  const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;

  // 2. Return
  return { uploadUrl, fileUrl };
};

export const uploadResume = async({ fileUrl, userName }) => {

  if(fileUrl) {
    const user = await uploadResumeRepository({ fileUrl, userName });
    return user;
  } else {
    throw {
      message: 'fileUrl missing',
      status: 400
    }
  }
}

export const deleteResume = async({ userName }) => {
  const user = await getMeRepository({ userName });

  // 1. Delete old resume if it exists
  if (user.resume) {
    try {
      const oldKey = user.resume.replace(
        `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`,
        ""
      );

      await s3.deleteObject({
        Bucket: AWS_BUCKET_NAME,
        Key: oldKey,
      }).promise();

      console.log(`🗑 Deleted old resume: ${oldKey}`);
    } catch (err) {
      console.error("Failed to delete old resume:", err);
    }
  }

  const updatedUser = await deleteResumeRepository({ userName });

  return updatedUser;
}

export const getResumeDownloadUrl = async ({ userName }) => {
  const user = await getMeRepository({ userName });

  if (!user?.resume) throw { message: "Resume not found", status: 404 };

  const key = user.resume.replace(
    `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`,
    ""
  );

  const downloadUrl = s3.getSignedUrl("getObject", {
    Bucket: AWS_BUCKET_NAME,
    Key: key,
    Expires: 300, // 5 minutes
  });

  return downloadUrl;
};

export const deleteProfileImage = async({ userName }) => {
  const user = await getMeRepository({ userName });

  // 1. Delete old image if it exists
  if (user.profileImage) {
    try {
      const oldKey = user.profileImage.replace(
        `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`,
        ""
      );

      await s3.deleteObject({
        Bucket: AWS_BUCKET_NAME,
        Key: oldKey,
      }).promise();

      console.log(`🗑 Deleted old profile image: ${oldKey}`);
    } catch (err) {
      console.error("Failed to delete old profile image:", err);
    }
  }

  await deleteProfileImageRepository({ userName });

}