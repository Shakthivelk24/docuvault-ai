import { getAuth } from "@clerk/express";
import { generateUploadUrl } from "../services/s3Service.js";
import crypto from "crypto";

export const createUploadUrl = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({
        success: false,
        message: "fileName and contentType are required",
      });
    }

    const documentId = crypto.randomUUID();

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

    const key = `users/${userId}/${documentId}/${safeFileName}`;

    const uploadUrl = await generateUploadUrl({
      key,
      contentType,
    });

    res.status(200).json({
      success: true,
      documentId,
      key,
      uploadUrl,
    });
  } catch (error) {
    console.error("Upload URL error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate upload URL",
    });
  }
};