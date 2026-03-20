import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { topic, courseType, difficulty, materials, uid } = await req.json();

    if (!topic || !uid) {
      return NextResponse.json(
        { error: "Topic and user ID are required" },
        { status: 400 }
      );
    }

    const selectedMaterials = materials?.length > 0 ? materials : ["notes", "flashcards", "quiz", "qa"];

    // Build Gemini prompt
    const prompt = buildPrompt(topic, courseType, difficulty, selectedMaterials);

    // Call Gemini API
    const geminiResponse = await callGemini(prompt);

    // Parse the structured JSON from Gemini
    const courseData = parseGeminiResponse(geminiResponse);

    // Save to Firestore
    const courseRef = await adminDb.collection("courses").add({
      ...courseData,
      topic,
      courseType: courseType || "knowledge",
      difficulty: difficulty || "beginner",
      materials: selectedMaterials,
      createdBy: uid,
      status: "ready",
      createdAt: new Date().toISOString(),
      progress: {
        completedChapters: [],
        xpEarned: 0,
      },
    });

    return NextResponse.json({ courseId: courseRef.id, status: "ready" });
  } catch (error) {
    console.error("Error generating course:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate course" },
      { status: 500 }
    );
  }
}

function buildPrompt(topic, courseType, difficulty, materials) {
  const materialInstructions = [];

  if (materials.includes("notes")) {
    materialInstructions.push(
      `"notes": A comprehensive markdown-formatted study note for this chapter (at least 300 words with headers, bullet points, and key concepts highlighted)`
    );
  }
  if (materials.includes("flashcards")) {
    materialInstructions.push(
      `"flashcards": An array of 5-8 flashcard objects, each with "front" (question/term) and "back" (answer/definition)`
    );
  }
  if (materials.includes("quiz")) {
    materialInstructions.push(
      `"quiz": An array of 5 quiz objects, each with "question", "options" (array of 4 strings), "correctAnswer" (index 0-3), and "explanation"`
    );
  }
  if (materials.includes("qa")) {
    materialInstructions.push(
      `"qa": An array of 4-6 Q&A objects, each with "question" and "answer" (markdown formatted)`
    );
  }

  return `You are an expert course creator. Generate a structured learning course in JSON format.

Topic: "${topic}"
Course Type: ${courseType || "knowledge"} (context: ${getCourseTypeContext(courseType)})
Difficulty: ${difficulty || "beginner"}

Generate a course with EXACTLY this JSON structure (no markdown fences, pure JSON only):
{
  "title": "Course title",
  "summary": "A 2-3 sentence course description",
  "totalChapters": <number>,
  "chapters": [
    {
      "title": "Chapter title",
      "summary": "Brief chapter description",
      ${materialInstructions.join(",\n      ")}
    }
  ]
}

Rules:
- Generate 5 chapters
- Make content educational, accurate, and engaging
- Difficulty "${difficulty}" means: ${getDifficultyContext(difficulty)}
- Each chapter should build on the previous one
- Return ONLY valid JSON, no other text`;
}

function getCourseTypeContext(type) {
  const contexts = {
    exam: "Focus on testable concepts, key facts, and exam-style preparation",
    interview: "Focus on commonly asked questions, practical scenarios, and discussion points",
    practice: "Focus on hands-on exercises, practical applications, and skill building",
    knowledge: "Focus on comprehensive understanding, theory, and deep learning",
  };
  return contexts[type] || contexts.knowledge;
}

function getDifficultyContext(difficulty) {
  const contexts = {
    beginner: "Assume no prior knowledge. Use simple language and basic concepts.",
    intermediate: "Assume foundational knowledge. Include moderate complexity and some advanced concepts.",
    advanced: "Assume strong background. Include complex topics, edge cases, and expert-level content.",
  };
  return contexts[difficulty] || contexts.beginner;
}

async function callGemini(prompt) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  // Try multiple models in case one hits rate limits
  const models = ["gemini-3-flash-preview"];

  for (const model of models) {
    try {
      const result = await callGeminiWithRetry(apiKey, model, prompt, 3);
      return result;
    } catch (err) {
      console.warn(`Model ${model} failed: ${err.message}`);
      // If it's not a rate limit error, don't try other models
      if (!err.message.includes("429") && !err.message.includes("RESOURCE_EXHAUSTED") && !err.message.includes("503")) {
        throw err;
      }
      // Otherwise fall through to next model
    }
  }

  throw new Error("All Gemini models are rate-limited. Please try again in a minute.");
}

async function callGeminiWithRetry(apiKey, model, prompt, maxRetries) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    const errText = await response.text();

    // Retry on 429 (rate limit) or 503 (service unavailable) with exponential backoff
    if ((response.status === 429 || response.status === 503) && attempt < maxRetries - 1) {
      const waitMs = Math.min(1000 * Math.pow(2, attempt + 1), 60000); // 2s, 4s, 8s... max 60s
      console.warn(`Rate limited on ${model}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    throw new Error(`Gemini API error: ${response.status} - ${errText}`);
  }
}


function parseGeminiResponse(text) {
  if (!text) throw new Error("Empty response from Gemini");

  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from markdown code fences
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    // Try to find JSON object pattern
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error("Could not parse Gemini response as JSON");
  }
}
