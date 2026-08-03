import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// AI Summarization Endpoint
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { text, title = "Study Document" } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Text content is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if key is missing
      res.json({
        summary: `Summary of ${title}: This material covers core theoretical concepts, definitions, and applications. (Note: Add GEMINI_API_KEY in Secrets for live AI insights).`,
        keyPoints: [
          "Core principles and definitions explained.",
          "Key applications and methodology outlined.",
          "Essential formulas and relationships highlighted.",
        ],
        difficultyLevel: "Intermediate",
        studyTips: ["Focus on understanding foundational definitions first.", "Test yourself with active recall."],
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are an expert AI tutor. Analyze the following study material titled "${title}" and generate a high-quality summary.
      
Document Text:
${text.slice(0, 12000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A clear, well-written executive summary." },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4-6 essential bullet points.",
            },
            difficultyLevel: { type: Type.STRING, description: "Beginner, Intermediate, or Advanced." },
            studyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 actionable study recommendations for mastering this topic.",
            },
          },
          required: ["summary", "keyPoints", "difficultyLevel", "studyTips"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Summarize error:", error);
    res.status(500).json({ error: "Failed to generate AI summary", details: error.message });
  }
});

// AI Concept Explainer Endpoint (ELI5 / Analogy / Academic)
app.post("/api/ai/explain", async (req, res) => {
  try {
    const { concept, mode = "eli5", context = "" } = req.body;
    if (!concept) {
      res.status(400).json({ error: "Concept parameter is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        term: concept,
        explanation: `Simplified explanation of ${concept}: A core principle in this subject area that breaks down into key components.`,
        analogy: `Imagine ${concept} like a factory assembly line where inputs are transformed systematically into outputs.`,
        keyTakeaway: `Remember that ${concept} serves as a foundational building block for advanced topics.`,
      });
      return;
    }

    const prompt = `Explain the concept "${concept}" using the mode: "${mode}".
${context ? `Context from document: ${context.slice(0, 4000)}` : ""}

Instructions:
- If mode is 'eli5', explain as if to a 5-year-old using intuitive everyday terms.
- If mode is 'analogy', create a vivid, relatable real-world comparison.
- If mode is 'academic', provide a rigorous university-level breakdown.
- If mode is 'step_by_step', provide numbered logical progression.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            explanation: { type: Type.STRING },
            analogy: { type: Type.STRING },
            keyTakeaway: { type: Type.STRING },
          },
          required: ["term", "explanation", "keyTakeaway"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Explain error:", error);
    res.status(500).json({ error: "Failed to explain concept", details: error.message });
  }
});

// AI Flashcard Generation Endpoint
app.post("/api/ai/flashcards", async (req, res) => {
  try {
    const { text, subject = "General", count = 5 } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text content is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json([
        {
          front: `What is the primary theme of ${subject}?`,
          back: `It provides structural understanding and analytical frameworks for key problem domains.`,
          hint: "Think about foundational definitions.",
          difficulty: "easy",
        },
        {
          front: `How do key components interact in ${subject}?`,
          back: `Components connect through feedback loops and sequential data or energy transformations.`,
          hint: "Focus on systemic relationships.",
          difficulty: "medium",
        },
      ]);
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate ${count} high-quality flashcards for active recall study based on this material:
      
Text:
${text.slice(0, 10000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              front: { type: Type.STRING, description: "Clear, specific question or prompt for testing memory." },
              back: { type: Type.STRING, description: "Concise, accurate answer." },
              hint: { type: Type.STRING, description: "Helpful hint without giving away the answer." },
              difficulty: { type: Type.STRING, description: "easy, medium, or hard" },
            },
            required: ["front", "back", "difficulty"],
          },
        },
      },
    });

    const flashcards = JSON.parse(response.text || "[]");
    res.json(flashcards);
  } catch (error: any) {
    console.error("AI Flashcards error:", error);
    res.status(500).json({ error: "Failed to generate flashcards", details: error.message });
  }
});

// AI MCQ Quiz Generator Endpoint
app.post("/api/ai/quiz", async (req, res) => {
  try {
    const { text, title = "Practice Quiz", subject = "Study Material", count = 4 } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text content is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        title: `${title} (Sample Quiz)`,
        questions: [
          {
            id: "q_sample_1",
            question: "Which statement best describes the primary objective of this study material?",
            options: [
              "Developing theoretical foundations and practical mastery",
              "Memorizing historical dates only",
              "Replacing experimental observation completely",
              "Ignoring mathematical models",
            ],
            correctAnswer: 0,
            explanation: "The material focuses on building foundational principles paired with practical applications.",
            topic: "Foundations",
          },
          {
            id: "q_sample_2",
            question: "How should a student best approach key concepts in this material?",
            options: [
              "Passive reading without taking notes",
              "Active recall and self-testing on core terms",
              "Skipping practice problems",
              "Reading only the introduction",
            ],
            correctAnswer: 1,
            explanation: "Active recall and self-testing promote long-term retention and conceptual mastery.",
            topic: "Study Skills",
          },
        ],
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Create a ${count}-question multiple-choice quiz (MCQ) testing comprehension on this study material:
Title: ${title}
Subject: ${subject}

Text Content:
${text.slice(0, 10000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 multiple choice options.",
                  },
                  correctAnswer: { type: Type.INTEGER, description: "Index 0 to 3 of correct answer in options." },
                  explanation: { type: Type.STRING, description: "Clear explanation why this answer is correct." },
                  topic: { type: Type.STRING, description: "Subtopic or chapter name." },
                },
                required: ["question", "options", "correctAnswer", "explanation"],
              },
            },
          },
          required: ["title", "questions"],
        },
      },
    });

    const quizData = JSON.parse(response.text || "{}");
    res.json(quizData);
  } catch (error: any) {
    console.error("AI Quiz error:", error);
    res.status(500).json({ error: "Failed to generate quiz", details: error.message });
  }
});

// AI Research Gaps & Future Work Suggestions Endpoint
app.post("/api/ai/research-gaps", async (req, res) => {
  try {
    const { text, title = "Document" } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text content is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        researchGaps: [
          "Current literature lacks long-term empirical studies on scalable deployment.",
          "Edge-case robustness under noisy environmental conditions requires deeper analysis.",
          "Interdisciplinary application frameworks remain unstandardized.",
        ],
        futureWorkSuggestions: [
          "Investigate hybrid optimization techniques combining classical and modern models.",
          "Conduct comparative benchmarking across diverse demographic datasets.",
        ],
        criticalQuestions: [
          "What are the boundary conditions under which this model fails?",
          "How can energy efficiency be improved by 30% without sacrificing accuracy?",
        ],
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Critically evaluate the following research paper / study notes titled "${title}". Identify current research gaps, limitations, open questions, and promising directions for future academic work or student research projects.

Text:
${text.slice(0, 10000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            researchGaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-4 identified research gaps or unaddressed constraints.",
            },
            futureWorkSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 actionable ideas for future research projects or thesis topics.",
            },
            criticalQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 thought-provoking questions to spark debate or seminar discussion.",
            },
          },
          required: ["researchGaps", "futureWorkSuggestions", "criticalQuestions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Research Gaps error:", error);
    res.status(500).json({ error: "Failed to analyze research gaps", details: error.message });
  }
});

// AI Document Chat Assistant Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, documentContext = "", documentTitle = "Uploaded Document" } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      const lastMsg = messages[messages.length - 1]?.text || "";
      res.json({
        text: `Based on "${documentTitle}": Your query "${lastMsg}" relates to the core findings in the material. Key concepts emphasize systematic analysis and foundational principles.`,
        suggestedPrompts: [
          "Can you summarize the main conclusions?",
          "What are the most difficult terms explained here?",
          "Generate 3 flashcards from this section.",
        ],
      });
      return;
    }

    const promptHistory = messages
      .map((m: any) => `${m.sender === "user" ? "Student" : "StudyMate AI"}: ${m.text}`)
      .join("\n");

    const prompt = `You are StudyMate AI, an encouraging, incredibly knowledgeable AI study partner and tutor.
You are helping a student study their uploaded document titled "${documentTitle}".

Document Context:
${documentContext.slice(0, 12000)}

Conversation History:
${promptHistory}

Respond concisely and accurately based primarily on the document context provided. Include 2-3 follow-up prompt suggestions that the student might ask next.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "Detailed, helpful response to student." },
            suggestedPrompts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 short follow-up prompts.",
            },
          },
          required: ["text"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message", details: error.message });
  }
});

