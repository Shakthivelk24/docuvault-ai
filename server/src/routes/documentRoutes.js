import express from "express";
import {
	createUploadUrl,
	getDocuments,
} from "../controllers/documentController.js";

const router = express.Router();

router.post("/upload-url", createUploadUrl);
router.get("/", getDocuments);

export default router;