import { ACCESS_SECRET_KEY, OTP_SECRET_KEY, PASSWORD_SECRET_KEY, REFRESH_SECRET_KEY, SMTP_USER } from "../config/serverConfig.js";
import { generateSecureOTP } from "../utils/otpGenerater.js";
import { 
    initiateSignup as initiateSignupRepository,
    verifySignup as verifySignupRepository,
    login as loginRepository,
    findUser,
    googleCreateUser
} from "../repository/authRepository.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from "../schema/userSchema.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

export const initiateSignup = async({ email, password, fullName, userName }) => {

    await initiateSignupRepository({ email , userName });
    
    const hashPassword = await bcrypt.hash(password, 12);
    const otp = generateSecureOTP();
    
    try {
      

      const info = await sendOTPEmail(email, otp);

      console.log("Message sent:", info);
    } catch (error) {
       console.error("Mailer failed:", error);
      throw { status: 400, message: "Unable to send otp" };
    }

        
    const payload = {
        email,
        password: hashPassword,
        fullName,
        userName,
        otp
    }
    const otpVerificationToken = jwt.sign(
        payload,
        OTP_SECRET_KEY,
        { expiresIn: '2m' }
    );
    return otpVerificationToken;
}

export const verifySignup = async({ email, userName, password, fullName, enteredOtp, otp }) => {
    if(enteredOtp !== otp) {
        throw {
            message: 'Invalid Otp',
            status: 400
        }
    }
    await verifySignupRepository({ email, userName, password, fullName });
    return;
}

export const login = async({ identifier, password }) => {

    const user = await loginRepository({ identifier });

    if(!user) throw { message: "Invalid user", status: 404 }

    if(!user.password) throw {message: "Invalid password", status: 400}

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) throw { message: "Invalid password.", status: 401 }
    
    const payload = {
        userName: user.userName
    }
    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '15m' });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '1d' });


    const response = {
        accessToken,
        refreshToken,
        user
    }
    return response;
}

export const forgotPassword = async({ identifier }) => {
    const user = await findUser({ identifier });

    const otp = generateSecureOTP();

    const email = user.email;


        try {

        const info = await sendOTPEmail(email, otp);

        console.log("Message sent:", info);
        } catch (error) {
          console.error("Mailersend failed:", error);
          throw { status: 400, message: "Unable to send otp" };
        }

    const hashOtp = await bcrypt.hash(String(otp), 12);

    user.otp = {
        code: hashOtp,
        expiresAt: Date.now() + 2 * 60 * 1000
    }

    await user.save();

    const otpVerificationToken = jwt.sign(
    { userName: user.userName },
    OTP_SECRET_KEY,
    { expiresIn: "2m" }
    );

    return { otpVerificationToken };
}

export const resetPassword = async({ otp, userName }) => {

    const user = await findUser({ identifier: userName });

    if(user.otp.expiresAt < Date.now()) {
        user.otp = {}
        await user.save();
        throw{ message: 'Otp expired', status: 401 };
    }

    const isMatch = await bcrypt.compare(String(otp), user.otp.code);

    if(!isMatch) throw { message: 'Invalid Otp', status: 400 };

    user.otp = {}
    
    const passwordResetToken = jwt.sign(
        { userName: userName },
        PASSWORD_SECRET_KEY,
        { expiresIn: "2m" }
    );
    const hashPasswordResetToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");

    user.passwordResetToken = {
        code: hashPasswordResetToken,
        expiresAt: Date.now() + 2 * 60 * 1000
    }

    await user.save();
    
    return passwordResetToken;
}

export const updatePassword = async ({ passwordResetToken, userName, password }) => {

  // ✅ Step 1: Find user
  const user = await findUser({ identifier: userName });
  if (!user || !user.passwordResetToken.code) {
    throw {
      message: "User or reset token not found",
      status: 404
    };
  }

  // ✅ Step 2: Compare hashed token
  const hashedToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");
  const isMatch = hashedToken === user.passwordResetToken.code;
  const notExpired = user.passwordResetToken.expiresAt > Date.now();

  if (!isMatch || !notExpired) {
    throw { message: "Invalid or expired reset token", status: 403 };
  }

  // ✅ Step 3: Hash and update password
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;

  // ✅ Step 4: Invalidate token
  user.passwordResetToken = {};

  // ✅ Step 5: save changes in DB
  await user.save();

  return;
};

export const googleAuth = async({ name, email, profileImage, sub, message }) => {

  if(message == "Create user") {
    let baseUserName = name.toLowerCase().trim().replace(/\s+/g, "");

    let userName = `${baseUserName}${Math.floor(1000 + Math.random() * 9000)}`;

    let exists = await User.findOne({ userName });

    while (exists) {
      userName = `${baseUserName}${Math.floor(1000 + Math.random() * 9000)}`;
      exists = await User.findOne({ userName });
    }
    const fullName = name;

    await googleCreateUser({ email, fullName, profileImage, sub, userName });

  }
    let user = await User.findOne({ email });

    const payload = {
      userName: user.userName
    }
    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, { expiresIn: '15m' });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '1d' });


    const response = {
        message: "Logged in",
        accessToken,
        refreshToken,
        user
    }
    return response;
}