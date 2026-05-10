"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Instrument {
  id: string;
  name: string;
  sessionCount: number;
}

export default function InstrumentsClient({ instruments: initial }: { instruments: Instrument[] }) {
  const router = useRouter();
  const [instruments, setInstruments] = useState<Instrument[]>(initial);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    setError("");
    const res = await fetch("/api/instruments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (res.ok) {
      const instrument = await res.json();
      setInstruments((prev) =>
        [...prev, { ...instrument, sessionCount: 0 }].sort((a, b) => a.name.localeCompare(b.name))
      );
      setName("");
      router.refresh();
    } else {
      setError("Failed to add instrument.");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const res = await fetch(`/api/instruments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setInstruments((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    }
    setDeleting(null);
    setConfirmId(null);
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Guitar, Piano, Drums"
          className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
        <button
          type="submit"
          disabled={adding || !name.trim()}
          className="rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {adding ? "Adding…" : "Add"}
        </button>
      </form>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

      {instruments.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No instruments yet. Add one above.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          {instruments.map((instrument) => (
            <li key={instrument.id} className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{instrument.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {instrument.sessionCount} {instrument.sessionCount === 1 ? "session" : "sessions"}
                </p>
              </div>
              {confirmId === instrument.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Delete?</span>
                  <button
                    onClick={() => handleDelete(instrument.id)}
                    disabled={deleting === instrument.id}
                    className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-40"
                  >
                    {deleting === instrument.id ? "…" : "Yes"}
                  </button>
                  <button onClick={() => setConfirmId(null)} className="text-xs text-zinc-400 hover:text-zinc-600">
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(instrument.id)}
                  className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
