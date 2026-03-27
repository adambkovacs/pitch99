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
    <div className="space-y-2">
      <label
        htmlFor={textareaId}
        className="block text-sm font-semibold mb-1.5"
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
          "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-all duration-200 resize-none",
          "bg-zinc-50/50",
          "placeholder:text-zinc-500",
          "hover:border-zinc-400",
          "focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white"
        )}
        style={{
          background: "var(--surface)",
          borderColor: "#d4d4d8",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}
