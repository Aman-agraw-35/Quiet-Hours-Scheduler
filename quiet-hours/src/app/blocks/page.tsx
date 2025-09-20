"use client";

import { useEffect, useState } from "react";
import BlockForm from "@/components/BlockForm";

interface Block {
  _id: string;
  startTime: string;
  endTime: string;
}

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const userId = "test-user-123"; // Replace with Supabase Auth user id later

  async function fetchBlocks() {
    const res = await fetch(`/api/blocks?userId=${userId}`);
    if (res.ok) {
      setBlocks(await res.json());
    }
  }

  async function deleteBlock(id: string) {
    await fetch(`/api/blocks/${id}`, { method: "DELETE" });
    fetchBlocks();
  }

  useEffect(() => { fetchBlocks(); }, []);

  return (
    <div className="space-y-6">
      <BlockForm userId={userId} onCreated={fetchBlocks} />
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Your Study Blocks</h2>
        {blocks.length === 0 && <p>No blocks yet.</p>}
        <ul className="divide-y">
          {blocks.map((block) => (
            <li key={block._id} className="py-2 flex justify-between items-center">
              <span>{new Date(block.startTime).toLocaleString()} → {new Date(block.endTime).toLocaleString()}</span>
              <button onClick={() => deleteBlock(block._id)} className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
