import { NextResponse } from "next/server";
import { adminDb } from "@/configs/firebaseAdmin";
import {
  generateNotesAiModel,
  GenerateQaAiModel,
  GenerateQuizAiModel,
  GenerateStudyTypeContentAiModel,
} from "@/configs/AiModel";

export async function POST(req) {
  try {
    const body = await req.json();
    const { taskName, data } = body;

    console.log(`Received task: ${taskName}`);

    switch (taskName) {
      case "test/hello.world":
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`Hello ${data.email}!`);
        return NextResponse.json({ message: `Hello ${data.email}!` });

      case "user.create":
        await handleUserCreate(data.user);
        return NextResponse.json({ success: true });

      case "notes.generate":
        await handleNotesGenerate(data.course);
        return NextResponse.json({ success: true });

      case "studyType.content":
        await handleStudyTypeContent(data);
        return NextResponse.json({ success: true });

      default:
        console.warn(`Unknown task name: ${taskName}`);
        return NextResponse.json(
          { error: `Unknown task name: ${taskName}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing task:", error);
    return NextResponse.json(
      { error: "Failed to process task." },
      { status: 500 }
    );
  }
}

async function handleUserCreate(user) {
  const usersRef = adminDb.collection("users");
  const snapshot = await usersRef.where("email", "==", user?.email).get();

  if (snapshot.empty) {
    await usersRef.add({
      name: user?.fullName || user?.displayName || "User",
      email: user?.email,
      uid: user?.uid || null,
      isMember: false,
      createdAt: new Date().toISOString(),
    });
    console.log("Created new user:", user?.email);
  }
}

async function handleNotesGenerate(course) {
  try {
    const chapters = course.courseLayout.chapters;
    const chapterPromises = chapters.map(async (chapter, index) => {
      const PROMPT = `Generate a JSON object that represents study notes for a course chapter. The JSON should meet the following requirements:
0. Provided Chapters:
${JSON.stringify(chapter)}

1. Structure:
The JSON must include the following fields:
chapterTitle: The title of the chapter.
chapterSummary: A brief summary of the chapter.
emoji: A relevant emoji to visually represent the chapter.
topics: A list of topics covered in the chapter. Each topic must be an object with:
topicTitle (string): The title of the topic.
content (string): Detailed content for the topic written in Md format, and ready for rendering in a React.js component.

OUTPUT SHOULD BE LIKE : 
{
  "chapterTitle": "WordPress Fundamentals",
  "chapterSummary": "Introduction to WordPress, its architecture, core components, and installation process.",
  "emoji": "🌱",
  "topics": [
    {
      "topicTitle": "What is WordPress?",
      "content": "# What is WordPress? 🤔\\\\n\\\\nWordPress is a free and open-source content management system (CMS) used to build and manage websites and blogs... "
    }
  ]
}

2. Content Formatting:
Give me in .md format

**IMPORTANT**
There should be an emoji
Give me in .md format

 7. **Additional Notes:**  
   - **IMPORTANT** There should be an emoji
   - Every Content should be in detail and explained properly
   - Each 'content' field should use simple and concise language suitable for study notes.  
   - Ensure that topics include clear definitions, key points, and, where appropriate, examples or sample code.  
   - All generated content should be focused on clarity and exam preparation, with minimal redundancy.  

 8. **Avoid Common Errors:**  
   - Double-check for mismatched brackets, missing fields, or improperly formatted strings.  `;

      const result = await generateNotesAiModel.sendMessage(PROMPT);
      const aiResp = await result.response.text();

      await adminDb.collection("chapterNotes").add({
        chapterId: index,
        courseId: course.courseId,
        notes: aiResp,
        createdAt: new Date().toISOString(),
      });
    });

    await Promise.all(chapterPromises);
    console.log("Chapter Notes Generated");

    // Update course status to "Ready"
    const courseSnapshot = await adminDb
      .collection("studyMaterial")
      .where("courseId", "==", course.courseId)
      .get();

    if (!courseSnapshot.empty) {
      const docRef = courseSnapshot.docs[0].ref;
      await docRef.update({ status: "Ready" });
    }
    console.log("Course Status Updated to Ready");
  } catch (error) {
    console.error("Error during notes generation:", error);
    throw error;
  }
}

async function handleStudyTypeContent(data) {
  const { studyType, prompt, courseId, recordId } = data;
  try {
    const result =
      studyType == "Flashcard"
        ? await GenerateStudyTypeContentAiModel.sendMessage(prompt)
        : studyType == "Quiz"
        ? await GenerateQuizAiModel.sendMessage(prompt)
        : await GenerateQaAiModel.sendMessage(prompt);

    const AIResult = JSON.parse(result.response.text());

    // Update the Firestore document by ID
    await adminDb.collection("studyTypeContent").doc(recordId).update({
      content: AIResult,
      status: "Ready",
    });

    console.log(`Study type content generated for ${studyType}`);
  } catch (error) {
    console.error("Error generating study type content:", error);
    throw error;
  }
}
