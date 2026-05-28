import AWS from "aws-sdk";
import { AWS_ACCESS_KEY, AWS_SECRET_KEY, CLOUDFLARE_R2_ENDPOINT } from "./serverConfig.js";

export const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  endpoint: CLOUDFLARE_R2_ENDPOINT, // e.g., https://<account_id>.r2.cloudflarestorage.com
  region: "auto",                  // Cloudflare R2 requires 'auto'
  signatureVersion: "v4",
});