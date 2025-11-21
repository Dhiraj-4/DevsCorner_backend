import nodemailer from 'nodemailer';
import { NODE_ENV, SMTP_KEY, SMTP_USER } from './serverConfig.js';

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: NODE_ENV === "production",
  auth: {
    user: SMTP_USER,
    pass: SMTP_KEY,
  },
});