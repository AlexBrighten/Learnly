import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const uid = req.headers.get("x-user-uid");

    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    const snapshot = await adminDb
      .collection("courses")
      .where("userId", "==", uid)
      .get();

    const courses = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || ""),
        };
      })
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
