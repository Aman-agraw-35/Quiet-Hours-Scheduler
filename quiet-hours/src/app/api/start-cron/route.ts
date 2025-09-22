import { NextResponse } from "next/server";
import { startCron } from "@/lib/cron";

export async function GET() {
  try {
    console.log("Test cron run");
    await startCron();
    return NextResponse.json({ message: "Cron started" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Failed to start cron" }, { status: 500 });
  }
}