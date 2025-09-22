import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: Request) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await connectDB();
    const blocks = await StudyBlock.find({ userId }).sort({ startTime: 1 });
    return NextResponse.json(blocks);
  } catch (error: any) {
    console.error("GET /api/blocks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      await connectDB();
      // Get the authenticated user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const authenticatedUserId = session.user.id;
  
      const body = await req.json();
      const { userId, startTime, endTime } = body;
  
      if (authenticatedUserId !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
  
      if (!userId || !startTime || !endTime) throw new Error("Invalid data");
  
      const overlap = await StudyBlock.findOne({
        userId,
        $or: [
          { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
          { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        ],
      });
  
      if (overlap) throw new Error("Block overlaps with existing one");
  
      const newBlock = await StudyBlock.create({ userId, startTime, endTime, email: session.user.email });
      return NextResponse.json(newBlock);
    } catch (error: any) {
      console.error("POST /api/blocks error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}