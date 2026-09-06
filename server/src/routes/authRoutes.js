import express from "express";
import { getAuth } from "@clerk/express";

const router = express.Router();

router.get("/me", (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  res.status(200).json({
    success: true,
    message: "Authentication successful",
    userId,
  });
});

export default router;