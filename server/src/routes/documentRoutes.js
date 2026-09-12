import express from "express";
import {
	createUploadUrl,
	getDocument,
	getDocuments,
	getPreviewUrl,
	completeUpload,
} from "../controllers/documentController.js";

const router = express.Router();

router.post("/upload-url", createUploadUrl);
router.post("/:id/upload-complete", completeUpload);
router.get("/", getDocuments);
router.get("/:id/preview", getPreviewUrl);
router.get("/:id", getDocument);

export default router;