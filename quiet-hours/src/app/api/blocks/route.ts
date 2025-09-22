import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    await connectDB();

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const blocks = await StudyBlock.find({ userId: user.id }).sort({
      startTime: 1,
    });

    return NextResponse.json(blocks);
  } catch (error: any) {
    console.error("GET /api/blocks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      throw new Error("Unauthorized");
    }

    const body = await req.json();
    const { startTime, endTime } = body;

    if (!startTime || !endTime) throw new Error("Invalid data");

    // Check overlap
    const overlap = await StudyBlock.findOne({
      userId: user.id,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
      ],
    });

    if (overlap) throw new Error("Block overlaps with existing one");

    const newBlock = await StudyBlock.create({
      userId: user.id,
      email: user.email, // ✅ Store email along with userId
      startTime,
      endTime,
    });

    return NextResponse.json(newBlock);
  } catch (error: any) {
    console.error("POST /api/blocks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
