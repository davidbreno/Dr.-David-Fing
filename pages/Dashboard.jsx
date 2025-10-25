"use client";
import Card from "@/components/Card";
import Button from "@/components/Button";
import LineChart from "@/components/charts/LineChart";
import SparkChart from "@/components/charts/SparkChart";
import { useState } from "react";

export default function Dashboard() {
  const [month, setMonth] = useState("Out");

  const labels = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const main = [
    { label: "2022", data: [5,7,4,6,9,7,8,6,9,10,7,8] },
    { label: "2023", data: [6,8,5,7,10,8,9,7,8,9,8,10] },
    { label: "2024", data: [7,9,6,8,9,9,10,8,9,11,9,11] }
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* cards superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="h-28 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Receita</p>
              <p className="text-2xl font-semibold">R$ 28.500</p>
            </div>
            <div className="w-28 h-full">
              <SparkChart values={[3,4,5,4,6,7,6,8,7,9]} />
            </div>
          </div>
        </Card>

        <Card className="h-28 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Pacientes</p>
              <p className="text-2xl font-semibold">412</p>
            </div>
            <div className="w-28 h-full">
              <SparkChart values={[2,3,3,4,5,6,7,6,7,8]} />
            </div>
          </div>
        </Card>

        <Card className="h-28 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Satisfação</p>
              <p className="text-2xl font-semibold">94%</p>
            </div>
            <div className="w-28 h-full">
              <SparkChart values={[8,7,8,8,9,9,9,10,9,10]} />
            </div>
          </div>
        </Card>
      </div>

      {/* linha de baixo com 2 cards: Visão Geral + Comparativo com mini gráfico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm opacity-80">Visão Geral</h2>
            <div className="flex items-center gap-2">
              <Button onClick={() => setMonth("Set")}>Set</Button>
              <Button onClick={() => setMonth("Out")}>Out</Button>
              <Button onClick={() => setMonth("Nov")}>Nov</Button>
            </div>
          </div>
          <div className="aspect-[16/9] min-h-[360px]">
            <LineChart labels={labels} series={main} />
          </div>
          <p className="mt-2 text-xs opacity-60">Mês selecionado: {month}</p>
        </Card>

        <Card className="p-4">
          <h2 className="text-sm opacity-80 mb-2">Comparativo</h2>
          <div className="aspect-[16/9] min-h-[280px]">
            <LineChart
              labels={labels}
              series={[
                { label: "2022", data: [2,4,6,5,7,6,8,5,7,6,5,7] },
                { label: "2024", data: [3,5,7,6,8,7,9,6,8,7,6,9] }
              ]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
