"use client";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useEffect, useState } from "react";

const KC="secret-cocaine-v1";
const KZ="secret-zolpidem-v1";

function Row({ item, onSave, onDel, fields }){
  const [edit,setEdit]=useState(false);
  const [tmp,setTmp]=useState(item);
  return (
    <tr className="border-t border-white/10">
      {fields.map(f=>
        <td key={f} className="py-2">
          {edit
            ? <input className="rounded bg-white/10 border border-white/10 px-2 py-1 text-sm w-full" value={tmp[f]} onChange={e=>setTmp({...tmp,[f]:e.target.value})}/>
            : <span>{item[f]}</span>
          }
        </td>
      )}
      <td className="text-right">
        {edit
          ? <button onClick={()=>{onSave({...tmp}); setEdit(false);}} className="text-xs mr-2">salvar</button>
          : <button onClick={()=>setEdit(true)} className="text-xs mr-2">editar</button>}
        <button onClick={()=>onDel(item.id)} className="text-xs opacity-70 hover:opacity-100">apagar</button>
      </td>
    </tr>
  );
}

export default function Secreto(){
  const [c,setC]=useState([]); // cocaina
  const [z,setZ]=useState([]); // zolpidem

  const [fc,setFc]=useState({hora:"", local:"", motivo:""});
  const [fz,setFz]=useState({hora:"", quantidade:"", motivo:""});

  useEffect(()=>{ const sc=localStorage.getItem(KC); if(sc) setC(JSON.parse(sc)); const sz=localStorage.getItem(KZ); if(sz) setZ(JSON.parse(sz)); },[]);
  useEffect(()=>{ localStorage.setItem(KC, JSON.stringify(c)); },[c]);
  useEffect(()=>{ localStorage.setItem(KZ, JSON.stringify(z)); },[z]);

  const addC=()=>{ if(!fc.hora) return; setC(p=>[...p,{id:crypto.randomUUID(), ...fc}]); setFc({hora:"",local:"",motivo:""}); };
  const saveC=up=>setC(p=>p.map(i=>i.id===up.id?up:i));
  const delC=id=>setC(p=>p.filter(i=>i.id!==id));

  const addZ=()=>{ if(!fz.hora) return; setZ(p=>[...p,{id:crypto.randomUUID(), ...fz}]); setFz({hora:"",quantidade:"",motivo:""}); };
  const saveZ=up=>setZ(p=>p.map(i=>i.id===up.id?up:i));
  const delZ=id=>setZ(p=>p.filter(i=>i.id!==id));

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-6">
        <h1 className="text-lg font-semibold mb-4">Área Discreta</h1>

        <h2 className="text-sm opacity-80 mb-2">Cocaína — última hora de uso</h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">Hora<br/><input placeholder="ex: 22:35" value={fc.hora} onChange={e=>setFc({...fc,hora:e.target.value})} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <label className="text-sm">Local<br/><input value={fc.local} onChange={e=>setFc({...fc,local:e.target.value})} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <label className="text-sm">Motivo<br/><input value={fc.motivo} onChange={e=>setFc({...fc,motivo:e.target.value})} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 w-64"/></label>
          <Button onClick={addC}>Salvar</Button>
        </div>

        <div className="mt-3 overflow-auto">
          <table className="w-full text-sm">
            <thead className="opacity-70"><tr><th className="text-left py-2">Hora</th><th className="text-left">Local</th><th className="text-left">Motivo</th><th></th></tr></thead>
            <tbody>
              {c.slice().reverse().map(i=><Row key={i.id} item={i} onSave={saveC} onDel={delC} fields={["hora","local","motivo"]}/>)}
            </tbody>
          </table>
        </div>

        <hr className="my-6 border-white/10"/>

        <h2 className="text-sm opacity-80 mb-2">Zolpidem — registro de uso</h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-sm">Hora<br/><input placeholder="ex: 23:10" value={fz.hora} onChange={e=>setFz({...fz,hora:e.target.value})} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <label className="text-sm">Quantidade<br/><input placeholder="ex: 10mg" value={fz.quantidade} onChange={e=>setFz({...fz,quantidade:e.target.value})} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2"/></label>
          <label className="text-sm">Motivo<br/><input value={fz.motivo} onChange={e=>setFz({...fz,motivo:e.target.value})} className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 w-64"/></label>
          <Button onClick={addZ}>Salvar</Button>
        </div>

        <div className="mt-3 overflow-auto">
          <table className="w-full text-sm">
            <thead className="opacity-70"><tr><th className="text-left py-2">Hora</th><th className="text-left">Quantidade</th><th className="text-left">Motivo</th><th></th></tr></thead>
            <tbody>
              {z.slice().reverse().map(i=><Row key={i.id} item={i} onSave={saveZ} onDel={delZ} fields={["hora","quantidade","motivo"]}/>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}