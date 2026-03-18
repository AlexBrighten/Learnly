import { executeAsync } from "@/lib/backgroundTasks";
import { courseOutlineAIModel } from "/configs/AiModel";
import { db } from "/configs/db";
import { STUDY_MATERIAL_TABLE } from "/configs/schema";
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

    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId,
        courseType,
        createdBy,
        topic,
        courseLayout: aiResult, // Ensure the AI response contains 'courseLayout'
      })
      .returning();

    console.log("Database insertion result:", dbResult);

    // Trigger background note generation via local background task
    try {
      await executeAsync("notes.generate", {
        course: dbResult[0],
      });
    } catch (taskError) {
      console.warn("Task enqueue failed (non-fatal):", taskError.message);
    }

    return NextResponse.json({ result: dbResult[0] });
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
