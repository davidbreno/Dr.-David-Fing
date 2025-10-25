// /components/pages/Dashboard.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import LineChart from "@/components/charts/LineChart";
import SparkChart from "@/components/charts/SparkChart";

/* storage keys */
const TX_KEY     = "cashflow-v1";      // [{type:'entrada'|'saida', value:number, date:'YYYY-MM-DD'}]
const BILLS_KEY  = "bills-v1";         // [{id, title, date:'YYYY-MM-DD'}]
const MOOD_KEY   = "mood-entries-v2";  // [{id, mood(1..10), note, at:ISO}]
const WATER_KEY  = "water-v1";         // {date:'YYYY-MM-DD', count:number}
const WEIGHT_KEY = "weight-v1";        // {value:number, at:ISO}

export default function Dashboard() {
  /* ========= KPI 1: Água diária ========= */
  const todayISO = toISO(new Date());
  const [water, setWater] = useState({ date: todayISO, count: 0 });
  useEffect(() => {
    try {
      const raw = localStorage.getItem(WATER_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        setWater(obj?.date === todayISO ? obj : { date: todayISO, count: 0 });
      }
    } catch {}
  }, [todayISO]);
  const setWaterCount = (n) => {
    const next = { date: todayISO, count: clamp(n, 0, 8) };
    setWater(next);
    try { localStorage.setItem(WATER_KEY, JSON.stringify(next)); } catch {}
  };

  /* ========= KPI 2: Peso atual ========= */
  const [weight, setWeight] = useState(null); // {value, at}
  const [weightInput, setWeightInput] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(WEIGHT_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        setWeight(obj || null);
        setWeightInput(obj?.value ?? "");
      }
    } catch {}
  }, []);
  const saveWeight = () => {
    const v = Number(weightInput);
    if (!isFinite(v) || v <= 0) return;
    const obj = { value: v, at: new Date().toISOString() };
    setWeight(obj);
    try { localStorage.setItem(WEIGHT_KEY, JSON.stringify(obj)); } catch {}
  };

  /* ========= KPI 3: Mensagem do dia ========= */
  const MESSAGES = [
    "Um passo por dia já é progresso.",
    "Consistência vence intensidade.",
    "Você não precisa ser perfeito — só constante.",
    "Desconforto de agora, orgulho de amanhã.",
    "Pequenas vitórias acumulam grandes mudanças.",
    "Hidrate, respire, avance.",
    "Seja 1% melhor que ontem.",
  ];
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    // seed simples por dia; “por quê”: muda a cada dia sem guardar estado
    const seed = new Date().toDateString().length;
    setMsgIndex(seed % MESSAGES.length);
  }, []);
  const nextMsg = () => setMsgIndex((i) => (i + 1) % MESSAGES.length);

  /* ========= Resumo financeiro ========= */
  const [tx, setTx] = useState([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TX_KEY);
      if (raw) setTx(JSON.parse(raw));
    } catch {}
  }, []);
  const labels = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const { entradas, saidas, saldo } = useMemo(() => {
    const e = Array(12).fill(0), s = Array(12).fill(0), y = new Date().getFullYear();
    tx.forEach(t => {
      const d = new Date(t.date); if (Number.isNaN(d) || d.getFullYear() !== y) return;
      (t.type === "entrada" ? e : s)[d.getMonth()] += Number(t.value) || 0;
    });
    return { entradas: e, saidas: s, saldo: e.map((v,i)=>v - s[i]) };
  }, [tx]);
  const mainSeries = useMemo(() => ([
    { label: "Entradas", data: entradas },
    { label: "Saídas",   data: saidas },
    { label: "Saldo",    data: saldo },
  ]), [entradas, saidas, saldo]);

  /* ========= Contas (calendário + form) ========= */
  const [bills, setBills] = useState([]);
  const [calYM, setCalYM] = useState(() => { const d=new Date(); return { y:d.getFullYear(), m:d.getMonth() }; });
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(todayISO);

  useEffect(() => {
    try { const raw = localStorage.getItem(BILLS_KEY); if (raw) setBills(JSON.parse(raw)); } catch {}
  }, []);
  const saveBills = (next) => { setBills(next); try { localStorage.setItem(BILLS_KEY, JSON.stringify(next)); } catch {} };
  const addBill = () => {
    if (!newTitle.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(newDate)) return;
    const next = [...bills, { id: crypto.randomUUID(), title: newTitle.trim(), date: newDate }];
    saveBills(next);
    const d = new Date(newDate); setCalYM({ y: d.getFullYear(), m: d.getMonth() });
    setNewTitle("");
  };
  const delBill = (id) => saveBills(bills.filter(b => b.id !== id));
  const calDays    = useMemo(() => buildCalendar(calYM.y, calYM.m), [calYM]);
  const billsByDay = useMemo(() => groupBillsByDay(bills), [bills]);
  const changeMonth = (delta) => {
    setCalYM(p => {
      let y = p.y, m = p.m + delta;
      if (m < 0) { m = 11; y--; }
      if (m > 11){ m = 0;  y++; }
      return { y, m };
    });
  };

  /* ========= Humor diário ========= */
  const [mood, setMood] = useState(5);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  useEffect(() => {
    try { const raw = localStorage.getItem(MOOD_KEY); if (raw) setHistory(JSON.parse(raw)); } catch {}
  }, []);
  const saveMood = () => {
    const entry = { id: crypto.randomUUID(), mood, note: note.trim(), at: new Date().toISOString() };
    const next = [...history, entry].slice(-60);
    setHistory(next);
    try { localStorage.setItem(MOOD_KEY, JSON.stringify(next)); } catch {}
    setNote("");
  };
  const last7 = useMemo(() => {
    const sorted = [...history].sort((a,b)=> new Date(b.at) - new Date(a.at));
    return sorted.slice(0,7);
  }, [history]);
  const moodEmoji = (v) => ["😖","😫","😞","😟","😐","🙂","😊","😃","😄","🤩"][clamp(v,1,10)-1];

  /* ========= UI ========= */
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* === TOPO: 3 KPIs alinhados === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Água diária */}
        <Card className="h-32 p-4">
          <div className="flex h-full items-center gap-4">
            <div className="flex-1">
              <p className="text-sm opacity-70">Água diária</p>
              <p className="text-2xl font-semibold">{water.count}/8 copos</p>
              <div className="mt-2 flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWaterCount(i + 1)}
                    className={[
                      "h-4 w-6 rounded-sm border transition-colors",
                      i < water.count
                        ? "bg-emerald-400/70 border-emerald-300/50"
                        : "bg-white/10 border-white/20 hover:bg-white/15"
                    ].join(" ")}
                    aria-label={`copo ${i + 1}`}
                  />
                ))}
                <button onClick={()=>setWaterCount(0)} className="ml-2 text-[11px] opacity-70 hover:opacity-100">
                  zerar
                </button>
              </div>
            </div>
            {/* SparkChart removido */}
          </div>
        </Card>

        {/* Peso atual */}
        <Card className="h-32 p-4 overflow-hidden">
          <div className="flex h-full items-center gap-4">
            {/* Texto e campos à esquerda */}
            <div className="flex flex-col flex-1 justify-center gap-2">
              <p className="text-sm opacity-70">Peso atual</p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold truncate">{weight?.value ? `${weight.value} kg` : "—"}</p>
                <span className="text-[11px] opacity-60 truncate">
                  {weight?.at ? new Date(weight.at).toLocaleString("pt-BR") : "Sem registro"}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <input
                  value={weightInput}
                  onChange={(e)=>setWeightInput(e.target.value)}
                  placeholder="kg"
                  className="w-20 rounded-lg bg-white/10 border border-white/10 px-2 py-1 text-sm"
                  style={{ minWidth: 0 }}
                />
                <Button onClick={saveWeight} className="whitespace-nowrap px-2 py-1 text-xs">Salvar</Button>
              </div>
            </div>
            {/* SVG à direita */}
            <span className="select-none flex items-center justify-center h-full">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                <g>
                  <path d="M32 8V56" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M16 20H48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M20 20C20 20 14 32 14 36C14 40 18 44 22 44C26 44 30 40 30 36C30 32 24 20 24 20" stroke="currentColor" strokeWidth="2" fill="none"/>
             <Card className="h-32 p-4 relative">
               {/* Copo de água SVG no canto superior direito */}
               <span className="absolute top-2 right-3 select-none">
                 <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
                   <rect x="8" y="6" width="16" height="20" rx="4" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="2"/>
                   <rect x="10" y="10" width="12" height="10" rx="2" fill="#e0f2fe" />
                   <rect x="12" y="20" width="8" height="2" rx="1" fill="#bae6fd" />
                 </svg>
               </span>
              <div className="flex h-full items-center gap-4">
                 <div className="flex-1">
                   <p className="text-sm opacity-70">Água diária</p>
                   <p className="text-2xl font-semibold">{water.count}/8 copos</p>
                   <div className="mt-2 flex items-center gap-1">
                     {[...Array(8)].map((_, i) => (
                       <button
                         key={i}
                         onClick={() => setWaterCount(i + 1)}
                         className={["h-4 w-6 rounded-sm border transition-colors",
                           i < water.count
                             ? "bg-emerald-400/70 border-emerald-300/50"
                             : "bg-white/10 border-white/20 hover:bg-white/15"
                         ].join(" ")}
                         aria-label={`copo ${i + 1}`}
                       />
                     ))}
                     <button onClick={()=>setWaterCount(0)} className="ml-2 text-[11px] opacity-70 hover:opacity-100">
                       zerar
                     </button>
                   </div>
                 </div>
                 {/* SparkChart removido */}
               </div>
             </Card>
                </g>
              </svg>
            </span>
          </div>
        </Card>

        {/* Mensagem do dia */}
        <Card className="h-32 p-4">
          <div className="flex flex-col h-full items-center justify-center gap-2 text-center">
            <p className="text-sm opacity-70">Mensagem do dia</p>
            <p className="text-base leading-snug w-full text-center">{MESSAGES[msgIndex]}</p>
            <Button 
              onClick={nextMsg}
              className="mx-auto mt-2 px-6 py-1 text-xs rounded-full bg-emerald-500/80 hover:bg-emerald-600/80 text-white font-medium shadow-sm min-w-[120px]"
              style={{maxWidth:'180px'}}
            >Outra</Button>
          </div>
        </Card>
      </div>

      {/* === Linha dos cards finos (mantidos) === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ResumoFinanceiro labels={labels} series={mainSeries} />
        <ContasCard
          calYM={calYM}
          calDays={calDays}
          billsByDay={billsByDay}
          newTitle={newTitle}
          newDate={newDate}
          setNewTitle={setNewTitle}
          setNewDate={setNewDate}
          addBill={addBill}
          delBill={delBill}
          changeMonth={changeMonth}
        />
      </div>

      {/* === Humor diário === */}
      <HumorCard
        mood={mood} setMood={setMood}
        note={note} setNote={setNote}
        saveMood={saveMood}
        last7={last7}
        moodEmoji={moodEmoji}
      />
    </div>
  );
}

