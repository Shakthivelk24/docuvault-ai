import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/* =========================================================
   GEMINI MODEL FALLBACK
   ========================================================= */

const generateWithFallback = async (contents) => {
  const models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
  ];

  let lastError;

  for (const model of models) {
    try {
      console.log(
        `\nTrying Gemini model: ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents,
        });

      console.log(
        `Gemini model succeeded: ${model}`
      );

      return response;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini model failed: ${model}`
      );

      console.error(
        "Status:",
        error.status
      );

      console.error(
        "Message:",
        error.message
      );

      /*
       * Only fallback for temporary
       * Gemini availability errors.
       */
      if (error.status !== 503) {
        throw error;
      }

      console.log(
        `Model ${model} unavailable. Trying next model...`
      );
    }
  }

  throw lastError;
};


/* =========================================================
   ANALYZE PDF
   ========================================================= */

export const analyzePdf = async ({
  pdfBuffer,
  fileName,
}) => {
  if (!pdfBuffer) {
    throw new Error(
      "PDF buffer is required."
    );
  }

  const prompt = `
Analyze the attached PDF document.

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "A concise summary of the document",
  "documentType": "The type of document",
  "keyPoints": [
    "Important point 1",
    "Important point 2",
    "Important point 3"
  ],
  "keywords": [
    "keyword1",
    "keyword2",
    "keyword3"
  ],
  "insights": [
    "Useful insight 1",
    "Useful insight 2"
  ]
}

Rules:

1. Analyze the actual contents of the PDF.
2. Do not guess information that is not present.
3. Keep the summary concise.
4. Provide 3 to 5 key points.
5. Provide 5 to 10 relevant keywords.
6. Provide 2 to 4 useful insights.
7. Do not use Markdown.
8. Do not put the JSON inside code fences.
9. Do not add explanations outside the JSON.

File name:
${fileName}
`;

  const response =
    await generateWithFallback([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBuffer.toString("base64"),
        },
      },
      {
        text: prompt,
      },
    ]);

  const output =
    response.text?.trim();

  if (!output) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  console.log(
    "\nGemini analysis response:"
  );

  console.log(output);

  try {
    return JSON.parse(output);
  } catch (error) {
    console.error(
      "\nGemini returned invalid JSON:"
    );

    console.error(output);

    throw new Error(
      "Gemini returned invalid JSON."
    );
  }
};


/* =========================================================
   ASK AI ABOUT PDF
   ========================================================= */

export const askPdfQuestion = async ({
  pdfBuffer,
  fileName,
  question,
}) => {
  if (!pdfBuffer) {
    throw new Error(
      "PDF buffer is required."
    );
  }

  if (!question?.trim()) {
    throw new Error(
      "Question is required."
    );
  }

  const contents = [
    {
      inlineData: {
        mimeType: "application/pdf",
        data: pdfBuffer.toString("base64"),
      },
    },
    {
      text: `
You are an AI assistant for DocuVault AI.

Answer the user's question based ONLY on
the contents of the attached document.

If the document does not contain enough
information to answer the question, say so.

Do not invent information.

Document:
${fileName}

Question:
${question}
`,
    },
  ];

  const response =
    await generateWithFallback(contents);

  const answer =
    response.text?.trim();

  if (!answer) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  return answer;
};