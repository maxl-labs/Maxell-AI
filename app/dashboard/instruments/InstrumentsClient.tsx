"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Instrument {
  id: string;
  name: string;
  sessionCount: number;
}

interface Props {
  instruments: Instrument[];
}

export default function InstrumentsClient({ instruments }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await fetch("/api/instruments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setName("");
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/instruments/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Instrument name"
          className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {instruments.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No instruments yet. Add one above.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          {instruments.map((instrument) => (
            <li key={instrument.id} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{instrument.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{instrument.sessionCount} sessions</p>
              </div>
              <button
                onClick={() => handleDelete(instrument.id)}
                className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
