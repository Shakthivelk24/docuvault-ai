import express from "express";

import {
  getAISummary,
  askAI,
  getAIInsights,
} from "../controllers/aiController.js";

const router = express.Router();


// ============================================================
// ANALYZE ONE DOCUMENT
// GET /api/ai/documents/:id/insights
// ============================================================

router.get(
  "/documents/:id/insights",
  getAISummary
);


// ============================================================
// ASK AI ABOUT ONE DOCUMENT
// POST /api/ai/documents/:id/ask
// ============================================================

router.post(
  "/documents/:id/ask",
  askAI
);


// ============================================================
// GET ALL AI INSIGHTS
// GET /api/ai/insights
// ============================================================

router.get(
  "/insights",
  getAIInsights
);


export default router;