import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const blocks = await StudyBlock.find({ userId }).sort({ startTime: 1 });
  return NextResponse.json(blocks);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const { userId, startTime, endTime } = body;

  if (!userId || !startTime || !endTime) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const overlap = await StudyBlock.findOne({
    userId,
    $or: [
      { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
      { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
    ],
  });

  if (overlap) {
    return NextResponse.json({ error: "Block overlaps with existing one" }, { status: 409 });
  }

  const newBlock = await StudyBlock.create({ userId, startTime, endTime });
  return NextResponse.json(newBlock);
}
