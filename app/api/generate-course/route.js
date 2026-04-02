import { NextResponse } from "next/server";
import { adminDb } from "@/configs/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req) {
  try {
    const { topic, difficulty, type, materials, userId, userEmail } = await req.json();

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
Requested Materials: ${materials?.length ? materials.join(", ") : "notes"}

Return ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "title": "Course title here",
  "description": "2-3 sentence course description",
  "emoji": "An appropriate single emoji for the topic",
  "chapters": [
    {
      "title": "Chapter title",
      "summary": "One sentence chapter summary",
      "notes": "A comprehensively detailed markdown-formatted string with the fully written out study notes for this chapter (minimum 4 paragraphs). Use markdown headers (##), bolded concepts, and bullet points.",
      "flashcards": [
        {
          "front": "Question or term",
          "back": "Detailed answer or definition"
        }
      ],
      "quiz": [
        {
          "question": "A multiple choice question",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Why this answer is correct"
        }
      ],
      "qa": [
        {
          "question": "A common question about this chapter",
          "answer": "A detailed answer"
        }
      ]
    }
  ]
}

Create exactly 4 chapters.
For each chapter, provide exactly the requested material types:
- If 'notes' is requested, provide the detailed markdown 'notes' string.
- If 'flashcards' is requested, provide 5 flashcards.
- If 'quiz' is requested, provide 5 quiz questions. (IMPORTANT: correctAnswer must be an integer 0-3).
- If 'qa' is requested, provide 3 Q&A pairs. 
Make the content educational, concise, and highly engaging.`;

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
      materials: materials || [],
      userId: userId || null,
      userEmail: userEmail || null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ course, courseId: docRef.id });
  } catch (error) {
    console.error("Generate course error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
