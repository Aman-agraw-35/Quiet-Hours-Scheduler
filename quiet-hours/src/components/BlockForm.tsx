"use client";

import { useState } from "react";

export default function BlockForm({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/blocks", {
      method: "POST",
      body: JSON.stringify({ userId, startTime, endTime }),
      headers: { "Content-Type": "application/json" },
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
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 space-y-3">
      <h2 className="text-lg font-semibold">Add Study Block</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm">Start Time</label>
        <input type="datetime-local" className="border p-2 rounded" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm">End Time</label>
        <input type="datetime-local" className="border p-2 rounded" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {loading ? "Saving..." : "Save Block"}
      </button>
    </form>
  );
}
