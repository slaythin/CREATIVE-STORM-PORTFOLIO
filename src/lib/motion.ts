import {useSyncExternalStore} from 'react';
let enabled=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
try{enabled=enabled&&localStorage.getItem('storm-motion')!=='off';}catch{}
const listeners=new Set<()=>void>();
const media=window.matchMedia('(prefers-reduced-motion: reduce)');
function announce(){document.documentElement.classList.toggle('motion-off',!enabled);listeners.forEach(fn=>fn());}
media.addEventListener('change',e=>{if(e.matches){enabled=false;announce();}});
announce();
export function useMotion(){const motion=useSyncExternalStore(fn=>{listeners.add(fn);return()=>{listeners.delete(fn);}},()=>enabled);return {motion,toggle:()=>{enabled=!enabled;try{localStorage.setItem('storm-motion',enabled?'on':'off');}catch{}announce();}};}
