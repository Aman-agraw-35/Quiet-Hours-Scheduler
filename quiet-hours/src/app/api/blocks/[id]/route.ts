import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    await connectDB();

    const block = await StudyBlock.findById(id);
    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    if (block.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await StudyBlock.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/blocks/:id error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}