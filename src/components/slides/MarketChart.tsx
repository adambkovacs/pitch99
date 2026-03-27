"use client";

import { useRef, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
  type ScriptableContext,
  type Color,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components (tree-shake)
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface MarketChartProps {
  data: BarData[];
  title?: string;
  suffix?: string;
}

/**
 * Extract a solid color from a value that may be a CSS gradient string or a plain color.
 * Falls back to orange-500 (#f97316) when nothing is supplied.
 */
function extractColor(color?: string): string {
  if (!color) return "#f97316";
  const match = color.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : color;
}

/**
 * Lighten a hex color by mixing it toward white.
 * `amount` is 0..1 where 1 = fully white.
 */
function lightenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

export default function MarketChart({
  data,
  title,
  suffix = "",
}: MarketChartProps) {
  const chartRef = useRef<ChartJS<"bar"> | null>(null);

  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);
  const baseColors = data.map((d) => extractColor(d.color));

  /**
   * Build horizontal gradients for each bar.
   * We need the chart's canvas context and scales to be ready,
   * so this runs as a scriptable backgroundColor callback.
   */
  const getGradientBg = useCallback(
    (ctx: ScriptableContext<"bar">): Color | undefined => {
      const { chart, dataIndex } = ctx;
      const { ctx: canvasCtx, chartArea } = chart;
      if (!chartArea) return baseColors[dataIndex];
      const gradient = canvasCtx.createLinearGradient(
        chartArea.left,
        0,
        chartArea.right,
        0,
      );
      const base = baseColors[dataIndex];
      gradient.addColorStop(0, base);
      gradient.addColorStop(1, lightenColor(base, 0.35));
      return gradient;
    },
    [baseColors],
  );

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: getGradientBg,
        borderRadius: 8,
        borderSkipped: false as const,
        barThickness: 32,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1c1917",
        titleColor: "#fafaf9",
        bodyColor: "#fafaf9",
        bodyFont: { family: "monospace", size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.parsed.x ?? 0}${suffix}`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { color: "rgba(0,0,0,0.04)", lineWidth: 1 },
        border: { display: false },
        ticks: {
          color: "#a1a1aa",
          font: { family: "monospace", size: 11 },
          callback: (value) => `${value}${suffix}`,
        },
      },
      y: {
        ticks: {
          color: "#3f3f46",
          font: { family: "Inter", size: 13, weight: "bold" },
          padding: 8,
        },
        grid: { display: false },
        border: { display: false },
      },
    },
    animation: {
      duration: 1400,
      easing: "easeOutQuart",
      delay: (context) => context.dataIndex * 220,
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {title && (
        <h3
          className="text-[11px] font-semibold font-mono uppercase tracking-widest text-zinc-500 mb-6"
          data-animate
        >
          {title}
        </h3>
      )}
      <div style={{ height: 280 }}>
        <Bar
          ref={chartRef}
          data={chartData}
          options={options}
          aria-label={title ? `${title} bar chart` : "Market data bar chart"}
          role="img"
        />
      </div>
    </div>
  );
}
