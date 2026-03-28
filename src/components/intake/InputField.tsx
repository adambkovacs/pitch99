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
    <div style={{ marginBottom: "0.5rem" }}>
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold"
        style={{ color: "var(--foreground)", marginBottom: "0.5rem" }}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div
            className="absolute top-1/2 pointer-events-none"
            style={{ left: "1rem", transform: "translateY(-50%)", color: "var(--muted-light)" }}
            aria-hidden="true"
          >
            <Icon className="w-[18px] h-[18px]" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border text-base outline-none transition-all duration-200",
            "bg-white shadow-sm",
            "placeholder:text-zinc-500",
            "hover:border-zinc-400",
            "focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500",
          )}
          style={{
            borderColor: "#d4d4d8",
            color: "var(--foreground)",
            padding: Icon ? "0.875rem 1rem 0.875rem 2.75rem" : "0.875rem 1rem",
          }}
        />
      </div>
    </div>
  );
}
