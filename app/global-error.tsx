"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Something went wrong</h1>
          <button
            onClick={reset}
            className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:opacity-90"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
