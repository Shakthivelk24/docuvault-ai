import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../config/aws.js";

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const generateUploadUrl = async ({
  key,
  contentType,
}) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });

  return uploadUrl;
};