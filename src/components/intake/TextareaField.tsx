"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function TextareaField({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  id,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  id?: string;
}) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full rounded-xl border-2 px-4 py-3.5 text-base outline-none transition-all duration-200 resize-none shadow-sm",
          "placeholder:text-[var(--muted)]",
          "focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
        )}
        style={{
          background: "var(--surface)",
          borderColor: "var(--border-hover)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}
