import {
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../config/aws.js";

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const listUserDocuments = async (userId) => {
  const prefix = `users/${userId}/`;
  const documents = [];
  let continuationToken;

  do {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    for (const object of response.Contents ?? []) {
      if (!object.Key || object.Key.endsWith("/")) continue;

      const pathParts = object.Key.split("/");
      const documentId = pathParts[2];
      const fileName = pathParts.slice(3).join("/");

      if (!documentId || !fileName) continue;

      documents.push({
        id: documentId,
        name: fileName,
        type: fileName.includes(".") ? fileName.split(".").pop() : "file",
        size: object.Size ?? 0,
        uploadedAt: object.LastModified?.toISOString() ?? null,
        modifiedAt: object.LastModified?.toISOString() ?? null,
        owner: "You",
        status: "completed",
        favorite: false,
        pages: null,
        summary: null,
        keywords: [],
        classification: null,
        activity: [],
        key: object.Key,
      });
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return documents;
};

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

export const generatePreviewUrl = async ({ userId, documentId }) => {
  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `users/${userId}/${documentId}/`,
      MaxKeys: 1,
    })
  );

  const key = response.Contents?.find((object) => object.Key && !object.Key.endsWith("/"))?.Key;
  if (!key) return null;

  return getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }),
    { expiresIn: 300 }
  );
};