/* ===== Subcomponentes ===== */
function ResumoFinanceiro({ labels, series }) {
  const [selected, setSelected] = useState("Out");
  return (
    <Card className="p-4 lg:col-span-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm opacity-80">Resumo financeiro</h2>
        <div className="flex items-center gap-2">
          <Button onClick={()=>setSelected("Set")}>Set</Button>
          <Button onClick={()=>setSelected("Out")}>Out</Button>
          <Button onClick={()=>setSelected("Nov")}>Nov</Button>
        </div>
      </div>
      <div className="h-full">
        <LineChart labels={labels} series={series} />
      </div>
      <p className="mt-2 text-xs opacity-60">Mês selecionado: {selected}</p>
    </Card>
  );
}

function ContasCard(props){
  const {
    calYM, calDays, billsByDay,
    newTitle, newDate, setNewTitle, setNewDate,
    addBill, delBill, changeMonth
  } = props;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm opacity-80">Contas</h2>
        <div className="flex gap-2">
          <Button onClick={()=>changeMonth(-1)}>◀</Button>
          <div className="px-2 text-xs opacity-80 self-center">
            {PT_MONTH[calYM.m]} / {calYM.y}
          </div>
          <Button onClick={()=>changeMonth(1)}>▶</Button>
        </div>
      </div>

      <div className="h-[200px] grid grid-cols-7 gap-1 rounded-xl border border-white/10 bg-white/5 p-3">
        {WEEK_HDR.map((w, idx)=> (
          <div key={`h-${w}-${idx}`} className="text-[10px] opacity-70 text-center">{w}</div>
        ))}
        {calDays.map((d, idx) => {
          if (!d) return <div key={idx} className="h-7 rounded bg-white/5 border border-white/5" />;
          const key = dayKey(d);
          const has = billsByDay.has(key);
          return (
            <div
              key={idx}
              title={has ? billsByDay.get(key).map(b=>b.title).join(", ") : undefined}
              className={`h-7 rounded border text-center leading-7
                ${has ? "bg-emerald-500/30 border-emerald-400/30" : "bg-white/5 border-white/10"}`}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          value={newTitle}
          onChange={(e)=>setNewTitle(e.target.value)}
          placeholder="Título (ex: Aluguel)"
          className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e)=>setNewDate(e.target.value)}
          className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"
        />
        <Button onClick={addBill}>+ conta</Button>
      </div>

      <MonthBillList y={calYM.y} m={calYM.m} billsKey={BILLS_KEY} onDel={delBill} />
    </Card>
  );
}

function HumorCard({ mood, setMood, note, setNote, saveMood, last7, moodEmoji }){
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm opacity-80">Humor diário</h2>
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
  );
}

