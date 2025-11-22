import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/serverConfig.js";

const resend = new Resend(RESEND_API_KEY);

export async function sendOTPEmail(to, otp) {
  try {
    const { data, error } = await resend.emails.send({
      from: "DevsCorner <noreply@devscorner.in>",
      to,
      subject: "🔐 Your DevsCorner OTP Code",
      html: `
        <div style="font-family: 'Fira Code', 'Courier New', monospace; background-color: #0d1117; color: #c9d1d9; padding: 20px; border-radius: 8px; max-width: 480px; margin: auto;">
          <h2 style="color: #58a6ff;">🔐 DevsCorner Verification</h2>
          <p>Hey developer,</p>
          <p>Here is your one-time password (OTP) to proceed:</p>
          <div style="font-size: 24px; font-weight: bold; color: #f0f6fc; background: #161b22; padding: 12px 20px; border: 1px solid #30363d; border-radius: 6px; width: fit-content;">
            ${otp}
          </div>
          <p style="margin-top: 20px;">This OTP is valid for <strong>2 minutes</strong>. Do not share it with anyone.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #30363d;" />
          <p style="font-size: 14px; color: #8b949e;">If you didn't request this, please ignore this email.</p>
          <p style="font-size: 12px; color: #6e7681;">DevsCorner • Built for developers, by developers</p>
        </div>
      `
    });

    if (error) throw error;
    return data;

  } catch (err) {
    console.error("Resend Email Error:", err);
    throw { status: 400, message: "Unable to send OTP" };
  }
}