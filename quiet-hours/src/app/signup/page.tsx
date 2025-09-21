"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp(
      { email, password },
      {
        emailRedirectTo: "http://localhost:3000/confirm" // Route to handle confirmation
      }
    );

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert(
        "Signup successful! Check your email and click the confirmation link."
      );
      setEmail("");
      setPassword("");
      router.push("/login"); // optional: redirect after signup
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4"
    >
      <h1 className="text-xl font-bold">Sign Up</h1>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white rounded ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
