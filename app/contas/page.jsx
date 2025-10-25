"use client";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useEffect, useMemo, useState } from "react";

const K="bills-v1";

function daysInMonth(y,m){ return new Date(y, m+1, 0).getDate(); }

export default function Contas(){
  const now=new Date();
  const [year,setYear]=useState(now.getFullYear());
  const [month,setMonth]=useState(now.getMonth()); // 0-11
  const [bills,setBills]=useState([]);
  const [form,setForm]=useState({title:"", value:"", date:new Date().toISOString().slice(0,10)});

  useEffect(()=>{ const s=localStorage.getItem(K); if(s) setBills(JSON.parse(s)); },[]);
  useEffect(()=>{ localStorage.setItem(K, JSON.stringify(bills)); },[bills]);

  const add=()=>{ if(!form.title || !form.date) return;
    setBills(prev=>[...prev,{ id:crypto.randomUUID(), ...form, value:Number(form.value||0), paid:false }]);
    setForm({title:"", value:"", date:new Date().toISOString().slice(0,10)});
  };
  const togglePaid=id=>setBills(prev=>prev.map(b=>b.id===id?{...b,paid:!b.paid}:b));
  const del=id=>setBills(prev=>prev.filter(b=>b.id!==id));

  const grid=useMemo(()=>{
    const first=new Date(year,month,1).getDay(); // 0=dom
    const total=daysInMonth(year,month);
    const cells=[];
    for(let i=0;i<first;i++) cells.push({empty:true});
    for(let d=1; d<=total; d++){
      const iso=new Date(year,month,d).toISOString().slice(0,10);
      const dayBills=bills.filter(b=>b.date===iso);
      cells.push({day:d, iso, items:dayBills});
    }
    while(cells.length%7!==0) cells.push({empty:true});
    return cells;
  },[year,month,bills]);

  const prev=()=>{ const m=month-1; if(m<0){setMonth(11); setYear(y=>y-1);} else setMonth(m); };
  const next=()=>{ const m=month+1; if(m>11){setMonth(0); setYear(y=>y+1);} else setMonth(m); };

  const monthName=new Intl.DateTimeFormat("pt-BR",{month:"long"}).format(new Date(year,month,1));

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-6">
        <h1 className="text-lg font-semibold mb-4">Contas a pagar</h1>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">Título<br/><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <label className="text-sm">Valor (R$)<br/><input type="number" step="0.01" value={form.value} onChange={e=>setForm(f=>({...f,value:e.target.value}))} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <label className="text-sm">Data<br/><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <Button onClick={add}>Salvar</Button>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="opacity-70"><tr><th className="text-left py-2">Data</th><th className="text-left">Título</th><th className="text-right">Valor</th><th className="text-center">Pago</th><th></th></tr></thead>
            <tbody>
              {bills.slice().reverse().map(b=>(
                <tr key={b.id} className="border-t border-white/10">
                  <td className="py-2">{b.date}</td>
                  <td>{b.title}</td>
                  <td className="text-right">R$ {b.value.toFixed(2)}</td>
                  <td className="text-center">
                    <input type="checkbox" checked={b.paid} onChange={()=>togglePaid(b.id)} className="accent-teal-400"/>
                  </td>
                  <td className="text-right"><button onClick={()=>del(b.id)} className="text-xs opacity-70 hover:opacity-100">apagar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={prev} className="text-sm opacity-70 hover:opacity-100">◀</button>
          <h2 className="text-sm opacity-80 capitalize">{monthName} / {year}</h2>
          <button onClick={next} className="text-sm opacity-70 hover:opacity-100">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {["D","S","T","Q","Q","S","S"].map((d,i)=><div key={i} className="text-center text-xs opacity-70">{d}</div>)}
          {grid.map((c,idx)=>c.empty
            ? <div key={idx} className="h-24 rounded-xl bg-white/0"></div>
            : <div key={idx} className="h-24 rounded-xl bg-white/5 border border-white/10 p-2 text-xs relative">
                <div className="absolute top-2 right-2 text-[10px] opacity-60">{String(c.day).padStart(2,"0")}</div>
                <ul className="space-y-1">
                  {c.items.map(b=><li key={b.id} className={`truncate ${b.paid?"opacity-50 line-through":""}`}>{b.title} · R$ {b.value}</li>)}
                </ul>
              </div>
          )}
        </div>
      </Card>
    </div>
  );
}