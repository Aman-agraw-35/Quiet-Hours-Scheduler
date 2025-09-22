import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

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
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    await connectDB();
    const body = await req.json();
    const { startTime, endTime } = body;

    if (!startTime || !endTime) {
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

    const newBlock = await StudyBlock.create({ userId, email: user.email, startTime, endTime });
    return NextResponse.json(newBlock);
  } catch (error: any) {
    console.error("POST /api/blocks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}