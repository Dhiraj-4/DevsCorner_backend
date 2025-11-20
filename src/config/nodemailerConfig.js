import nodemailer from 'nodemailer';
import { SMTP_KEY, SMTP_USER } from './serverConfig.js';

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_KEY,
  },
});