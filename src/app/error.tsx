"use client";

export default function GlobalError({
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
          <span className="text-2xl">!</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Something went wrong</h2>
          <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
            An unexpected error occurred. Please try again.
          </p>
        </div>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
