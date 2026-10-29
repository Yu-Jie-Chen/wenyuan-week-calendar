export const DAY=86400000, OFFSET=8*3600000, START=480, END=1320;
export const dayStart=(t=Date.now())=>Math.floor((t+OFFSET)/DAY)*DAY-OFFSET;
export const monday=(t=Date.now())=>{const d=dayStart(t);return d-((new Date(d+OFFSET).getUTCDay()+6)%7)*DAY;};
export const dateKey=t=>new Date(t+OFFSET).toISOString().slice(0,10);
export const timeText=t=>new Date(t+OFFSET).toISOString().slice(11,16);
export const text=v=>v==null?'':typeof v==='string'?v:typeof v==='number'?String(v):Array.isArray(v)?v.map(text).join(''):text(v.text??v.name??v.value??v.val??'');
export const number=v=>typeof v==='number'?v:Number(text(v));
export function layout(events,day){
  const lo=day+START*60000,hi=day+END*60000;
  const visible=events.filter(e=>e.start<hi&&e.end>lo).map(e=>({...e,a:Math.max(lo,e.start),b:Math.min(hi,e.end)})).sort((a,b)=>a.a-b.a||b.b-a.b||a.id.localeCompare(b.id));
  let group=[],groupEnd=-Infinity,ends=[];
  const finish=()=>{for(const e of group)e.columns=ends.length;group=[];ends=[];};
  for(const e of visible){if(e.a>=groupEnd){finish();groupEnd=e.b;}else groupEnd=Math.max(groupEnd,e.b);let lane=ends.findIndex(end=>end<=e.a);if(lane<0)lane=ends.length;ends[lane]=e.b;e.lane=lane;e.top=(e.a-lo)/60000/60*60;e.height=(e.b-e.a)/60000/60*60;group.push(e);}
  finish();return visible;
}
