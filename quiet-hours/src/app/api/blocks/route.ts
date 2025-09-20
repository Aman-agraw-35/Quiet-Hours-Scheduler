import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    if (!userId) throw new Error("Missing userId");

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
    const body = await req.json();
    const { userId, startTime, endTime } = body;

    if (!userId || !startTime || !endTime) throw new Error("Invalid data");

    // Check overlap
    const overlap = await StudyBlock.findOne({
      userId,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
      ],
    });

    if (overlap) throw new Error("Block overlaps with existing one");

    const newBlock = await StudyBlock.create({ userId, startTime, endTime });
    return NextResponse.json(newBlock);
  } catch (error: any) {
    console.error("POST /api/blocks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
