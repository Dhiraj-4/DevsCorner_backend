import AWS from "aws-sdk";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY } from "./serverConfig.js";

export const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
  signatureVersion: "v4",
});