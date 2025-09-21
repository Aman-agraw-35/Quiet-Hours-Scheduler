"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ConfirmPage() {
  const [status, setStatus] = useState("Verifying...");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");

    if (!accessToken) {
      setStatus("Invalid or expired link.");
      return;
    }

    async function verify() {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: searchParams.get("refresh_token")!,
      });

      if (error) {
        setStatus("Failed to verify: " + error.message);
      } else {
        setStatus("Email confirmed! Redirecting to dashboard...");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded shadow text-center">
        <h1 className="text-lg font-bold">Email Confirmation</h1>
        <p className="mt-2">{status}</p>
      </div>
    </div>
  );
}
