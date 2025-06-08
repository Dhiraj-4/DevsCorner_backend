import AWS from "aws-sdk";

export const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
  signatureVersion: "v4",
});