import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const PORT = process.env.PORT || 8080;

export const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://devscorner-frontend.onrender.com'
  : 'http://localhost:5173';

export const SMTP_USER = process.env.SMTP_USER;

export const SMTP_PASS = process.env.SMTP_PASS;

export const OTP_SECRET_KEY = process.env.OTP_SECRET_KEY;

export const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;

export const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

export const PASSWORD_SECRET_KEY = process.env.PASSWORD_SECRET_KEY;

export const NODE_ENV = process.env.NODE_ENV;

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;

export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

export const AWS_REGION = process.env.AWS_REGION;

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function connectDb() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to MongoDB");
}