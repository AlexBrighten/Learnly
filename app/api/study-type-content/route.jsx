import { adminDb } from "@/configs/firebaseAdmin";
import { executeAsync } from "@/lib/backgroundTasks";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { chapter, courseId, type } = await req.json();

    if (!chapter || !courseId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const PROMPT =
      type === "Flashcard"
        ? `Generate a ${type} on the topic: "${chapter}" in JSON format with front-back content, Maximum 15 entries.`
        : type === "Quiz"
        ? `Generate a Quiz on the topic: "${chapter}" with questions, options, and correct answers in JSON format (Maximum 10 entries).`
        : `
        Create **15 question-and-answer pairs** based on the following topics: 
        ${chapter}

        The Answer should be at least of 10 lines	

### **Output Requirements**
1. **Questions and Answers:**
   - Each question must be concise and directly address one of the topics above.
   - Each answer should be **detailed and explanatory**, providing:
     - A clear explanation of the concept.
     - Examples or scenarios illustrating the answer where applicable.
     - Practical tips or best practices.


### **Output Example for a Question**
emoji: A relevant emoji to visually represent the chapter.
content (string): Detailed content for the topic written in Md format, and ready for rendering in a React.js component.

EXAMPLE OUTPUT
{
  "questions": [
    {
      "question": "",
      "answer": ""
    }
}

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
   - Double-check for mismatched brackets, missing fields, or improperly formatted strings.  
        
        `;

    console.log("Prompt:", PROMPT);

    // Insert into Firestore
    const docRef = await adminDb.collection("studyTypeContent").add({
      courseId: courseId,
      type: type,
      status: "Generating",
      createdAt: new Date().toISOString(),
    });

    console.log("Inserted Content ID:", docRef.id);

    // Trigger the background task
    await executeAsync("studyType.content", {
      studyType: type,
      prompt: PROMPT,
      courseId: courseId,
      recordId: docRef.id,
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error("Error in POST /api/study-type-content:", error.message);
    return NextResponse.json(
      { error: "Failed to generate study material. Please try again." },
      { status: 500 }
    );
  }
}
