import { getAuth } from "@clerk/express";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

import dynamoClient from "../config/dynamo.js";
import {
  analyzeDocument,
} from "../services/aiService.js";

const TABLE_NAME = "DocuVaultDocuments";

export const analyzeDocumentController =
  async (req, res) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { documentId } = req.body;

      if (!documentId) {
        return res.status(400).json({
          success: false,
          message: "Document ID is required",
        });
      }

      // Get document from DynamoDB
      const result = await dynamoClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,
          Key: {
            userId: {
              S: userId,
            },
            documentId: {
              S: documentId,
            },
          },
        })
      );

      if (!result.Item) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      const fileName =
        result.Item.fileName?.S || "document";

      const status =
        result.Item.status?.S;

      // Make sure document is processed
      if (status !== "PROCESSED") {
        return res.status(400).json({
          success: false,
          message:
            "Document is not ready for AI analysis",
          status,
        });
      }

      // Currently using mock AI
      const analysis =
        await analyzeDocument({
          text: "",
          fileName,
        });

      return res.status(200).json({
        success: true,
        documentId,
        fileName,
        analysis,
      });
    } catch (error) {
      console.error(
        "AI analysis error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "AI analysis failed",
      });
    }
  };