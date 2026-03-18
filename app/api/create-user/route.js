import { executeAsync } from "@/lib/backgroundTasks";
import { NextResponse } from "next/server";

export async function POST(req){
    const {user} = await req.json();
    const result = await executeAsync('user.create', {
        user: user
    });
    return NextResponse.json({result: result})
}
