import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, studyType } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "The 'courseId' field is required." },
        { status: 400 }
      );
    }

    console.log("Incoming Data:", { courseId, studyType });

    // Handling "ALL" case
    if (studyType === "ALL") {
      const notesSnapshot = await adminDb
        .collection("chapterNotes")
        .where("courseId", "==", courseId)
        .get();

      const notes = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched Notes:", notes);

      const contentSnapshot = await adminDb
        .collection("studyTypeContent")
        .where("courseId", "==", courseId)
        .get();

      const contentList = contentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched Study Content:", contentList);

      const result = {
        notes: notes,
        flashcard: contentList.filter((item) => item.type === "Flashcard"),
        quiz: contentList.filter((item) => item.type === "Quiz"),
        qa: contentList.filter((item) => item.type === "Question/Answer"),
      };

      return NextResponse.json(result);
    }

    // Handling specific study types
    else if (studyType === "notes") {
      const notesSnapshot = await adminDb
        .collection("chapterNotes")
        .where("courseId", "==", courseId)
        .get();

      const notes = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Notes for courseId:", courseId, notes);

      return NextResponse.json(notes);
    } else {
      const contentSnapshot = await adminDb
        .collection("studyTypeContent")
        .where("courseId", "==", courseId)
        .where("type", "==", studyType)
        .get();

      const result = contentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`Content for type ${studyType}:`, result);

      return NextResponse.json(result[0] || null);
    }
  } catch (error) {
    console.error("Error in POST /api/study-type:", error.message);
    console.error("Full error details:", error);

    return NextResponse.json(
      { error: "Failed to fetch study materials. Please try again later." },
      { status: 500 }
    );
  }
}
