import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await StudyBlock.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted successfully" });
}
