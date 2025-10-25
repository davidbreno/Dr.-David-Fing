"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext({ theme:"emerald", setTheme:()=>{}, font:"inter", setFont:()=>{} });

export const THEMES = [
  { id:"emerald", name:"Emerald" }, { id:"teal", name:"Teal" }, { id:"purple", name:"Purple" },
  { id:"amber", name:"Amber" }, { id:"rose", name:"Rose" },
  { id:"blackcyan", name:"BlackCyan" }, { id:"silver", name:"Silver" }
];
export const FONTS = [
  { id:"inter", name:"Inter (Sans)" },
  { id:"merri", name:"Merriweather (Serif)" },
  { id:"playfair", name:"Playfair (Serif)" }
];

export default function ThemeProvider({ children }){
  const [theme,setTheme] = useState("emerald");
  const [font,setFont]   = useState("inter");

  useEffect(()=>{ const t=localStorage.getItem("theme"); const f=localStorage.getItem("font"); if(t) setTheme(t); if(f) setFont(f); },[]);
  useEffect(()=>{ document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("theme", theme); },[theme]);
  useEffect(()=>{ document.documentElement.setAttribute("data-font", font);   localStorage.setItem("font", font); },[font]);

  const value = useMemo(()=>({ theme,setTheme,font,setFont }),[theme,font]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
export const useTheme = ()=>useContext(ThemeCtx);