// AI Auto File Processing Endpoint (Handles text extraction and auto generation)
app.post("/api/ai/parse-file", async (req, res) => {
  try {
    const { fileName, fileType, textContent = "", subject = "General" } = req.body;

    const contentToAnalyze = textContent || `This document "${fileName}" is uploaded for study. It covers key definitions, diagrams, and theoretical concepts related to ${subject}.`;

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        id: `mat_${Date.now()}`,
        title: fileName,
        subject,
        fileType: fileType || "pdf",
        fileSize: "1.5 MB",
        uploadDate: new Date().toISOString().split("T")[0],
        content: contentToAnalyze,
        summary: `Extracted summary for ${fileName}: Covers core concepts and definitions.`,
        keyPoints: [
          "Primary thesis and main arguments outlined.",
          "Core definitions and key variables defined.",
          "Practical implications for problem solving.",
        ],
        tags: [subject, "Notes", "AI Processed"],
        readProgress: 0,
        pageCount: 6,
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze this newly uploaded study document titled "${fileName}" in subject "${subject}".
Extract key metadata, a concise summary, key points, concepts, and relevant search tags.

Document Content:
${contentToAnalyze.slice(0, 10000)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            concepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  simpleExplanation: { type: Type.STRING },
                },
                required: ["term", "definition", "simpleExplanation"],
              },
            },
            researchGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "keyPoints", "tags", "concepts"],
        },
      },
    });

    const aiResult = JSON.parse(response.text || "{}");

    const material = {
      id: `mat_${Date.now()}`,
      title: fileName,
      subject,
      fileType: fileType || "pdf",
      fileSize: "2.1 MB",
      uploadDate: new Date().toISOString().split("T")[0],
      content: contentToAnalyze,
      summary: aiResult.summary,
      keyPoints: aiResult.keyPoints,
      tags: aiResult.tags || [subject, "AI Processed"],
      concepts: aiResult.concepts || [],
      researchGaps: aiResult.researchGaps || [],
      readProgress: 0,
      pageCount: Math.max(1, Math.ceil(contentToAnalyze.length / 1500)),
    };

    res.json(material);
  } catch (error: any) {
    console.error("Parse file error:", error);
    res.status(500).json({ error: "Failed to process uploaded file", details: error.message });
  }
});

// Vite Middleware & Server Listen Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyMate AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
