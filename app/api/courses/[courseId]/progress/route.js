import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req, { params }) {
  try {
    const { courseId } = await params;
    const { chapterIndex, uid } = await req.json();

    if (!courseId || chapterIndex === undefined || !uid) {
      return NextResponse.json(
        { error: "courseId, chapterIndex, and uid are required" },
        { status: 400 }
      );
    }

    const courseRef = adminDb.collection("courses").doc(courseId);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    const courseData = courseDoc.data();

    // Check ownership
    if (courseData.createdBy !== uid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const completedChapters = courseData.progress?.completedChapters || [];

    if (!completedChapters.includes(chapterIndex)) {
      completedChapters.push(chapterIndex);

      await courseRef.update({
        "progress.completedChapters": completedChapters,
        "progress.xpEarned": FieldValue.increment(50),
      });
    }

    return NextResponse.json({
      completedChapters,
      xpEarned: (courseData.progress?.xpEarned || 0) + 50,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update progress" },
      { status: 500 }
    );
  }
}
