"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface BlockFormProps {
  onCreated: () => void;
}

export default function BlockForm({ onCreated }: BlockFormProps) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/blocks", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startTime, endTime }),
    });

    setLoading(false);
    if (res.ok) {
      setStartTime("");
      setEndTime("");
      onCreated();
    } else {
      const err = await res.json();
      alert(err.error || "Something went wrong");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-r text-black from-indigo-50 to-purple-50 shadow-lg rounded-xl p-6 max-w-md mx-auto space-y-5"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Add Study Block</h2>

      <div className="flex flex-col gap-1 text-black">
        <label htmlFor="startTime" className="text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          id="startTime"
          type="datetime-local"
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1 text-black">
        <label htmlFor="endTime" className="text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          id="endTime"
          type="datetime-local"
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Saving..." : "Save Block"}
      </button>
    </form>
  );
}