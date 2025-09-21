"use client";

import { useEffect, useState } from "react";
import BlockForm from "@/components/BlockForm";
import { supabase } from "@/lib/supabaseClient";

interface Block {
  _id: string;
  startTime: string;
  endTime: string;
}

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Get logged-in user from Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then((res) => {
      const user = res.data.session?.user;
      if (user) setUserId(user.id);
    });
  }, []);

  async function fetchBlocks() {
    if (!userId) return;
    const res = await fetch(`/api/blocks?userId=${userId}`);
    if (res.ok) {
      const data = await res.json();
      setBlocks(data);
    }
  }

  async function deleteBlock(id: string) {
    await fetch(`/api/blocks/${id}`, { method: "DELETE" });
    fetchBlocks();
  }

  const sortedBlocks = blocks.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto mt-10">
      {userId && <BlockForm userId={userId} onCreated={fetchBlocks} />}

      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Study Blocks</h2>

        {blocks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No blocks yet. Add your first study block above!
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {sortedBlocks.map((block) => {
              const start = new Date(block.startTime);
              const end = new Date(block.endTime);
              const now = new Date();
              const isUpcoming = start > now;

              return (
                <div
                  key={block._id}
                  className={`p-4 rounded-lg shadow hover:shadow-lg transition duration-300 border ${
                    isUpcoming ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-700 font-semibold">
                        {start.toLocaleString()} → {end.toLocaleString()}
                      </p>
                      <p
                        className={`mt-1 text-sm font-medium ${
                          isUpcoming ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        {isUpcoming ? "Upcoming Block" : "Past Block"}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteBlock(block._id)}
                      className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
