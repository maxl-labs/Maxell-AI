"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Session = {
  id: string;
  date: Date | string;
  durationMin: number;
  notes: string | null;
  instrument: { name: string };
};

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function groupByDate(sessions: Session[]): [string, Session[]][] {
  const groups = new Map<string, Session[]>();
  for (const s of sessions) {
    const key = new Date(s.date).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }
  return [...groups.entries()];
}

export default function SessionList({ sessions }: { sessions: Session[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  const grouped = groupByDate(sessions);

  return (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {grouped.map(([dateKey, daySessions]) => (
        <div key={dateKey}>
          <div className="px-5 py-2 bg-zinc-50 dark:bg-zinc-950">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {formatDate(daySessions[0].date)}
            </span>
          </div>
          {daySessions.map((s) => (
            <div key={s.id} className="px-5 py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{s.instrument.name}</span>
                  <span className="text-xs text-zinc-400">{s.durationMin} min</span>
                </div>
                {s.notes && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{s.notes}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                disabled={deleting === s.id}
                className="text-xs text-zinc-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 disabled:opacity-40"
                title="Delete session"
              >
                {deleting === s.id ? "…" : "✕"}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
