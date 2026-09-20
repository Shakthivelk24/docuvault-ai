import { getAuth } from "@clerk/express";

import {
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

import dynamoClient from "../config/dynamo.js";

import {
  downloadObject,
} from "../services/s3Service.js";

import {
  analyzePdf,
  askPdfQuestion,
} from "../services/geminiService.js";


const TABLE_NAME = "DocuVaultDocuments";


// ============================================================
// GET AI SUMMARY
// GET /api/ai/documents/:id/insights
// ============================================================

export const getAISummary = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required.",
      });
    }

    const result = await dynamoClient.send(
      new GetItemCommand({
        TableName: TABLE_NAME,
        Key: {
          userId: {
            S: userId,
          },
          documentId: {
            S: id,
          },
        },
      })
    );

    if (!result.Item) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    const fileName =
      result.Item.fileName?.S ||
      "document.pdf";

    const existingAnalysis =
      result.Item.aiAnalysis?.S;

    const existingAIStatus =
      result.Item.aiStatus?.S;

    const existingAIAnalyzedAt =
      result.Item.aiAnalyzedAt?.S || null;

    // =====================================================
    // RETURN EXISTING AI ANALYSIS
    // =====================================================

    if (
      existingAIStatus === "COMPLETED" &&
      existingAnalysis
    ) {
      console.log(
        "Existing AI analysis found in DynamoDB."
      );

      let analysis;

      try {
        analysis = JSON.parse(
          existingAnalysis
        );
      } catch (error) {
        console.error(
          "Failed to parse existing AI analysis:",
          error
        );

        return res.status(500).json({
          success: false,
          message:
            "Stored AI analysis is invalid.",
        });
      }

      return res.status(200).json({
        success: true,
        documentId: id,
        fileName,
        analysis,
        aiStatus: "COMPLETED",
        aiAnalyzedAt:
          existingAIAnalyzedAt,
      });
    }

    // =====================================================
    // GENERATE NEW AI ANALYSIS
    // =====================================================

    const s3Key =
      result.Item.s3Key?.S;

    if (!s3Key) {
      return res.status(404).json({
        success: false,
        message:
          "S3 file location not found.",
      });
    }

    console.log(
      "========================================"
    );

    console.log(
      "AI Analysis Started"
    );

    console.log(
      "Document ID:",
      id
    );

    console.log(
      "File Name:",
      fileName
    );

    console.log(
      "S3 Key:",
      s3Key
    );

    console.log(
      "========================================"
    );

    // =====================================================
    // MARK AI AS PROCESSING
    // =====================================================

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,

        Key: {
          userId: {
            S: userId,
          },

          documentId: {
            S: id,
          },
        },

        UpdateExpression:
          "SET #aiStatus = :aiStatus",

        ExpressionAttributeNames: {
          "#aiStatus": "aiStatus",
        },

        ExpressionAttributeValues: {
          ":aiStatus": {
            S: "PROCESSING",
          },
        },
      })
    );

    // =====================================================
    // DOWNLOAD PDF
    // =====================================================

    console.log(
      "Downloading PDF from S3..."
    );

    const pdfBuffer =
      await downloadObject(s3Key);

    console.log(
      "PDF downloaded successfully."
    );

    console.log(
      "PDF size:",
      pdfBuffer.length,
      "bytes"
    );

    // =====================================================
    // GEMINI ANALYSIS
    // =====================================================

    console.log(
      "Sending PDF to Gemini..."
    );

    const analysis =
      await analyzePdf({
        pdfBuffer,
        fileName,
      });

    console.log(
      "Gemini analysis completed."
    );

    console.log(
      "AI Analysis:",
      JSON.stringify(
        analysis,
        null,
        2
      )
    );

    // =====================================================
    // SAVE ANALYSIS
    // =====================================================

    const aiAnalyzedAt =
      new Date().toISOString();

    await dynamoClient.send(
      new UpdateItemCommand({
        TableName: TABLE_NAME,

        Key: {
          userId: {
            S: userId,
          },

          documentId: {
            S: id,
          },
        },

        UpdateExpression:
          "SET #aiStatus = :aiStatus, #aiAnalysis = :aiAnalysis, #aiAnalyzedAt = :aiAnalyzedAt",

        ExpressionAttributeNames: {
          "#aiStatus": "aiStatus",
          "#aiAnalysis": "aiAnalysis",
          "#aiAnalyzedAt": "aiAnalyzedAt",
        },

        ExpressionAttributeValues: {
          ":aiStatus": {
            S: "COMPLETED",
          },

          ":aiAnalysis": {
            S: JSON.stringify(
              analysis
            ),
          },

          ":aiAnalyzedAt": {
            S: aiAnalyzedAt,
          },
        },
      })
    );

    console.log(
      "AI analysis saved to DynamoDB."
    );

    console.log(
      "========================================"
    );

    console.log(
      "AI Analysis Completed"
    );

    console.log(
      "========================================"
    );

    return res.status(200).json({
      success: true,
      documentId: id,
      fileName,
      analysis,
      aiStatus: "COMPLETED",
      aiAnalyzedAt,
    });

  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "AI summary error:"
    );

    console.error(error);

    console.error(
      "========================================"
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to analyze document.",
    });
  }
};

// ============================================================
// ASK AI
// POST /api/ai/documents/:id/ask
// ============================================================

