"use client";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale } from "chart.js";
import { useTheme } from "@/components/theme/ThemeProvider";
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

export default function SparkChart({ values }){
  const { theme }=useTheme();
  const [color,setColor]=useState("rgba(200,220,255,.9)");
  useEffect(()=>{ const css=getComputedStyle(document.documentElement); setColor(css.getPropertyValue("--chart-2")?.trim()||"rgba(200,220,255,.9)"); },[theme]);
  const labels=useMemo(()=>values.map((_,i)=>i+1),[values]);
  const data=useMemo(()=>({labels,datasets:[{data:values,borderWidth:2,tension:.4,pointRadius:0,borderColor:color}]}),[labels,values,color]);
  const options=useMemo(()=>({plugins:{legend:{display:false},tooltip:{enabled:false}},elements:{point:{radius:0}},scales:{x:{display:false},y:{display:false}}}),[]);
  return <Line data={data} options={options}/>;
}