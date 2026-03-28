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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

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

function extractColor(color?: string): string {
  if (!color) return "#f97316";
  const match = color.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : color;
}

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
      gradient.addColorStop(1, lightenColor(base, 0.3));
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
        borderRadius: 6,
        borderSkipped: false as const,
        barThickness: 36,
      },
    ],
  };

  const maxValue = Math.max(...values);

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { right: 60 },
    },
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
          label: (ctx) => `$${ctx.parsed.x ?? 0}${suffix}`,
        },
      },
      datalabels: {
        anchor: "end",
        align: "right",
        offset: 8,
        color: "#3f3f46",
        font: {
          family: "monospace",
          size: 13,
          weight: "bold",
        },
        formatter: (value: number) => `$${value}${suffix}`,
      },
    },
    scales: {
      x: {
        display: true,
        max: Math.ceil(maxValue * 1.3),
        grid: { color: "rgba(0,0,0,0.03)", lineWidth: 1 },
        border: { display: false },
        ticks: {
          color: "#a1a1aa",
          font: { family: "monospace", size: 10 },
          callback: (value) => `${value}${suffix}`,
          maxTicksLimit: 5,
        },
      },
      y: {
        ticks: {
          color: "#3f3f46",
          font: { family: "system-ui", size: 12, weight: "bold" },
          padding: 12,
        },
        grid: { display: false },
        border: { display: false },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
      delay: (context) => context.dataIndex * 250,
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {title && (
        <h3
          className="text-[11px] font-semibold font-mono uppercase tracking-widest text-zinc-400 mb-4"
          data-animate
        >
          {title}
        </h3>
      )}
      <div style={{ height: 260 }}>
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
