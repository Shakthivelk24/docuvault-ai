import { getAuth } from "@clerk/express";
import {
  generateUploadUrl,
  generatePreviewUrl,
  deleteObject,
} from "../services/s3Service.js";
import {
  createDocument,
  getDocument as findDocument,
  getUserDocuments,
  deleteDocument as removeDocument,
  updateDocumentStatus,
  updateDocument,
  updateDocumentFavorite,
} from "../services/dynamoService.js";
import crypto from "crypto";

function toClientDocument(document) {
  return {
    ...document,
    id: document.documentId || document.id,
    name: document.fileName || document.name,
    type: document.contentType?.split("/").pop() || document.type || "file",
    size: document.fileSize ?? document.size ?? 0,
    uploadedAt: document.uploadedAt || null,
    favorite: document.favorite || false,
  };
}


export const getDocuments = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const documents = (await getUserDocuments(userId)).map(toClientDocument);
    return res.status(200).json(documents);
  } catch (error) {
    console.error("List documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to list documents",
    });
  }
};

export const createUploadUrl = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { fileName, contentType, fileSize } = req.body;

    if (!fileName || !contentType || fileSize == null) {
      return res.status(400).json({
        success: false,
        message: "fileName, contentType, and fileSize are required",
      });
    }

    const documentId = crypto.randomUUID();
    

    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

    const key = `users/${userId}/${documentId}/${safeFileName}`;

    const uploadUrl = await generateUploadUrl({
      key,
      contentType,
    });

    await createDocument({
      userId,
      documentId,
      fileName,
      contentType,
      fileSize,
      s3Key: key,
      status: "UPLOADING",
      aiStatus: "PENDING",
      favorite: false,
      uploadedAt: new Date().toISOString(),
    });

    return res.status(200).json({
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

export const getPreviewUrl = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const previewUrl = await generatePreviewUrl({
      userId,
      documentId: req.params.id,
    });

    if (!previewUrl) {
      return res.status(404).json({ success: false, message: "Document file not found" });
    }

    return res.status(200).json({ previewUrl });
  } catch (error) {
    console.error("Preview URL error:", error);
    return res.status(500).json({ success: false, message: "Failed to create preview URL" });
  }
};

export const completeUpload = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id: documentId } = req.params;
    console.log("Completing upload:", { userId, documentId });

    const document = await findDocument(userId, documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const updatedDocument = await updateDocumentStatus(userId, documentId, "READY");
    return res.status(200).json(toClientDocument(updatedDocument));
  } catch (error) {
    console.error("Complete upload error:", error);
    return res.status(500).json({ success: false, message: "Failed to complete upload" });
  }
};

export const getDocument = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const document = await findDocument(userId, req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    return res.status(200).json(toClientDocument(document));
  } catch (error) {
    console.error("Get document error:", error);
    return res.status(500).json({ success: false, message: "Failed to get document" });
  }
};

export const updateDocumentHandler = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id: documentId } = req.params;
    const { name, favorite } = req.body;

    // Validate that at least one field is provided
    if (name === undefined && favorite === undefined) {
      return res.status(400).json({ success: false, message: "At least one field (name or favorite) is required" });
    }

    // Verify document exists
    const document = await findDocument(userId, documentId);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Build updates object
    const updates = {};
    if (name !== undefined) updates.fileName = name;
    if (favorite !== undefined) updates.favorite = favorite;

    // Update the document
    const updatedDocument = await updateDocument(userId, documentId, updates);
    return res.status(200).json(toClientDocument(updatedDocument));
  } catch (error) {
    console.error("Update document error:", error);
    return res.status(500).json({ success: false, message: "Failed to update document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const document = await findDocument(userId, req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    if (document.s3Key) {
      await deleteObject(document.s3Key);
    }
    await removeDocument(userId, req.params.id);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete document error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete document" });
  }
};