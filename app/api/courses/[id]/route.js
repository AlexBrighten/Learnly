import { NextResponse } from "next/server";
import { adminDb } from "@/configs/firebaseAdmin";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const docRef = adminDb.collection("courses").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const courseData = { id: docSnap.id, ...docSnap.data() };
    
    // Convert Firestore Timestamp to string
    if (courseData.createdAt) {
      courseData.createdAt = courseData.createdAt.toDate().toISOString();
    }

    return NextResponse.json({ course: courseData });
  } catch (error) {
    console.error("Fetch course error:", error);
    return NextResponse.json({ error: "Failed to fetch course data" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const docRef = adminDb.collection("courses").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Delete the course document
    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
