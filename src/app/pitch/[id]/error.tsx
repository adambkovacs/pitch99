"use client";

import { AlertCircle } from "lucide-react";

export default function PitchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <div className="flex flex-col items-center gap-6 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Failed to load pitch</h2>
          <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
            This pitch could not be displayed. The data may be corrupted or incomplete.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
          >
            Try again
          </button>
          <a
            href="/intake"
            className="px-6 py-2.5 rounded-xl border border-zinc-300 font-semibold text-sm hover:bg-zinc-100 transition-colors"
            style={{ color: "var(--foreground)" }}
          >
            Create new pitch
          </a>
        </div>
      </div>
    </div>
  );
}
