import express from "express";

import {
  analyzeDocumentController,
} from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/analyze",
  analyzeDocumentController
);

export default router;