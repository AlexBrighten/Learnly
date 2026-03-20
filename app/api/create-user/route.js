import { adminDb } from "@/configs/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user } = await req.json();

    if (!user?.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const usersRef = adminDb.collection("users");
    const snapshot = await usersRef.where("email", "==", user.email).get();

    if (snapshot.empty) {
      // Create new user
      const newUser = await usersRef.add({
        name: user.fullName || user.displayName || "User",
        email: user.email,
        uid: user.uid || null,
        isMember: false,
        createdAt: new Date().toISOString(),
      });
      return NextResponse.json({ result: { id: newUser.id } });
    }

    return NextResponse.json({ result: { id: snapshot.docs[0].id } });
  } catch (error) {
    console.error("Error in create-user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
