import { User } from "../schema/userSchema.js";

export const initiateSignup = async({ email, userName }) => {

    const user = await User.findOne({ $or: [{ email }, { userName }] });
        if(user) {
            if(user.email === email) {
                throw { message: "Email already exists", status: 409 }
            }
            if(user.userName === userName) {
                throw { message: "UserName already exists", status: 409 }
            }
        } 
}

export const verifySignup = async({ email, userName, fullName, password }) => {

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
        if(existingUser) {
            if(existingUser.email === email) {
                throw { message: "Email already exists", status: 409 }
            }
            if(existingUser.userName === userName) {
                throw { message: "UserName already exists", status: 409 }
            }
        }

    await User.create({ email, userName, fullName, password });
   
    return;
}

export const login = async({ identifier }) => {
    const user = User.findOne({ $or: [{ email: identifier}, { userName: identifier }] }).select('+password');
    return user;
}

export const findUser = async({ identifier }) => {
    const user = await User.findOne(
        { $or: [{ email: identifier }, { userName: identifier }]}
    ).select('+password +otp +passwordResetToken');

    if(!user) throw { message: 'User not found', status: 404 };

    return user;
}

export const googleCreateUser = async({ email, userName, profileImage, fullName, sub}) => {
    const user = User.create({ email, userName, fullName, profileImage, googleId: sub });

    return user;
}