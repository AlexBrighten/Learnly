import { NextResponse } from "next/server";
import { adminDb } from "@/configs/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req) {
  try {
    const { topic, difficulty, type, userId, userEmail } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Build URL inside the handler so env vars are read at call time
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const typeDescriptions = {
      flashcards: "flashcard-style bite-sized facts and key points",
      quiz: "multiple-choice quiz questions with 4 options and the correct answer noted",
      qa: "question and answer pairs",
      exam: "detailed explanations and example exam questions",
    };

    const prompt = `You are an expert educational content creator. Generate a comprehensive course on the topic: "${topic}".

Difficulty level: ${difficulty || "intermediate"}
Content style: ${typeDescriptions[type] || typeDescriptions.flashcards}

Return ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "title": "Course title here",
  "description": "2-3 sentence course description",
  "emoji": "An appropriate single emoji for the topic",
  "chapters": [
    {
      "title": "Chapter title",
      "summary": "One sentence chapter summary",
      "lessons": [
        {
          "title": "Lesson title",
          "content": "The actual lesson content (3-5 sentences or the formatted content based on type)",
          "keyPoints": ["key point 1", "key point 2", "key point 3"]
        }
      ]
    }
  ]
}

Create exactly 4 chapters, each with 3-4 lessons. Make the content educational, concise, and engaging.`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      // Return the actual error so we can see what's wrong
      let errMsg = "Failed to generate course content";
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson?.error?.message || errMsg;
      } catch { }
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Strip any markdown code fences if Gemini wraps it anyway
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let course;
    try {
      course = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse error. Raw:", cleaned.slice(0, 500));
      return NextResponse.json({ error: "Invalid JSON from AI — please try again." }, { status: 500 });
    }

    // Save to Firestore via Admin SDK (bypasses security rules)
    const docRef = await adminDb.collection("courses").add({
      ...course,
      topic,
      difficulty,
      type,
      userId: userId || null,
      userEmail: userEmail || null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ course, docId: docRef.id });
  } catch (error) {
    console.error("Generate course error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
