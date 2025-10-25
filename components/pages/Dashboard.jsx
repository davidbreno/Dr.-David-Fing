// /components/pages/Dashboard.jsx
"use client";
import Card from "@/components/Card";
import Button from "@/components/Button";
import LineChart from "@/components/charts/LineChart";
import SparkChart from "@/components/charts/SparkChart";
import { useEffect, useMemo, useState } from "react";

/* Por quê: centraliza chaves de storage para compartilhar com outras páginas */
const TX_KEY = "cashflow-v1";      // [{type:'entrada'|'saida', value:number, date:ISO}]
const BILLS_KEY = "bills-v1";      // [{id, title, date:ISO}]
const MOOD_KEY = "mood-entries-v2";// [{id, mood(1..10), note, at:ISO}]

export default function Dashboard() {
  /* KPIs do topo (mock leve) */
  const [month, setMonth] = useState("Out");

  /* ====== ENTRADAS/SAÍDAS → Resumo financeiro ====== */
  const [tx, setTx] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(TX_KEY);
    if (raw) {
      try { setTx(JSON.parse(raw)); } catch {}
    } else {
      // seed mínimo (só para não ficar vazio)
      const today = new Date();
      const y = today.getFullYear();
      const demo = [
        { type: "entrada", value: 1200, date: `${y}-01-10` },
        { type: "saida",   value:  400, date: `${y}-01-15` },
        { type: "entrada", value: 1500, date: `${y}-02-11` },
        { type: "saida",   value:  600, date: `${y}-02-20` },
        { type: "entrada", value: 1300, date: `${y}-03-09` },
        { type: "saida",   value:  350, date: `${y}-03-25` },
      ];
      localStorage.setItem(TX_KEY, JSON.stringify(demo));
      setTx(demo);
    }
  }, []);

  const { labels, entradas, saidas, saldo } = useMemo(() => {
    const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    const e = Array(12).fill(0);
    const s = Array(12).fill(0);
    const nowY = new Date().getFullYear();
    tx.forEach(t => {
      const d = new Date(t.date);
      if (Number.isNaN(d) || d.getFullYear() !== nowY) return;
      const m = d.getMonth();
      if (t.type === "entrada") e[m] += Number(t.value) || 0;
      else s[m] += Number(t.value) || 0;
    });
    const k = e.map((v,i)=>v - s[i]);
    return { labels: months, entradas: e, saidas: s, saldo: k };
  }, [tx]);

  const mainSeries = useMemo(() => ([
    { label: "Entradas", data: entradas },
    { label: "Saídas",   data: saidas },
    { label: "Saldo",    data: saldo },
  ]), [entradas, saidas, saldo]);

  /* ====== CONTAS → Calendário mensal ====== */
  const [bills, setBills] = useState([]);
  const [calYM, setCalYM] = useState(()=> {
    const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; // m: 0..11
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(BILLS_KEY);
    if (raw) {
      try { setBills(JSON.parse(raw)); } catch {}
    } else {
      const y = new Date().getFullYear();
      const demo = [
        { id: crypto.randomUUID(), title: "Aluguel",   date: `${y}-10-05` },
        { id: crypto.randomUUID(), title: "Internet",  date: `${y}-10-12` },
        { id: crypto.randomUUID(), title: "Luz",       date: `${y}-10-18` },
      ];
      localStorage.setItem(BILLS_KEY, JSON.stringify(demo));
      setBills(demo);
    }
  }, []);

  const calDays = useMemo(() => buildCalendar(calYM.y, calYM.m), [calYM]);
  const billsMap = useMemo(() => {
    const map = new Map();
    bills.forEach(b => {
      const d = new Date(b.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      const arr = map.get(key) || [];
      arr.push(b);
      map.set(key, arr);
    });
    return map;
  }, [bills]);

  const changeMonth = (delta) => {
    setCalYM(prev => {
      let y = prev.y, m = prev.m + delta;
      if (m < 0) { m = 11; y--; }
      if (m > 11){ m = 0;  y++; }
      return { y, m };
    });
  };

  /* ====== HUMOR DIÁRIO 1..10 (histórico 7 dias) ====== */
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(MOOD_KEY);
    if (raw) {
      try { setHistory(JSON.parse(raw)); } catch {}
    }
  }, []);

  const saveMood = () => {
    const entry = { id: crypto.randomUUID(), mood, note: note.trim(), at: new Date().toISOString() };
    const next = [...history, entry].slice(-60); // mantém últimos 60 p/ não crescer demais
    setHistory(next);
    localStorage.setItem(MOOD_KEY, JSON.stringify(next));
    setNote("");
  };

  const last7 = useMemo(() => {
    const sorted = [...history].sort((a,b)=> new Date(b.at) - new Date(a.at));
    return sorted.slice(0,7);
  }, [history]);

  const moodEmoji = (v) => {
    const idx = Math.min(10, Math.max(1, v));
    return ["😖","😫","😞","😟","😐","🙂","😊","😃","😄","🤩"][idx-1];
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* KPIs topo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="h-28 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Receita</p>
              <p className="text-2xl font-semibold">R$ 28.500</p>
            </div>
            <div className="w-28 h-full"><SparkChart values={[3,4,5,4,6,7,6,8,7,9]} /></div>
          </div>
        </Card>

        <Card className="h-28 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Pacientes</p>
              <p className="text-2xl font-semibold">412</p>
            </div>
            <div className="w-28 h-full"><SparkChart values={[2,3,3,4,5,6,7,6,7,8]} /></div>
          </div>
        </Card>

        <Card className="h-28 p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Satisfação</p>
              <p className="text-2xl font-semibold">94%</p>
            </div>
            <div className="w-28 h-full"><SparkChart values={[8,7,8,8,9,9,9,10,9,10]} /></div>
          </div>
        </Card>
      </div>

      {/* Linha dos gráficos – CARDS MAIS FINOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm opacity-80">Resumo financeiro</h2>
            <div className="flex items-center gap-2">
              <Button onClick={() => setMonth("Set")}>Set</Button>
              <Button onClick={() => setMonth("Out")}>Out</Button>
              <Button onClick={() => setMonth("Nov")}>Nov</Button>
            </div>
          </div>
          {/* espessura do CARD menor */}
          <div className="h-[220px]">
            <LineChart labels={labels} series={mainSeries} />
          </div>
          <p className="mt-2 text-xs opacity-60">Mês selecionado: {month}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm opacity-80">Contas</h2>
            <div className="flex gap-2">
              <Button onClick={() => changeMonth(-1)}>◀</Button>
              <div className="px-2 text-xs opacity-80 self-center">
                {ptMonth(calYM.m)} / {calYM.y}
              </div>
              <Button onClick={() => changeMonth(1)}>▶</Button>
            </div>
          </div>
          {/* calendário mensal dentro do card (mesma espessura) */}
          <div className="h-[220px]">
            <MonthCalendar
              year={calYM.y}
              month={calYM.m}
              days={calDays}
              billsMap={billsMap}
            />
          </div>
        </Card>
      </div>

      {/* Humor Diário (1 a 10) + histórico 7 dias */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm opacity-80">Humor diário</h2>
          {history.length > 0 && (
            <p className="text-xs opacity-60">
              Último: {moodEmoji(history[history.length-1].mood)} — {new Date(history[history.length-1].at).toLocaleString("pt-BR")}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{moodEmoji(mood)}</span>
            <input
              type="range" min="1" max="10"
              value={mood}
              onChange={(e)=>setMood(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs opacity-70 w-10 text-right">{mood}/10</span>
          </div>
          <div className="lg:col-span-2">
            <input
              placeholder="Anote algo do dia (opcional)"
              value={note}
              onChange={(e)=>setNote(e.target.value)}
              className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-3"><Button onClick={saveMood}>Salvar</Button></div>

        {last7.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs opacity-70 mb-2">Últimos 7 registros</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
              {last7.map(i=>(
                <li key={i.id} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 flex items-center justify-between">
                  <span>{moodEmoji(i.mood)} {i.mood}/10</span>
                  <span className="opacity-70 text-xs">{new Date(i.at).toLocaleDateString("pt-BR")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ===== helpers ===== */
function buildCalendar(year, month0) {
  const first = new Date(year, month0, 1);
  const startDow = (first.getDay() + 6) % 7; // segunda=0
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const days = [];
  // leading blanks
  for (let i=0;i<startDow;i++) days.push(null);
  // days
  for (let d=1; d<=daysInMonth; d++) days.push(new Date(year, month0, d));
  // trailing to fill 6x7 if preciso
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

function ptMonth(m0){
  const arr = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return arr[m0] || "";
}

function MonthCalendar({ year, month, days, billsMap }){
  const week = ["S","T","Q","Q","S","S","D"]; // seg..dom letras
  return (
    <div className="h-full w-full rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col">
      <div className="grid grid-cols-7 text-[10px] opacity-70 mb-2">
        {week.map((w,i)=><div key={i} className="text-center">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs flex-1">
        {days.map((d,idx)=>{
          if(!d) return <div key={idx} className="h-7 rounded bg-white/5 border border-white/5"/>;
          const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
          const has = billsMap.has(key);
          return (
            <div key={idx} className={`h-7 rounded border text-center leading-7 ${has ? "bg-emerald-500/30 border-emerald-400/30" : "bg-white/5 border-white/10"}`}>
              {d.getDate()}
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-[10px] opacity-70">
        • Verde = dia com conta registrada
      </div>
    </div>
  );
}
