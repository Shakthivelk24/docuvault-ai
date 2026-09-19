const mockAnalyses = {
  resume: {
    summary:
      "This document is a professional resume containing academic background, technical skills, projects, internships, and career-related information.",

    documentType: "Resume",

    keyPoints: [
      "Contains academic qualifications",
      "Lists technical skills and technologies",
      "Includes projects and practical experience",
      "Contains career and professional information",
    ],

    keywords: [
      "Computer Science",
      "React",
      "AWS",
      "DevOps",
      "JavaScript",
    ],

    insights: [
      "The document focuses on technical and professional experience.",
      "The listed skills indicate software development and cloud-related experience.",
    ],
  },

  default: {
    summary:
      "This document has been uploaded successfully to DocuVault AI and is ready for analysis.",

    documentType: "Document",

    keyPoints: [
      "Document is securely stored in Amazon S3",
      "Document metadata is stored in DynamoDB",
      "Document processing has been completed",
    ],

    keywords: [
      "Document",
      "DocuVault",
      "AWS",
    ],

    insights: [
      "The document can be analyzed further using an AI model.",
      "Additional document-specific insights can be generated later.",
    ],
  },
};

export const analyzeDocument = async ({
  text,
  fileName,
}) => {
  console.log(
    "Mock AI analysis started"
  );

  console.log(
    "File:",
    fileName
  );

  console.log(
    "Text length:",
    text?.length || 0
  );

  // Simulate AI processing time
  await new Promise((resolve) =>
    setTimeout(resolve, 500)
  );

  const isResume =
    fileName
      ?.toLowerCase()
      .includes("resume");

  const analysis =
    isResume
      ? mockAnalyses.resume
      : mockAnalyses.default;

  return {
    ...analysis,

    analyzedAt:
      new Date().toISOString(),

    provider: "mock-ai",
  };
};