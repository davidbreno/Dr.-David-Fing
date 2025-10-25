"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function Dot({ className = "" }) { return <span className={`h-2 w-2 rounded-full ${className}`} />; }
function TreeItem({ href, label, active }) {
  return (
    <li className="relative pl-6">
      <span className="absolute left-0 top-0 h-full w-4">
        <span
          className="absolute left-0 top-0 h-6 w-[0.5px] rounded"
          style={{
            background: "linear-gradient(180deg, #eb1378 0%, #f9403b 50%, #fe5429 100%)",
            opacity: 0.18,
            filter: "blur(0.5px)"
          }}
        ></span>
        <span
          className="absolute left-0 top-6 h-[calc(100%-1.5rem)] w-[0.5px] rounded"
          style={{
            background: "linear-gradient(180deg, #eb1378 0%, #ee127d 100%)",
            opacity: 0.14,
            filter: "blur(0.5px)"
          }}
        ></span>
        <span
          className="absolute left-0 top-6 h-[1px] w-4 rounded"
          style={{
            background: "linear-gradient(90deg, #eb1378 0%, #fe5429 100%)",
            opacity: 0.12,
            filter: "blur(0.5px)"
          }}
        ></span>
      </span>
      <Link href={href} className={["inline-block rounded-xl px-4 py-2 transition-colors", active ? "bg-white/15":"hover:bg-white/10"].join(" ")}>{label}</Link>
    </li>
  );
}

export default function Sidebar(){
  const pathname = usePathname();
  const [open,setOpen]=useState(true);
  const [notes,setNotes]=useState("");

  useEffect(()=>{ const s=typeof window!=="undefined"?localStorage.getItem("notes"):null; if(s!==null) setNotes(s); },[]);
  useEffect(()=>{ if(typeof window!=="undefined") localStorage.setItem("notes", notes); },[notes]);

  const sub=[
    {href:"/entradas", label:"Entradas e saídas"},
    {href:"/contas",   label:"Contas a pagar"},
    {href:"/config",   label:"Config"},
    {href:"/sair",     label:"Exit"},
  ];
  const isActive=(p)=>pathname===p;

  return (
    <aside className="relative">
      <div className="absolute -right-4 top-40 z-10 h-8 w-8 rounded-full glass flex items-center justify-center text-slate-200/70 select-none">‹</div>
      <div
        className="rounded-[32px] p-4 lg:p-6 min-h-[100vh] flex flex-col"
        style={{
          background: "linear-gradient(135deg, #eb1378 0%, #f9403b 35%, #fe5429 65%, #ee127d 100%)"
        }}
      >
        <div className="relative">
          <div className="absolute -top-3 left-0 right-0 flex items-center justify-center gap-2">
            <Dot className="bg-red-400/70"/><Dot className="bg-yellow-300/70"/><Dot className="bg-green-400/70"/>
          </div>
          <div className="flex items-center gap-3 pt-4 pb-5">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-white/10">
              <img alt="avatar" className="h-full w-full object-cover" src="https://picsum.photos/96?grayscale"/>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-wide">Dr. David Breno</p>
              <p className="text-[11px] opacity-70 uppercase tracking-[.12em]">Cirurgião Dentista e Designer</p>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <button onClick={()=>setOpen(v=>!v)} className="w-full glass rounded-2xl px-4 py-3 flex items-center gap-3" aria-expanded={open}>
            <span className="grid grid-cols-2 gap-0.5">
              <span className="h-3 w-3 rounded bg-white/50"/><span className="h-3 w-3 rounded bg-white/50"/>
              <span className="h-3 w-3 rounded bg-white/50"/><span className="h-3 w-3 rounded bg-white/50"/>
            </span>
            <span className="text-sm">Dashboard</span>
            <span className="ml-auto text-lg leading-none opacity-70">{open ? "▴" : "▾"}</span>
          </button>
          {open && (
            <ul className="mt-3 space-y-3">
              {sub.map(s=><TreeItem key={s.href} href={s.href} label={s.label} active={isActive(s.href)}/>)}
            </ul>
          )}
        </div>

        <div className="flex-1"/>
        <section className="mt-4">
          <h3 className="text-center text-sm opacity-80 mb-2">Lembretes</h3>
          <div className="glass rounded-3xl p-3">
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Anote aqui..." className="w-full h-44 resize-none rounded-xl bg-white/10 border border-white/10 p-3 outline-none"/>
            <div className="mt-2 flex gap-2">
              <button onClick={()=>localStorage.setItem("notes", notes)} className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/10">Salvar</button>
              <button onClick={()=>setNotes("")} className="rounded-xl px-4 py-2 bg-white/5 hover:bg-white/15 transition-colors border border-white/10">Limpar</button>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
