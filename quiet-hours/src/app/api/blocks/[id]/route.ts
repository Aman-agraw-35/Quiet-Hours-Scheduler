import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";
import { supabase } from "@/lib/supabaseClient";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    await connectDB();

    const block = await StudyBlock.findById(params.id);
    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    if (block.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await StudyBlock.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/blocks/:id error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}