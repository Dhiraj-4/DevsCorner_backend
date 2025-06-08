import nodemailer from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from './serverConfig.js';

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});