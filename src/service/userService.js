import {
    getMe as getMeRepository,
    updateProfileHandler as updateProfileHandlerRepository,
    uploadProfileImage as uploadProfileImageRepository
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

export const updateProfileHandler = async ({ userName, fullName, bio, role, socials, location, website }) => {

  //created an update object and will store the fields which are not undefined or ""
  const update = {};

  // check the fields which are not undefined or empty string
  if (userName) update.userName = userName;
  if (fullName) update.fullName = fullName;
  if (bio) update.bio = leoProfanity.clean(bio);
  if (role) update.role = role;

  //check if the location is valid and if the website url is reachable
  if (location && await isValidLocation(location)) update.location = location;
  if (website && await isUrlReachable(website)) update.website = website;

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

export const generateUploadUrl = async({ fileName, fileType }) => {

  const s3Params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `profile-images/${fileName}`,
    Expires: 60, // valid for 60 seconds
    ContentType: fileType,
    ACL: "public-read",
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
  const fileUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/profile-images/${fileName}`;

  return { uploadUrl, fileUrl };
}

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