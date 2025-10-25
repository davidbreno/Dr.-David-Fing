"use client";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend } from "chart.js";
import { useTheme } from "@/components/theme/ThemeProvider";
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

export default function LineChart({ labels, series }) {
  const { theme } = useTheme();
  const [colors, setColors] = useState({
    lines: ["rgba(94,234,212,0.9)", "rgba(96,165,250,0.9)", "rgba(248,113,113,0.9)"],
    fills: ["rgba(94,234,212,0.15)", "rgba(96,165,250,0.15)", "rgba(248,113,113,0.15)"],
    grid: "rgba(255,255,255,0.06)"
  });

  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const pick = (v) => css.getPropertyValue(v).trim();
    const next = {
      lines: [pick("--chart-1"), pick("--chart-2"), pick("--chart-3")],
      fills: [pick("--chart-1-fill"), pick("--chart-2-fill"), pick("--chart-3-fill")],
      grid: pick("--chart-grid") || "rgba(255,255,255,0.06)"
    };
    if (next.lines.some((c) => !c)) return;
    setColors(next);
  }, [theme]);

  const data = useMemo(() => ({
    labels,
    datasets: series.map((s, i) => ({
      label: s.label,
      data: s.data,
      tension: 0.4,
      fill: true,
      borderWidth: 2,
      borderColor: colors.lines[i % colors.lines.length],
      backgroundColor: colors.fills[i % colors.fills.length],
      pointRadius: 2
    }))
  }), [labels, series, colors]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { display: true }, tooltip: { intersect: false } },
    scales: { x: { grid: { color: colors.grid } }, y: { grid: { color: colors.grid } } }
  }), [colors]);

  return <Line data={data} options={options} />;
}
