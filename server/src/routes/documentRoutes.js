import express from "express";
import { createUploadUrl } from "../controllers/documentController.js";

const router = express.Router();

router.post("/upload-url", createUploadUrl);

export default router;