import {
    getMe as getMeRepository,
    updateBioFullName as updateBioFullNameRepository,
    uploadProfileImage as uploadProfileImageRepository,
    uploadResume as uploadResumeRepository,
    deleteResume as deleteResumeRepository,
    deleteProfileImage as deleteProfileImageRepository,
    uploadSocialLinks as uploadSocialLinksRepository,
    deleteSocialLinks as deleteSocialLinksRepository,
    uploadSkills as uploadSkillsRepository,
    deleteSkill as deleteSkillRepository,
    uploadLocation as uploadLocationRepository,
    deleteLocation as deleteLocationRepository
} from '../repository/userRepository.js';
import leoProfanity from 'leo-profanity';
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

export const updateBioFullName = async ({ userName, fullName, bio }) => {

  //created an update object and will store the fields which are not undefined or ""
  const update = {};

  // check the fields which are not undefined or empty string
  update.userName = userName;
  if (fullName) update.fullName = fullName;
  if (bio) update.bio = leoProfanity.clean(bio);

  //call the repo layer with the filtered update object
  const user = await updateBioFullNameRepository({ update });
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

export const uploadSocialLinks = async({ github, linkedin, twitter, userName }) => {
    const update = {};
    update.userName = userName;
    if(github) update.github = github;
    if(linkedin) update.linkedin = linkedin;
    if(twitter) update.twitter = twitter;

    return await uploadSocialLinksRepository({ update });
}

export const deleteSocialLinks = async({ github, linkedin, twitter, userName }) => {
    const update = {};
    update.userName = userName;
    if(github) update.github = "";
    if(linkedin) update.linkedin = "";
    if(twitter) update.twitter = "";

    return await deleteSocialLinksRepository({ update });
}

export async function uploadSkills({userName, skill}) {
  const user = await getMeRepository({userName});

  if (user.skills && user.skills[skill]) {
    throw { status: 400, message: "Skill already exists" };
  }

  return await uploadSkillsRepository({userName, skill});
}

export const deleteSkill = async({ userName, skill }) => {
  const user = await getMeRepository({ userName });

  if (!user.skills || !user.skills[skill]) {
    throw { status: 404, message: "Skill not found" };
  }

  return await deleteSkillRepository({userName, skill});
}

export const uploadLocation = async({ userName, location }) => {

  if(!isValidLocation(location)) throw { message: "invalid location", status: 400 };

  await uploadLocationRepository({ userName, location });
}

export const deleteLocation = async({ userName }) => {
  return await deleteLocationRepository({ userName });
}