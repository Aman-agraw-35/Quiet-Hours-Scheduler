import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    console.log("Available cookies:", cookieStore.getAll());
    
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    console.log("Session:", session);
    console.log("Session Error:", sessionError);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("User:", user);
    console.log("User Error:", userError);

    return NextResponse.json({
      session: session?.session,
      user,
      sessionError,
      userError,
      cookies: cookieStore.getAll().map(c => ({ name: c.name, value: c.value?.substring(0, 20) + '...' }))
    });
  } catch (error: any) {
    console.error("Debug auth error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}