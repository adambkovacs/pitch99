"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  type = "text",
  id,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  id?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold mb-1.5"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--muted)" }}
            aria-hidden="true"
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border-2 py-3.5 text-base outline-none transition-all duration-200 shadow-sm",
            "placeholder:text-[var(--muted)]",
            "focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]",
            Icon ? "pl-10 pr-4" : "px-4"
          )}
          style={{
            background: "var(--surface)",
            borderColor: "var(--border-hover)",
            color: "var(--foreground)",
          }}
        />
      </div>
    </div>
  );
}
