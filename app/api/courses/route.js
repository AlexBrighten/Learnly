import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { createdBy } = await req.json();

    if (!createdBy) {
      return NextResponse.json(
        { error: "The 'createdBy' field is required." },
        { status: 400 }
      );
    }

    const snapshot = await adminDb
      .collection("studyMaterial")
      .where("createdBy", "==", createdBy)
      .orderBy("createdAt", "desc")
      .get();

    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "The 'courseId' query parameter is required." },
        { status: 400 }
      );
    }

    const snapshot = await adminDb
      .collection("studyMaterial")
      .where("courseId", "==", courseId)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const doc = snapshot.docs[0];
    return NextResponse.json({ result: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course. Please try again later." },
      { status: 500 }
    );
  }
}