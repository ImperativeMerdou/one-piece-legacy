/* ONE PIECE: LEGACY — VN engine (Phase 4D).
   Full-viewport 16:9 stage · world camera + shot system · logical asset roles with
   PORTABLE FALLBACK (committed SVG) / MERT PRIVATE (local cache) modes · rebuilt
   choice presentation + consequence playback. Data: window.SLICE (play/data/slice.js). */
"use strict";
(function(){
const $=id=>document.getElementById(id);

/* ================= ASSET ROLES ================= */
/* Private mode: window.PRIVATE_ROLES (generated, gitignored) maps role -> {src,h,ax}
   Fallback: SVG generators from portraits.js/backgrounds.js keyed by fallback ids. */
const FALLBACK={
  bg:{ "bg.cointoss.pit.wide.night":"pit-night","bg.cointoss.pit.cage":"pit-night",
       "bg.cointoss.harbor.night":"gullwharf","bg.cointoss.kettle.exterior":"gullwharf",
       "bg.cointoss.kettle.interior":"kettle-interior","insert.stove":"kettle-interior"},
  ch:{ "char.merdou":"merdou","char.ashren":"ashren","npc.brakko":"brakko","npc.marn":"marn",
       "npc.collector1":"collector","npc.collector2":"collector","npc.joro":"joro"},
  mood:{neutral:"neutral",talk:"talk",shout:"shout",laugh:"grin",grin:"grin",angry:"angry",
        combat:"angry",serious:"serious",shock:"shock",smug:"smug",hurt:"hurt",
        embarrassed:"shock",disgust:"angry",flustered:"shock",base:"neutral"}
};
const PRIV=window.PRIVATE_ROLES||null;
const MODE_PRIVATE=!!PRIV;
function bgSrc(role){
  if(MODE_PRIVATE&&PRIV[role])return PRIV[role].src;
  return null; // fallback handled via CSS background svg data-uri
}
function bgFallbackCss(role){
  const id=FALLBACK.bg[role]||"gullwharf";
  return window.BACKGROUNDS?window.BACKGROUNDS.get(id):"";
}
function charSrc(base,mood){
  const role=base+"."+mood;
  if(MODE_PRIVATE){
    if(PRIV[role])return PRIV[role];
    const b=PRIV[base+".base"]||PRIV[base+".neutral"];
    if(b){MISSING.add(role);return b;}
  }
  return null;
}
const MISSING=new Set();

/* ================= STATE ================= */
function freshState(){return{
  resources:{purse:0,debt:{}},
  reputation:{pit:"JOKE"},
  bonds:{ashren:"loyal",marn:"warm",joro:"neutral"},
  pressure:{gups_alert:0,island:0},
  world:{joro_fate:null},
  flags:{}, choices:[], threads:[],
  meta:{scene:null,beat:0,ts:0,slice:"pit-kettle-v1"},
  read:{}
};}
let S=freshState();
const LSKEY=n=>"oplegacy_slice_slot"+n;
function snapshot(){S.meta.ts=Date.now();return JSON.stringify(S);}
function saveSlot(n){try{localStorage.setItem(LSKEY(n),snapshot());}catch(e){}}
function loadSlot(n){try{const d=localStorage.getItem(LSKEY(n));return d?JSON.parse(d):null;}catch(e){return null;}}
function autosave(){saveSlot(0);}
function getPath(o,p){return p.split('.').reduce((a,k)=>a==null?a:a[k],o);}
function setPath(o,p,v){const ks=p.split('.');let t=o;for(let i=0;i<ks.length-1;i++){if(t[ks[i]]==null)t[ks[i]]={};t=t[ks[i]];}t[ks[ks.length-1]]=v;}
function passes(c){
  if(!c)return true;
  if(Array.isArray(c))return c.every(passes);
  const v=getPath(S,c.k);
  switch(c.op||'eq'){case 'eq':return v===c.v;case 'ne':return v!==c.v;
    case 'gte':return (v||0)>=c.v;case 'lte':return (v||0)<=c.v;
    case 'truthy':return !!v;case 'falsy':return !v;
    case 'chose':return S.choices.some(x=>x.id===c.v&&(c.opt==null||x.opt===c.opt));
    default:return true;}
}
function applyEffects(fx){
  if(!fx)return{known:[],hidden:false};
  const known=fx.known?fx.known.slice():[];let hidden=false;
  if(fx.set)for(const k in fx.set)setPath(S,k,fx.set[k]);
  if(fx.add)for(const k in fx.add)setPath(S,k,(getPath(S,k)||0)+fx.add[k]);
  if(fx.purse!=null)S.resources.purse+=fx.purse;
  if(fx.bond)for(const id in fx.bond)S.bonds[id]=fx.bond[id];
  if(fx.hidden&&fx.hidden.length){hidden=true;fx.hidden.forEach(h=>{S.threads.push({note:h.note});if(h.fx)applyEffects({set:h.fx.set,add:h.fx.add});});}
  refreshHUD();
  return{known,hidden};
}

/* ================= WORLD / CAMERA ================= */
const WW=1920,WH=1080;
let stageScale=1;
function fitStage(){
  const st=$("stage");stageScale=st.clientWidth/WW;
  applyCam(CAM,true);
}
let CAM=[960,540,1];
function applyCam(cam,instant){
  CAM=cam;const [cx,cy,z]=cam;
  const w=$("world");
  const s=stageScale*z;
  const tx=($("stage").clientWidth/2)-cx*s, ty=($("stage").clientHeight/2)-cy*s;
  if(instant)w.style.transition="none";
  w.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;
  if(instant){void w.offsetWidth;w.style.transition="";}
}

/* backgrounds */
let bgCur=null;
function setBG(role,layerId){
  const layer=$(layerId||"bgfar");
  layer.innerHTML="";
  const src=bgSrc(role);
  if(src){const img=document.createElement("img");img.src=src;layer.appendChild(img);}
  else{const div=document.createElement("div");div.style.cssText="position:absolute;inset:0;background-size:cover;background-position:center;";
    div.style.backgroundImage=bgFallbackCss(role);layer.appendChild(div);}
  bgCur=role;
}

/* actors */
const ACTORS={};
function showActor(id,spec){
  // spec:{role:"char.merdou",mood,x,h,flip,dim,z}
  let a=ACTORS[id];
  if(!a){a=document.createElement("div");a.className="actor enter";a.dataset.id=id;
    a.appendChild(document.createElement("img"));$("chars").appendChild(a);ACTORS[id]=a;}
  const img=a.firstChild;
  const pr=charSrc(spec.role,spec.mood||"neutral");
  if(pr){img.src=pr.src;}
  else{ // SVG fallback
    const fid=FALLBACK.ch[spec.role]||"merdou";
    const fm=FALLBACK.mood[spec.mood||"neutral"]||"neutral";
    img.src="data:image/svg+xml,"+encodeURIComponent(window.PORTRAITS.get(fid,fm).replace(/^\s+/,""));
  }
  const h=spec.h||880;
  a.style.height=h+"px";
  a.style.left=(spec.x-((pr&&pr.w?pr.w:h)*0)+0)+"px"; // x = anchor center; width handled by translate
  a.style.transform=`translateX(-50%) ${spec.flip?"scaleX(-1)":""}`;
  a.style.bottom=(spec.y!=null?(WH-spec.y):0)+"px";
  a.style.zIndex=spec.z!=null?spec.z:5;
  a.classList.toggle("dim",!!spec.dim);
  a.dataset.role=spec.role;a.dataset.mood=spec.mood||"neutral";
  a.dataset.h=h;
  return a;
}
function hideActor(id){if(ACTORS[id]){ACTORS[id].remove();delete ACTORS[id];}}
function clearActors(){for(const k in ACTORS)hideActor(k);}
function setMood(id,mood){
  const a=ACTORS[id];if(!a)return;
  const pr=charSrc(a.dataset.role,mood);
  if(pr)a.firstChild.src=pr.src;
  else{const fid=FALLBACK.ch[a.dataset.role]||"merdou";
    a.firstChild.src="data:image/svg+xml,"+encodeURIComponent(window.PORTRAITS.get(fid,FALLBACK.mood[mood]||"neutral"));}
  a.dataset.mood=mood;
  a.classList.remove("snap");void a.offsetWidth;a.classList.add("snap");
}
function focusActor(id){
  for(const k in ACTORS)ACTORS[k].classList.toggle("dim",id!=null&&k!==id&&!ACTORS[k].dataset.keepBright);
  if(id&&ACTORS[id])ACTORS[id].classList.remove("dim");
}

/* ================= TEXT / UI ================= */
function names(id){return({merdou:"MERDOU",ashren:"ASHREN",brakko:"BRAKKO",marn:"AUNTIE MARN",
  joro:"JORO",collector:"COLLECTOR",collector2:"COLLECTOR",announcer:"ANNOUNCER",voice:"",
  grandmother:"GRANDMOTHER",dyegirl:"DYE-GIRL",crowd:"THE PIT",kid:"FENCE-SLAT KID"})[id]??id.toUpperCase();}
function fmt(t){return t.replace(/\*\*(.+?)\*\*/g,'<span class="shout">$1</span>').replace(/\*(.+?)\*/g,'<em>$1</em>');}
function showText(kind,who,text){
  $("textzone").classList.remove("hiddenEl");
  const tb=$("textbox");tb.classList.toggle("cap",kind!=="say");
  const np=$("nameplate");
  if(kind==="say"&&names(who)){np.classList.remove("hidden");np.textContent=names(who);}
  else np.classList.add("hidden");
  $("btext").innerHTML=fmt(text);
}
function hideText(){$("textzone").classList.add("hiddenEl");}
let overlay=null;
function showOverlay(html){clearOverlay();const d=document.createElement("div");d.innerHTML=html;
  overlay=d.firstElementChild;$("stage").appendChild(overlay);return overlay;}
function clearOverlay(){if(overlay){overlay.remove();overlay=null;}}
function refreshHUD(){
  $("hud-berry").textContent=S.resources.purse>0?S.resources.purse.toLocaleString()+"₿":(S.resources.purse<0?S.resources.purse.toLocaleString()+"₿":"broke");
  $("hud-scene").textContent=SCENE?SCENE.title:"";
}

/* fx */
function doFX(kind){
  const st=$("stage");
  if(kind==="shake"||kind==="shake-hard"){st.classList.remove("shake","shake-hard");void st.offsetWidth;st.classList.add(kind);}
  if(kind==="flash"){$("flash").className="on";setTimeout(()=>$("flash").className="",520);}
  if(kind==="flash-long"){$("flash").className="on long";setTimeout(()=>$("flash").className="",1050);}
  if(kind==="speed"){const s=$("speed");s.classList.remove("on");void s.offsetWidth;s.classList.add("on");}
}
function sfxWord(word,x,y,size){
  if(!word)return;
  const el=document.createElement("div");el.className="sfxword";el.textContent=word;
  const st=$("stage");
  el.style.left=((x!=null?x:25+Math.random()*35))+"%";
  el.style.top=((y!=null?y:18+Math.random()*22))+"%";
  if(size)el.style.fontSize=size+"px";
  st.appendChild(el);setTimeout(()=>el.remove(),950);
}

/* ================= FLOW ================= */
let SCENE=null,IDX=0,WAIT=null,BUSY=false,SKIP=false,PENDING_PANEL=null;
function gotoScene(sid){
  const sc=window.SLICE.scenes[sid];
  if(!sc){endCard();return;}
  SCENE=sc;IDX=0;S.meta.scene=sid;S.meta.beat=0;
  if(!sc.keep){clearActors();hideText();clearOverlay();}
  autosave();refreshHUD();
  advance();
}
function endCard(){
  clearOverlay();hideText();
  showOverlay(`<div class="titlecard sting"><div class="ep">VERTICAL SLICE</div><div class="rule"></div>
   <div class="tt">[ END OF SLICE ]</div><div class="rule"></div>
   <div class="ep" style="letter-spacing:.2em">YOUR CHOICES ARE SAVED · THE SAGA CONTINUES PAST THIS POINT IN THE CLASSIC BUILD</div></div>`);
  WAIT="end";
}
function advance(){
  if(BUSY)return;
  const beats=SCENE.beats;
  while(IDX<beats.length){
    const b=beats[IDX];IDX++;S.meta.beat=IDX;
    if(b.if&&!passes(b.if))continue;
    S.read[SCENE.id]=Math.max(S.read[SCENE.id]||0,IDX);
    if(renderBeat(b))return;
  }
  if(SCENE.goto)gotoScene(SCENE.goto);else endCard();
}
function isRead(){return false;} // slice: keep simple
function hold(){WAIT="tap";return true;}

function renderBeat(b){
  switch(b.t){
    case "shot":{
      if(b.bg&&b.bg!==bgCur)setBG(b.bg);
      $("stage").classList.toggle("cine",!!b.cine);
      if(b.clear)clearActors();
      (b.actors||[]).forEach(a=>showActor(a.id,a));
      if(b.hide)b.hide.forEach(hideActor);
      applyCam(b.cam||[960,540,1],b.cut);
      if(b.pan&&!document.body.classList.contains("reduced")){
        applyCam(b.pan[0],true);requestAnimationFrame(()=>requestAnimationFrame(()=>applyCam(b.pan[1])));
      }
      return false;}
    case "mood":setMood(b.who,b.mood);return false;
    case "hide":hideActor(b.who);return false;
    case "set":applyEffects(b.effects);return false;
    case "fx":doFX(b.kind);if(b.sfx)sfxWord(b.sfx,b.x,b.y,b.size);return false;
    case "sfx":sfxWord(b.word,b.x,b.y,b.size);return false;
    case "card":hideText();showOverlay(`<div class="opcard">${b.text}</div>`);return hold();
    case "title":hideText();clearOverlay();
      showOverlay(`<div class="titlecard${b.sting?" sting":""}"><div class="ep">${b.ep||""}</div><div class="rule"></div><div class="tt">${b.title}</div></div>`);
      return hold();
    case "cap":clearOverlay();focusActor(null);showText("cap","",b.text);return hold();
    case "say":clearOverlay();
      if(b.mood&&ACTORS[b.who])setMood(b.who,b.mood);
      if(ACTORS[b.who])focusActor(b.who);else focusActor(null);
      showText("say",b.who,b.text);return hold();
    case "cutin":clearOverlay();hideText();
      {const pr=b.role?charSrc(b.role,b.mood||"shock"):null;
       const imgHtml=pr?`<img class="cimg" src="${pr.src}">`:"";
       showOverlay(`<div id="cutin">${imgHtml}<div class="ctext">${fmt(b.text||"")}</div></div>`);}
      return hold();
    case "insert":clearOverlay();hideText();
      {const src=MODE_PRIVATE&&PRIV[b.role]?PRIV[b.role].src:null;
       showOverlay(`<div id="insert">${src?`<img src="${src}">`:""}</div>`);
       if(b.text){$("textzone").classList.remove("hiddenEl");showText("cap","",b.text);}}
      return hold();
    case "choice":return doChoice(b);
    case "panel":return doPanel();
    case "quiet":$("stage").classList.toggle("quiet",b.on!==false);return false;
    default:return false;
  }
}

/* ---------- choices ---------- */
function doChoice(b){
  hideText();clearOverlay();WAIT="choice";
  const z=showOverlay(`<div id="choicezone"><div class="dimmer"></div>
    <div id="choicehead">◆ ${b.prompt||"What does Merdou do?"} ◆</div>
    <div id="choices"></div></div>`);
  const wrap=z.querySelector("#choices");
  const opts=b.options.filter(o=>!o.if||passes(o.if));
  opts.forEach((o,i)=>{
    const el=document.createElement("button");el.className="copt";
    el.innerHTML=`<span class="key">${i+1}</span><span class="lbl">${o.label}</span><span class="risk">${o.risk||""}</span>`;
    el.onmouseenter=()=>{if(o.hl&&ACTORS[o.hl]){focusActor(o.hl);ACTORS[o.hl].classList.add("hl");}
      if(o.mood&&ACTORS.merdou)setMood("merdou",o.mood);};
    el.onmouseleave=()=>{for(const k in ACTORS)ACTORS[k].classList.remove("hl");};
    el.onclick=()=>pick(b,o,wrap,el);
    wrap.appendChild(el);
  });
  z._opts=opts;z._beat=b;
  return true;
}
let PICKED=false;
function pick(b,o,wrap,el){
  if(BUSY||PICKED)return;PICKED=true;BUSY=true;
  [...wrap.children].forEach(x=>{x.onclick=null;if(x!==el)x.classList.add("faded");});
  el.classList.add("picked");
  S.choices.push({id:b.id,opt:o.id,label:o.label});
  const res=applyEffects(o.effects);
  PENDING_PANEL={lines:res.known,hidden:res.hidden};
  for(const k in ACTORS)ACTORS[k].classList.remove("hl");
  setTimeout(()=>{BUSY=false;PICKED=false;clearOverlay();autosave();
    if(o.goto)gotoScene(o.goto);else advance();},700);
}
function doPanel(){
  const data=PENDING_PANEL||{lines:[],hidden:false};PENDING_PANEL=null;
  if(!data.lines.length&&!data.hidden)return false;
  hideText();WAIT="panel";
  const ICONS={crowd:"👥",berry:"₿",bond:"♦",alert:"❗",secret:"⟡",rep:"★",law:"⚖",skull:"☠",boat:"⚓",fire:"🔥",route:"⇉"};
  let h=`<div id="panelwrap"><div id="panelcard"><h3>— WHAT CHANGED —</h3>`;
  data.lines.forEach(l=>{h+=`<div class="chline"><div class="ic">${ICONS[l.icon]||"•"}</div><div><span class="who">${l.who||""}</span>${l.text}</div></div>`;});
  if(data.hidden)h+=`<div class="chline hid"><div class="ic">⟡</div><div>Something moved beyond your sight.</div></div>`;
  h+=`<button id="panelok">CONTINUE ▸</button></div></div>`;
  showOverlay(h);
  $("panelok").onclick=()=>{WAIT=null;clearOverlay();advance();};
  return true;
}

/* ================= INPUT ================= */
function tap(){if(BUSY)return;
  if(WAIT==="tap"){WAIT=null;advance();}}
document.addEventListener("keydown",e=>{
  if(!$("menuwrap").classList.contains("hiddenEl")){if(e.key==="Escape")toggleMenu(false);return;}
  if(WAIT==="choice"&&overlay){
    const n=parseInt(e.key);
    if(n>=1&&n<=3&&overlay._opts&&overlay._opts[n-1]){
      const wrap=overlay.querySelector("#choices");
      pick(overlay._beat,overlay._opts[n-1],wrap,wrap.children[n-1]);return;}
  }
  if(WAIT==="panel"&&(e.key===" "||e.key==="Enter")){$("panelok").click();return;}
  if(e.key===" "||e.key==="Enter"||e.key==="ArrowRight"){e.preventDefault();tap();}
  if(e.key==="Escape")toggleMenu();
  if(e.key.toLowerCase()==="f")toggleFullscreen();
});

/* ================= MENU ================= */
function slotLine(n){const d=loadSlot(n);if(!d)return "empty";
  return `${d.meta.scene||"start"} · ${(d.choices||[]).length} choices · ${new Date(d.meta.ts).toLocaleTimeString()}`;}
function toggleMenu(force){
  const m=$("menuwrap");const show=force!=null?force:m.classList.contains("hiddenEl");
  m.classList.toggle("hiddenEl",!show);
  if(!show)return;
  let h=`<h2>THE COIN LANDS — VERTICAL SLICE</h2>`;
  h+=`<div class="slot"><div class="info"><b>Continue</b> — ${slotLine(0)}</div><button data-a="load" data-n="0">RESUME</button></div>`;
  for(let n=1;n<=3;n++)h+=`<div class="slot"><div class="info"><b>Slot ${n}</b> — ${slotLine(n)}</div>
    <button data-a="save" data-n="${n}">SAVE</button><button data-a="load" data-n="${n}">LOAD</button></div>`;
  h+=`<label><input type="checkbox" id="rm" ${document.body.classList.contains("reduced")?"checked":""}> Reduced motion (cuts and fades instead of movement)</label>`;
  h+=`<div style="display:flex;gap:.6em;flex-wrap:wrap;margin-top:1em">
    <button data-a="fs">FULLSCREEN</button><button data-a="restart">RESTART SLICE</button><button data-a="close">CLOSE</button></div>`;
  h+=`<div style="margin-top:1em;color:#5a6272;font-size:.85em">SPACE/ENTER advance · 1-3 choose · F fullscreen · ESC menu</div>`;
  $("menucard").innerHTML=h;
  $("menucard").querySelectorAll("button").forEach(btn=>btn.onclick=()=>{
    const a=btn.dataset.a,n=+btn.dataset.n;
    if(a==="close")toggleMenu(false);
    if(a==="fs"){toggleFullscreen();toggleMenu(false);}
    if(a==="save"){saveSlot(n);toggleMenu(true);}
    if(a==="load"){const d=loadSlot(n);if(d){S=d;toggleMenu(false);gotoScene(S.meta.scene||window.SLICE.start);}}
    if(a==="restart"){S=freshState();toggleMenu(false);gotoScene(window.SLICE.start);}
  });
  const rm=$("menucard").querySelector("#rm");
  rm.onchange=()=>{document.body.classList.toggle("reduced",rm.checked);
    try{localStorage.setItem("oplegacy_rmotion",rm.checked?"1":"0");}catch(e){}};
}
function toggleFullscreen(){
  if(document.fullscreenElement)document.exitFullscreen();
  else $("frame").requestFullscreen&&$("frame").requestFullscreen();
}

/* ================= BOOT ================= */
window.addEventListener("resize",fitStage);
document.addEventListener("fullscreenchange",fitStage);
window.addEventListener("DOMContentLoaded",()=>{
  $("stage").addEventListener("click",e=>{
    if(e.target.closest("button,#choices,#panelcard,#menuwrap"))return;tap();});
  $("hud-menu").onclick=()=>toggleMenu();
  $("hud-fs").onclick=toggleFullscreen;
  try{document.body.classList.toggle("reduced",localStorage.getItem("oplegacy_rmotion")==="1");}catch(e){}
  if(/[?&]dev=1/.test(location.search))document.body.classList.add("dev");
  $("devstatus").textContent=`assets: ${MODE_PRIVATE?"MERT PRIVATE MODE":"PORTABLE FALLBACK"} · roles ${MODE_PRIVATE?Object.keys(PRIV).length:0}${MISSING.size?" · missing:"+[...MISSING].join(","):""}`;
  fitStage();
  const auto=loadSlot(0);
  if(auto&&auto.meta&&auto.meta.scene&&auto.meta.slice==="pit-kettle-v1"){S=auto;gotoScene(S.meta.scene);}
  else gotoScene(window.SLICE.start);
});
})();
