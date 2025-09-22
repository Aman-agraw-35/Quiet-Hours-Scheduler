import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import StudyBlock from "@/lib/models/StudyBlock";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const blocks = await StudyBlock.find({ userId: user.id }).sort({ startTime: 1 });
    return NextResponse.json(blocks);
  } catch (error: any) {
    console.error("GET /api/blocks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "No authorization header" }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { startTime, endTime } = body;

    if (!startTime || !endTime) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const overlap = await StudyBlock.findOne({
      userId: user.id,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
      ],
    });

    if (overlap) {
      return NextResponse.json({ error: "Block overlaps with existing one" }, { status: 409 });
    }

    const newBlock = await StudyBlock.create({ userId: user.id, email: user.email, startTime, endTime });
    return NextResponse.json(newBlock);
  } catch (error: any) {
    console.error("POST /api/blocks error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}