/* ===== Helpers ===== */
const WEEK_HDR = ["S","T","Q","Q","S","S","D"];
const PT_MONTH = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function buildCalendar(year, month0) {
  const first = new Date(year, month0, 1);
  const startDow = (first.getDay() + 6) % 7; // segunda=0
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const arr = [];
  for (let i=0; i<startDow; i++) arr.push(null);
  for (let d=1; d<=daysInMonth; d++) arr.push(new Date(year, month0, d));
  while (arr.length % 7 !== 0) arr.push(null);
  return arr;
}
function pad2(n){ return String(n).padStart(2,"0"); }
function dayKey(d){ return `${d.getFullYear()}-${pad2(d.getMonth())}-${pad2(d.getDate())}`; }
function groupBillsByDay(list){
  const m = new Map();
  list.forEach(b=>{
    const d = new Date(b.date);
    if (Number.isNaN(d)) return;
    const k = dayKey(d);
    const arr = m.get(k) || [];
    arr.push(b); m.set(k, arr);
  });
  return m;
}
function toISO(d){
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,"0"), day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function MonthBillList({ y, m, billsKey, onDel }){
  const [bills, setBills] = useState([]);
  useEffect(()=>{ try{ const raw=localStorage.getItem(billsKey); if(raw) setBills(JSON.parse(raw)); }catch{} },[billsKey]);
  const items = bills
    .map(b=>({...b, d:new Date(b.date)}))
    .filter(b=> b.d.getFullYear()===y && b.d.getMonth()===m)
    .sort((a,b)=> a.d - b.d);
  if (!items.length) return null;
  return (
    <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-2">
      <div className="text-xs opacity-70 mb-1">Contas do mês</div>
      <ul className="space-y-1 text-sm">
        {items.map(i=>(
          <li key={i.id} className="flex items-center justify-between">
            <span>{pad2(i.d.getDate())}/{pad2(i.d.getMonth()+1)} — {i.title}</span>
            <button onClick={()=>onDel(i.id)} className="text-xs opacity-80 hover:opacity-100">remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
