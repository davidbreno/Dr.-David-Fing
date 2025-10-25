"use client";
import Card from "@/components/Card";
import Button from "@/components/Button";
import LineChart from "@/components/charts/LineChart";
import { useEffect, useMemo, useState } from "react";

const KEY="entries-v1"; // por quê: persistir local

export default function EntradasSaidas(){
  const [date,setDate]=useState(()=>new Date().toISOString().slice(0,10));
  const [entrada,setEntrada]=useState("");
  const [saida,setSaida]=useState("");
  const [items,setItems]=useState([]);

  useEffect(()=>{ const s=localStorage.getItem(KEY); if(s) setItems(JSON.parse(s)); },[]);
  useEffect(()=>{ localStorage.setItem(KEY, JSON.stringify(items)); },[items]);

  const add=()=>{ if(!entrada && !saida) return;
    setItems(prev=>[...prev,{ id:crypto.randomUUID(), date, entrada:Number(entrada||0), saida:Number(saida||0)}]);
    setEntrada(""); setSaida("");
  };
  const del=id=>setItems(prev=>prev.filter(i=>i.id!==id));
  const clearAll=()=>setItems([]);

  const byDay=useMemo(()=>{
    const map=new Map();
    const month=date.slice(0,7);
    items.filter(i=>i.date.startsWith(month)).forEach(i=>{
      const d=i.date.slice(8,10);
      const cur=map.get(d)||{e:0,s:0};
      cur.e+=i.entrada; cur.s+=i.saida; map.set(d,cur);
    });
    const days=[...Array(31)].map((_,i)=>String(i+1).padStart(2,"0"));
    const labels=[]; const ent=[]; const sai=[];
    days.forEach(d=>{ labels.push(d); const v=map.get(d)||{e:0,s:0}; ent.push(v.e); sai.push(v.s); });
    return { labels, ent, sai };
  },[items,date]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-6">
        <h1 className="text-lg font-semibold mb-4">Entradas e Saídas</h1>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">Data<br/><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <label className="text-sm">Entrada (R$)<br/><input type="number" step="0.01" value={entrada} onChange={e=>setEntrada(e.target.value)} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <label className="text-sm">Saída (R$)<br/><input type="number" step="0.01" value={saida} onChange={e=>setSaida(e.target.value)} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <Button onClick={add}>Salvar</Button>
          <Button onClick={()=>{setEntrada("");setSaida("");}}>Limpar campos</Button>
          <Button onClick={clearAll} className="bg-white/5">Apagar tudo</Button>
        </div>

        <div className="mt-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="opacity-70"><tr><th className="text-left py-2">Data</th><th className="text-right">Entrada</th><th className="text-right">Saída</th><th></th></tr></thead>
            <tbody>
              {items.slice().reverse().map(i=>(
                <tr key={i.id} className="border-t border-white/10">
                  <td className="py-2">{i.date}</td>
                  <td className="text-right">R$ {i.entrada.toFixed(2)}</td>
                  <td className="text-right">R$ {i.saida.toFixed(2)}</td>
                  <td className="text-right"><button onClick={()=>del(i.id)} className="text-xs opacity-70 hover:opacity-100">apagar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-sm opacity-80 mb-2">Visão do mês</h2>
        <div className="h-80">
          <LineChart labels={byDay.labels} series={[
            { label:"Entradas", data:byDay.ent },
            { label:"Saídas",   data:byDay.sai }
          ]}/>
        </div>
      </Card>
    </div>
  );
}
