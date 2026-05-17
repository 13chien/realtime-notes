"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [workspaceId, setWorkspaceId] = useState("");
  const router = useRouter();

  const openWorkspace = () => {
    const cleaned = workspaceId.trim().toLowerCase().replace(/\s+/g, "-");

    if (!cleaned) return;

    router.push(`/workspace/${cleaned}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-3xl font-bold text-black">Realtime Notes</h1>

        <p className="mt-2 text-gray-500">
          Create or open a workspace to start writing.
        </p>

        <input
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
          placeholder="e.g. abc123, team-a, demo"
          className="mt-6 w-full border rounded-lg px-4 py-3 outline-none text-black"
        />

        <button
          onClick={openWorkspace}
          className="mt-4 w-full bg-black text-white py-3 rounded-lg"
        >
          Open Workspace
        </button>
      </div>
    </main>
  );
}