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
    <div className="space-y-2">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--muted)" }}
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
            "w-full rounded-xl border py-3.5 text-base outline-none transition-all duration-200",
            "bg-zinc-50/50",
            "placeholder:text-zinc-400",
            "hover:border-zinc-400",
            "focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white",
            Icon ? "pl-11 pr-4" : "px-4"
          )}
          style={{
            background: "var(--surface)",
            borderColor: "#d4d4d8",
            color: "var(--foreground)",
          }}
        />
      </div>
    </div>
  );
}
