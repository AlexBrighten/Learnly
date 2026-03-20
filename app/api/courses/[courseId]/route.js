import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const doc = await adminDb.collection("courses").doc(courseId).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ course: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch course" },
      { status: 500 }
    );
  }
}
