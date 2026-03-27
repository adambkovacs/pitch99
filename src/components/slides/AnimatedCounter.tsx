"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2.5,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const count = useMotionValue(from);
  const [display, setDisplay] = useState(from.toFixed(decimals));

  useEffect(() => {
    let controls: ReturnType<typeof animate> | null = null;
    const timeout = setTimeout(() => {
      controls = animate(count, to, {
        duration,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplay(v.toFixed(decimals)),
      });
    }, delay * 1000);
    return () => {
      clearTimeout(timeout);
      controls?.stop();
    };
  }, [count, to, duration, delay, decimals]);

  return (
    <motion.span
      className={className}
      aria-label={`${prefix}${to.toFixed(decimals)}${suffix}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}
