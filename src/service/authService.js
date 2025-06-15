import { ACCESS_SECRET_KEY, OTP_SECRET_KEY, PASSWORD_SECRET_KEY, REFRESH_SECRET_KEY, SMTP_USER } from "../config/serverConfig.js";
import { generateSecureOTP } from "../utils/otpGenerater.js";
import { 
    initiateSignup as initiateSignupRepository,
    verifySignup as verifySignupRepository,
    login as loginRepository,
    findUser
} from "../repository/authRepository.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { transporter } from '../config/nodemailerConfig.js'

export const initiateSignup = async({ email, password, fullName, role, userName }) => {

    await initiateSignupRepository({ email , userName });
    
    const hashPassword = await bcrypt.hash(password, 12);
    const otp = process.env.NODE_ENV === 'test' ? "123456" : generateSecureOTP();

    if(process.env.NODE_ENV !== 'test') {

        const info = await transporter.sendMail({
        from: `"DevsCorner 🚀" <${SMTP_USER}>`,
        to: email,
        subject: "🔐 Your DevsCorner OTP Code",
        text: `Your OTP code is: ${otp}`,
        html: `
          <div style="font-family: 'Fira Code', 'Courier New', monospace; background-color: #0d1117; color: #c9d1d9; padding: 20px; border-radius: 8px; max-width: 480px; margin: auto;">
            <h2 style="color: #58a6ff;">🔐 DevsCorner Verification</h2>
            <p>Hey developer,</p>
            <p>Here is your one-time password (OTP) to proceed:</p>
            <div style="font-size: 24px; font-weight: bold; color: #f0f6fc; background: #161b22; padding: 12px 20px; border: 1px solid #30363d; border-radius: 6px; width: fit-content;">
              ${otp}
            </div>
            <p style="margin-top: 20px;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #30363d;" />
            <p style="font-size: 14px; color: #8b949e;">If you didn't request this, please ignore this email.</p>
            <p style="font-size: 12px; color: #6e7681;">DevsCorner • Built for developers, by developers</p>
          </div>
        `
        });
        console.log("Message sent:", info.messageId);
    }
    const payload = {
        email,
        password: hashPassword,
        fullName,
        userName,
        role,
        otp
    }
    const otpVerificationToken = jwt.sign(
        payload,
        OTP_SECRET_KEY,
        { expiresIn: '2m' }
    );
    return otpVerificationToken;
}

export const verifySignup = async({ email, userName, password, role, fullName, enteredOtp, otp }) => {
    if(enteredOtp !== otp) {
        throw {
            message: 'Invalid Otp',
            status: 400
        }
    }
    await verifySignupRepository({ email, userName, password, role, fullName });
    return;
}

export const login = async({ identifier, password }) => {

    const user = await loginRepository({ identifier });

    if(!user) throw { message: "User not found.", status: 404 }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) throw { message: "Invalid password.", status: 401 }

    const payload = {
        userName: user.userName,
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

    const otp = process.env.NODE_ENV === 'test' ? "123456" : generateSecureOTP();

    const email = user.email;
    if(process.env.NODE_ENV !== 'test') {

        const info = await transporter.sendMail({
        from: `"DevsCorner 🚀" <${SMTP_USER}>`,
        to: email,
        subject: "🔐 Your DevsCorner OTP Code",
        text: `Your OTP code is: ${otp}`,
        html: `
          <div style="font-family: 'Fira Code', 'Courier New', monospace; background-color: #0d1117; color: #c9d1d9; padding: 20px; border-radius: 8px; max-width: 480px; margin: auto;">
            <h2 style="color: #58a6ff;">🔐 DevsCorner Verification</h2>
            <p>Hey developer,</p>
            <p>Here is your one-time password (OTP) to proceed:</p>
            <div style="font-size: 24px; font-weight: bold; color: #f0f6fc; background: #161b22; padding: 12px 20px; border: 1px solid #30363d; border-radius: 6px; width: fit-content;">
              ${otp}
            </div>
            <p style="margin-top: 20px;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #30363d;" />
            <p style="font-size: 14px; color: #8b949e;">If you didn't request this, please ignore this email.</p>
            <p style="font-size: 12px; color: #6e7681;">DevsCorner • Built for developers, by developers</p>
          </div>
        `
        });
        console.log("Message sent:", info.messageId);
    }

    const hashOtp = await bcrypt.hash(otp, 12);

    user.otp = {
        code: hashOtp,
        expiresAt: Date.now() + 10 * 60 * 1000
    }

    await user.save();

    const otpVerificationToken = jwt.sign(
    { userName: user.userName },
    OTP_SECRET_KEY,
    { expiresIn: "10m" }
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

    const isMatch = await bcrypt.compare(otp, user.otp.code);

    if(!isMatch) throw { message: 'Invalid Otp', status: 400 };

    user.otp = {}
    
    const passwordResetToken = jwt.sign(
        { userName: userName },
        PASSWORD_SECRET_KEY,
        { expiresIn: "10m" }
    );
    const hashPasswordResetToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");

    user.passwordResetToken = {
        code: hashPasswordResetToken,
        expiresAt: Date.now() + 10 * 60 * 1000
    }

    await user.save();
    
    return passwordResetToken;
}

export const updatePassword = async ({ passwordResetToken, password }) => {
  // ✅ Step 1: Verify the JWT
  let decoded;
  try {
    decoded = jwt.verify(passwordResetToken, PASSWORD_SECRET_KEY);
  } catch (err) {
    throw {
      message: "Invalid or expired password reset token",
      status: 403
    };
  }

  // ✅ Step 2: Find user
  const user = await findUser({ identifier: decoded.userName });
  if (!user || !user.passwordResetToken) {
    throw {
      message: "User or reset token not found",
      status: 404
    };
  }

  // ✅ Step 3: Compare hashed token
  const hashedToken = crypto.createHash("sha256").update(passwordResetToken).digest("hex");
  const isMatch = hashedToken === user.passwordResetToken.code;
  const notExpired = user.passwordResetToken.expiresAt > Date.now();

  if (!isMatch || !notExpired) {
    throw { message: "Invalid or expired reset token", status: 403 };
  }

  // ✅ Step 4: Hash and update password
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;

  // ✅ Step 5: Invalidate token
  user.passwordResetToken = undefined;

  await user.save();

  return;
};