export const askAI = async (req, res) => {
  try {

    const { userId } =
      getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } =
      req.params;

    const { question } =
      req.body;


    /* =====================================================
       VALIDATE QUESTION
       ===================================================== */

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }


    /* =====================================================
       GET DOCUMENT FROM DYNAMODB
       ===================================================== */

    const result =
      await dynamoClient.send(
        new GetItemCommand({
          TableName: TABLE_NAME,

          Key: {
            userId: {
              S: userId,
            },

            documentId: {
              S: id,
            },
          },
        })
      );


    if (!result.Item) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }


    const fileName =
      result.Item.fileName?.S ||
      "document.pdf";

    const s3Key =
      result.Item.s3Key?.S;


    if (!s3Key) {
      return res.status(404).json({
        success: false,
        message:
          "S3 file location not found.",
      });
    }


    /* =====================================================
       DOWNLOAD PDF FROM S3
       ===================================================== */

    console.log(
      "Downloading PDF for AI question..."
    );

    const pdfBuffer =
      await downloadObject(s3Key);

    console.log(
      "PDF downloaded successfully."
    );


    /* =====================================================
       SEND PDF + QUESTION TO GEMINI
       ===================================================== */

    const answer =
      await askPdfQuestion({
        pdfBuffer,
        fileName,
        question,
      });


    /* =====================================================
       RETURN ANSWER
       ===================================================== */

    return res.status(200).json({
      success: true,

      documentId: id,

      answer,
    });

  } catch (error) {

    console.error(
      "Ask AI error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to answer question.",
    });
  }
};


// ============================================================
// GET ALL AI INSIGHTS
// GET /api/ai/insights
// ============================================================

export const getAIInsights = async (req, res) => {
  try {

    const { userId } =
      getAuth(req);


    /* =====================================================
       AUTHENTICATION
       ===================================================== */

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    console.log(
      "========================================"
    );

    console.log(
      "Fetching AI Insights"
    );

    console.log(
      "User ID:",
      userId
    );

    console.log(
      "========================================"
    );


    /* =====================================================
       GET ALL USER DOCUMENTS
       ===================================================== */

    const result =
      await dynamoClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,

          KeyConditionExpression:
            "userId = :userId",

          ExpressionAttributeValues: {
            ":userId": {
              S: userId,
            },
          },
        })
      );


    const items =
      result.Items || [];


    console.log(
      "Documents found:",
      items.length
    );


    /* =====================================================
       CONVERT DYNAMODB ITEMS
       ===================================================== */

    const documents =
      items.map((item) => {

        let aiAnalysis = null;


        /* -------------------------------------------------
           PARSE AI ANALYSIS
           ------------------------------------------------- */

        if (item.aiAnalysis?.S) {

          try {

            aiAnalysis =
              JSON.parse(
                item.aiAnalysis.S
              );

          } catch (error) {

            console.error(
              "Failed to parse AI analysis for:",
              item.documentId?.S
            );

          }
        }


        return {

          id:
            item.documentId?.S,

          name:
            item.fileName?.S ||
            "Untitled document",

          contentType:
            item.contentType?.S ||
            null,

          size:
            item.fileSize?.N
              ? Number(
                  item.fileSize.N
                )
              : 0,

          status:
            item.status?.S ||
            null,

          aiStatus:
            item.aiStatus?.S ||
            "PENDING",

          aiAnalyzedAt:
            item.aiAnalyzedAt?.S ||
            null,

          analysis:
            aiAnalysis,
        };
      });


    /* =====================================================
       FIND ANALYZED DOCUMENTS
       ===================================================== */

    const analyzedDocuments =
      documents.filter(
        (document) =>
          document.aiStatus ===
            "COMPLETED" &&
          document.analysis
      );


    /* =====================================================
       FIND PROCESSING DOCUMENTS
       ===================================================== */

    const processingDocuments =
      documents.filter(
        (document) =>
          document.aiStatus ===
          "PROCESSING"
      );


    /* =====================================================
       FIND FAILED DOCUMENTS
       ===================================================== */

    const failedDocuments =
      documents.filter(
        (document) =>
          document.aiStatus ===
          "FAILED"
      );


    /* =====================================================
       SORT ANALYZED DOCUMENTS
       NEWEST FIRST
       ===================================================== */

    analyzedDocuments.sort(
      (a, b) => {

        const dateA =
          new Date(
            a.aiAnalyzedAt || 0
          ).getTime();

        const dateB =
          new Date(
            b.aiAnalyzedAt || 0
          ).getTime();

        return dateB - dateA;
      }
    );


    /* =====================================================
       CREATE RESPONSE
       ===================================================== */

    const response = {

      success: true,

      stats: {

        totalAIAnalyses:
          analyzedDocuments.length,

        documentsAnalyzed:
          analyzedDocuments.length,

        processingQueue:
          processingDocuments.length,

        failedAnalyses:
          failedDocuments.length,

        /*
         * Confidence is not currently
         * generated by Gemini.
         */
        averageConfidence:
          null,
      },


      analyses:
        analyzedDocuments,


      processing:
        processingDocuments,


      failed:
        failedDocuments,
    };


    /* =====================================================
       LOG RESPONSE
       ===================================================== */

    console.log(
      "AI Insights:",
      JSON.stringify(
        response,
        null,
        2
      )
    );


    console.log(
      "========================================"
    );


    /* =====================================================
       RETURN RESPONSE
       ===================================================== */

    return res.status(200).json(
      response
    );

  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "Get AI Insights error:"
    );

    console.error(error);

    console.error(
      "========================================"
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch AI insights.",
    });
  }
};