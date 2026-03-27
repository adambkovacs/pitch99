"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
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
  // Pull the first hex color from a gradient like "linear-gradient(90deg, #f97316, #fb923c)"
  const match = color.match(/#[0-9a-fA-F]{6}/);
  return match ? match[0] : color;
}

export default function MarketChart({
  data,
  title,
  suffix = "",
}: MarketChartProps) {

  const labels = data.map((d) => `${d.label}  ${d.value}${suffix}`);
  const values = data.map((d) => d.value);
  const colors = data.map((d) => extractColor(d.color));

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: false as const,
        barThickness: 28,
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
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.parsed.x ?? 0}${suffix}`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: {
        ticks: {
          color: "#3f3f46",
          font: { family: "Inter", size: 13 },
        },
        grid: { display: false },
        border: { display: false },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
      delay: (context) => context.dataIndex * 200,
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {title && (
        <h3
          className="text-sm font-mono uppercase tracking-widest text-zinc-600 font-semibold mb-6"
          data-animate
        >
          {title}
        </h3>
      )}
      <div style={{ height: 280 }}>
        <Bar
          data={chartData}
          options={options}
          aria-label={title ? `${title} bar chart` : "Market data bar chart"}
          role="img"
        />
      </div>
    </div>
  );
}
