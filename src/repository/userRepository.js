import { User } from '../schema/userSchema.js';

export const getMe = async({ userName }) => {
    const user = await User.findOne({ userName });
    return user;
}

export const updateBioFullName = async ({ update }) => {
  const user = await User.findOne({ userName: update.userName });
  if (!user) throw { message: 'User not found', status: 404 };

  // Remove userName from the update payload to avoid accidentally changing it
  const { userName, ...fieldsToUpdate } = update;

  // remove empty or undefined fields from fieldsToUpdate, just to be safe
  const cleanedUpdate = Object.fromEntries(
    Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined && value !== "")
  );

  // If nothing is being updated
  if (Object.keys(cleanedUpdate).length === 0) {
    throw { message: "No valid fields provided to update.", status: 400 };
  }

  //update the user with cleanedUpdate
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: cleanedUpdate },
    { new: true } // returns updated document
  );

  //return updatedUser
  return updatedUser;
};

export const uploadProfileImage = async({ fileUrl, userName }) => {
  const user = await User.findOne({ userName });

  if(!user) throw { message: 'User not found', status: 404 }

  const updatedUser = await User.findByIdAndUpdate(user._id, { profileImage: fileUrl }, { new: true });

  return updatedUser;
}

export const uploadResume = async({ fileUrl, userName }) => {
  const user = await User.findOne({ userName });

  if(!user) throw { message: "User not found", status: 404 };

  const updatedUser = await User.findByIdAndUpdate(user._id, { resume: fileUrl }, { new: true });

  return updatedUser;
}

export const deleteResume = async ({ userName }) => {
  const user = await User.findOne({ userName });

  if (!user) throw { message: "User not found", status: 404 };

  // Update resume to "" in DB
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { resume: "" },
    { new: true }
  );

  return updatedUser;
};

export const deleteProfileImage = async({ userName }) => {
  const user = await User.findOne({ userName });

  await User.findByIdAndUpdate(
    user._id,
    { profileImage: "" },
    { new: true }
  );

}

export const uploadSocialLinks = async ({ update }) => {
  const { userName, ...socialLinks } = update; // separate userName

  // Build update object only with available social fields
  const fieldsToUpdate = {};
  if (socialLinks.github) fieldsToUpdate["socialLinks.github"] = socialLinks.github;
  if (socialLinks.linkedin) fieldsToUpdate["socialLinks.linkedin"] = socialLinks.linkedin;
  if (socialLinks.twitter) fieldsToUpdate["socialLinks.twitter"] = socialLinks.twitter;

  // Update user by userName
  return await User.findOneAndUpdate(
    { userName },
    { $set: fieldsToUpdate },
    { new: true } // return updated user
  ).lean();
};

export const deleteSocialLinks = async ({ update }) => {
  const { userName, ...socialLinks } = update;

  const fieldsToUpdate = {};
  if ("github" in socialLinks) fieldsToUpdate["socialLinks.github"] = "";
  if ("linkedin" in socialLinks) fieldsToUpdate["socialLinks.linkedin"] = "";
  if ("twitter" in socialLinks) fieldsToUpdate["socialLinks.twitter"] = "";

  return await User.findOneAndUpdate(
    { userName },
    { $set: fieldsToUpdate },
    { new: true }
  ).lean();
};

export const uploadSkills = async ({ skill, userName }) => {
  return await User.findOneAndUpdate(
    { userName },
    { $set: { [`skills.${skill}`]: skill } },
    { new: true }
  );
};

export const deleteSkill = async ({ userName, skill }) => {
  return await User.findOneAndUpdate(
    { userName },
    { $unset: { [`skills.${skill}`]: 1 } },
    { new: true }
  );
};

export const uploadLocation = async({ userName, location }) => {
  return await User.findOneAndUpdate(
    { userName },
    { location },
    { new: true }
  );
}

export const deleteLocation = async({ userName }) => {
  await User.findOneAndUpdate(
    { userName },
    { location: "" },
    { new: true }
  );
}