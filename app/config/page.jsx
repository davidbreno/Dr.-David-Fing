"use client";
import Card from "@/components/Card";
import { THEMES, FONTS, useTheme } from "@/components/theme/ThemeProvider";
import { useState } from "react";

function Swatch({ themeId }){
  const map = {
    emerald:["#0b3b3a","#14b8a6","#60a5fa"], teal:["#063b3b","#45d7c4","#38bdf8"],
    purple:["#1a1335","#a855f7","#6366f1"], amber:["#3b2a0b","#f59e0b","#fbbf24"],
    rose:["#3b0b1a","#f43f5e","#fb7185"], blackcyan:["#020617","#22d3ee","#0ea5a4"],
    silver:["#0e1014","#e2e8f0","#94a3b8"]
  };
  const cols = map[themeId] || ["#111","#444","#777"];
  return <div className="flex gap-1">{cols.map((c,i)=><span key={i} className="h-5 w-5 rounded" style={{background:c}} />)}</div>;
}

export default function Config(){
  const { theme,setTheme, font,setFont } = useTheme();
  const [tSel,setTSel] = useState(theme);
  const [fSel,setFSel] = useState(font);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="p-6">
        <h1 className="text-lg font-semibold mb-4">Configurações</h1>

        <div className="mb-2 text-sm opacity-80">Tema</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEMES.map((t)=>(
            <button key={t.id} onClick={()=>setTSel(t.id)}
              className={`glass rounded-2xl p-4 text-left transition-colors border ${tSel===t.id?"border-white/40":"border-white/10"} hover:border-white/30`}>
              <div className="flex items-center justify-between">
                <div><div className="font-medium">{t.name}</div><div className="text-xs opacity-70">{t.id}</div></div>
                <Swatch themeId={t.id}/>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={()=>setTheme(tSel)} className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10">Aplicar tema</button>
          <button onClick={()=>{setTSel("emerald");setTheme("emerald");}} className="rounded-xl px-4 py-2 bg-white/5 hover:bg-white/15 border border-white/10">Padrão</button>
        </div>

        <div className="mt-6 mb-2 text-sm opacity-80">Fonte</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FONTS.map(f=>(
            <button key={f.id} onClick={()=>setFSel(f.id)}
              className={`glass rounded-2xl p-3 text-left transition-colors border ${fSel===f.id?"border-white/40":"border-white/10"} hover:border-white/30`}>
              <div className="font-medium">{f.name}</div>
              <div className="text-xs opacity-70">{f.id}</div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={()=>setFont(fSel)} className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10">Aplicar fonte</button>
          <button onClick={()=>{setFSel("inter");setFont("inter");}} className="rounded-xl px-4 py-2 bg-white/5 hover:bg-white/15 border border-white/10">Padrão</button>
        </div>
      </Card>
    </div>
  );
}
