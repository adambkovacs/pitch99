"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface MarketChartProps {
  data: BarData[];
  title?: string;
  suffix?: string;
  animate?: boolean;
}

export default function MarketChart({
  data,
  title,
  suffix = "",
  animate = true,
}: MarketChartProps) {
  const [visible, setVisible] = useState(!animate);
  const ref = useRef<HTMLDivElement>(null);
  const maxValue = Math.max(...data.map((d) => d.value));

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, [animate]);

  return (
    <div ref={ref} className="w-full max-w-lg mx-auto">
      {title && (
        <h3
          className="text-sm font-mono uppercase tracking-widest text-zinc-500 mb-6"
          data-animate
        >
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={item.label} className="space-y-1.5" data-animate>
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-zinc-300">
                {item.label}
              </span>
              <motion.span
                className="font-mono text-sm font-bold text-orange-400"
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.15 + 0.3, duration: 0.4 }}
              >
                {item.value}
                {suffix}
              </motion.span>
            </div>
            <div className="h-3 rounded-full bg-zinc-800/80 overflow-hidden backdrop-blur">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    item.color ??
                    `linear-gradient(90deg, #f97316 ${0}%, #fb923c ${100}%)`,
                }}
                initial={{ width: 0 }}
                animate={
                  visible ? { width: `${(item.value / maxValue) * 100}%` } : {}
                }
                transition={{
                  delay: i * 0.15,
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
