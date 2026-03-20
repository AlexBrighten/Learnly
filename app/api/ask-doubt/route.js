import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { question, chapterTitle, chapterNotes, courseTopic } = await req.json();

        if (!question) {
            return NextResponse.json({ error: "Question is required" }, { status: 400 });
        }

        const prompt = `You are a friendly, patient tutor helping a student learn about "${courseTopic || "this topic"}".

The student is currently studying the chapter: "${chapterTitle || "this chapter"}".

Here is the chapter content for context:
---
${(chapterNotes || "").slice(0, 3000)}
---

The student has this doubt/question:
"${question}"

RULES:
1. Answer the question clearly, as if explaining to a 10-year-old.
2. Use simple analogies and real-world examples.
3. Keep technical terms — write them in **bold** and define them simply inline.
4. If code is relevant, include runnable code snippets in fenced code blocks.
5. Keep the answer concise but complete — aim for 100-250 words.
6. If the question is outside the chapter scope, briefly answer it and explain how it relates to what they're learning.
7. Use markdown formatting: bold, bullet points, code blocks as needed.
8. Be encouraging — use phrases like "Great question!", "That's a really smart thing to ask!" etc.`;

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API key not configured");
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) throw new Error("Empty response from AI");

        return NextResponse.json({ answer });
    } catch (error) {
        console.error("Error in ask-doubt:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get answer" },
            { status: 500 }
        );
    }
}
