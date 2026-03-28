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
    <div style={{ marginBottom: "0.5rem" }}>
      <label
        htmlFor={textareaId}
        className="block text-sm font-semibold"
        style={{ color: "var(--foreground)", marginBottom: "0.5rem" }}
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
          "w-full rounded-xl border text-base outline-none transition-all duration-200 resize-none",
          "bg-white shadow-sm",
          "placeholder:text-zinc-500",
          "hover:border-zinc-400",
          "focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        )}
        style={{
          borderColor: "#d4d4d8",
          color: "var(--foreground)",
          padding: "0.875rem 1rem",
        }}
      />
    </div>
  );
}
