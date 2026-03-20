import { executeAsync } from "@/lib/backgroundTasks";
import { courseOutlineAIModel } from "@/configs/AiModel";
import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } =
      await req.json();

    console.log("Received data:", {
      courseId,
      topic,
      courseType,
      difficultyLevel,
      createdBy,
    });

    const PROMPT = `Generate a study material for "${topic}" aimed at "${courseType}" level of difficulty "${difficultyLevel}".
    The output must be a valid JSON object with the following structure:
    {
      "courseTitle": "String",
      "courseSummary": "String",
      "chapters": [
        {
          "chapterTitle": "String",
          "chapterSummary": "String",
          "emoji": "Emoji",
          "topics": ["Topic 1", "Topic 2"]
        }
      ]
    }`;

    const aiResp = await courseOutlineAIModel.sendMessage(PROMPT);
    console.log("AI response:", aiResp);

    const aiResult = JSON.parse(aiResp.response.text());
    console.log("Parsed AI result:", aiResult);

    // Insert into Firestore
    const docData = {
      courseId,
      courseType,
      createdBy,
      topic,
      difficultyLevel: difficultyLevel || "Easy",
      courseLayout: aiResult,
      status: "Generating",
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection("studyMaterial").add(docData);
    const dbResult = { id: docRef.id, ...docData };

    console.log("Firestore insertion result:", dbResult);

    // Trigger background note generation via local background task
    try {
      await executeAsync("notes.generate", {
        course: dbResult,
      });
    } catch (taskError) {
      console.warn("Task enqueue failed (non-fatal):", taskError.message);
    }

    return NextResponse.json({ result: dbResult });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
