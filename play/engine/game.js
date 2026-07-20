/* ONE PIECE: LEGACY — The Coin Lands. Deterministic offline episode engine.
   No network, no AI, no sound. Data: window.SAGA (data/episode*.js).
   Spec: docs/runtime/GAME_STATE_SCHEMA.md + CHOICE_CONSEQUENCE_SYSTEM.md */
"use strict";
(function(){
const $=id=>document.getElementById(id);
const SAGA=window.SAGA;

/* ================= STATE ================= */
function freshState(){return{
  resources:{purse:0,debt:{}},
  injuries:{merdou:[],ashren:[]},
  promises:[],
  secrets:{bull:"hidden",patricide:"hidden",wings:"hidden",flame:"hidden"},
  exposure:{level:"none",whispers:[]},
  reputation:{pit:"JOKE",headlines:[]},
  bonds:{ashren:"loyal",marn:"warm",joro:"neutral",hale:"wary",priya:"neutral",
         cesto:"neutral",pinch:"impressed",tam:"neutral",island:"neutral"},
  pressure:{island:0,gups_alert:0,marine_suspicion:0},
  routes:{opened:[],closed:[]},
  marks:{cointoss:null},
  world:{joro_fate:null,kettle:"open",ferry:"running",tam_aboard:true,boat:null,gups_fate:null},
  flags:{},
  choices:[],
  threads:[],            // hidden threads (surfaced later)
  meta:{slot:null,ts:0,timeline_altered:false,version:"3.0",episode:1,scene:null,beat:0},
  read:{}                // sceneId -> highest beat index read (skip support)
};}
let S=freshState();
let LOG=[];               // debug mutation log
let HISTORY=[];           // backscroll entries {name,text,cls}
let MODE={skip:false,reduced:false,busy:false,waiting:null};

function getPath(o,p){return p.split('.').reduce((a,k)=>a==null?a:a[k],o);}
function setPath(o,p,v){const ks=p.split('.');let t=o;for(let i=0;i<ks.length-1;i++){if(t[ks[i]]==null)t[ks[i]]={};t=t[ks[i]];}t[ks[ks.length-1]]=v;}
function dbg(msg){LOG.push(msg);if(DEBUG){$("debugpane").textContent="STATE\n"+JSON.stringify(S,null,1)+"\n\nLOG\n"+LOG.slice(-80).join("\n");}}

function passes(cond){
  if(!cond)return true;
  if(Array.isArray(cond))return cond.every(passes);
  const val=getPath(S,cond.k);
  switch(cond.op||'eq'){
    case 'eq':return val===cond.v; case 'ne':return val!==cond.v;
    case 'gte':return (val||0)>=cond.v; case 'lte':return (val||0)<=cond.v;
    case 'truthy':return !!val; case 'falsy':return !val;
    case 'in':return (cond.v||[]).includes(val);
    case 'incl':return Array.isArray(val)&&val.includes(cond.v);
    case 'chose':return S.choices.some(c=>c.id===cond.v&&(cond.opt==null||c.opt===cond.opt));
    default:return true;
  }
}

function applyEffects(fx,choiceMeta){
  if(!fx)return {known:[],hidden:false};
  const known=fx.known?fx.known.slice():[];let hidden=false;
  if(fx.set)for(const k in fx.set){setPath(S,k,fx.set[k]);dbg("set "+k+"="+JSON.stringify(fx.set[k]));}
  if(fx.add)for(const k in fx.add){setPath(S,k,(getPath(S,k)||0)+fx.add[k]);dbg("add "+k+" +"+fx.add[k]+" -> "+getPath(S,k));}
  if(fx.purse!=null){S.resources.purse+=fx.purse;dbg("purse "+(fx.purse>0?"+":"")+fx.purse+" -> "+S.resources.purse);}
  if(fx.bond)for(const id in fx.bond){S.bonds[id]=fx.bond[id];dbg("bond."+id+"="+fx.bond[id]);}
  if(fx.injury){const inj=fx.injury;(S.injuries[inj.who]=S.injuries[inj.who]||[]).push({tag:inj.tag,label:inj.label});dbg("injury "+inj.who+":"+inj.tag);}
  if(fx.promise){S.promises.push({id:fx.promise.id,text:fx.promise.text,status:"open"});dbg("promise+ "+fx.promise.id);}
  if(fx.resolvePromise){const p=S.promises.find(p=>p.id===fx.resolvePromise.id);if(p)p.status=fx.resolvePromise.status;}
  if(fx.exposure){S.exposure.level=fx.exposure;dbg("exposure="+fx.exposure);}
  if(fx.whisper){S.exposure.whispers.push(fx.whisper);dbg("whisper+ "+fx.whisper);}
  if(fx.unlock)fx.unlock.forEach(r=>{if(!S.routes.opened.includes(r))S.routes.opened.push(r);dbg("unlock "+r);});
  if(fx.lock)fx.lock.forEach(r=>{if(!S.routes.closed.includes(r))S.routes.closed.push(r);dbg("lock "+r);});
  if(fx.hidden&&fx.hidden.length){hidden=true;fx.hidden.forEach(h=>{S.threads.push({note:h.note,from:choiceMeta?choiceMeta.id:null,surfaced:false});if(h.fx)applyEffectsSilent(h.fx);});}
  return {known,hidden};
}
function applyEffectsSilent(fx){ // hidden sub-effects: no panel lines
  const k=fx.known;delete fx.known;applyEffects(fx);if(k)fx.known=k;
}

/* ================= SAVES ================= */
const LSKEY=n=>"oplegacy_coinlands_slot"+n;
function snapshot(){S.meta.ts=Date.now();return JSON.stringify(S);}
function saveSlot(n){try{localStorage.setItem(LSKEY(n),snapshot());}catch(e){}}
function loadSlot(n){try{const d=localStorage.getItem(LSKEY(n));if(!d)return null;return JSON.parse(d);}catch(e){return null;}}
function slotInfo(n){const d=loadSlot(n);if(!d)return null;
  return {ep:d.meta.episode,scene:d.meta.scene,ts:d.meta.ts,alt:d.meta.timeline_altered,choices:(d.choices||[]).length};}
function autosave(){saveSlot(0);}

/* ================= RENDER PRIMITIVES ================= */
let bgFlip=false;
function setBG(id,anim){
  const next=bgFlip?$("bgA"):$("bgB"),prev=bgFlip?$("bgB"):$("bgA");bgFlip=!bgFlip;
  next.style.backgroundImage=window.BACKGROUNDS.get(id);
  next.className="bg on"+(anim?" "+anim:"");prev.className="bg";
}
function setParticles(kind,count){
  const p=$("particles");p.innerHTML="";if(!kind||kind==="none"||MODE.reduced)return;
  const n=count||(kind==="rain"?70:22);
  for(let i=0;i<n;i++){const d=document.createElement("div");d.className="pt "+kind;
    d.style.left=(Math.random()*100)+"%";d.style.animationDuration=(kind==="rain"?(.7+Math.random()*.6):(6+Math.random()*9))+"s";
    d.style.animationDelay=(Math.random()*6)+"s";p.appendChild(d);}
}
function setVignette(mode){$("vignette").className="";if(mode&&mode!=="off")$("vignette").classList.add(mode);}
const ACTORS={};
function showActor(id,mood,pos){
  let a=ACTORS[id];
  if(!a){a=document.createElement("div");a.className="actor enter";a.dataset.id=id;$("cast").appendChild(a);ACTORS[id]=a;}
  a.innerHTML=window.PORTRAITS.get(id,mood||"neutral");
  a.className="actor pos-"+(pos||a.dataset.pos||"mid")+(id==="wornman"?" silhouette":"");
  a.dataset.pos=pos||a.dataset.pos||"mid";a.dataset.mood=mood||"neutral";
}
function hideActor(id){if(ACTORS[id]){ACTORS[id].remove();delete ACTORS[id];}}
function clearActors(){for(const k in ACTORS)hideActor(k);}
function focusSpeaker(id){for(const k in ACTORS){ACTORS[k].classList.toggle("dim",!!id&&k!==id);
  ACTORS[k].classList.toggle("speaking",k===id);}}
function sfxWord(word){
  if(!word)return;const el=document.createElement("div");el.className="sfx-word";el.textContent=word;
  el.style.left=(20+Math.random()*45)+"%";el.style.top=(16+Math.random()*30)+"%";
  $("sfxlayer").appendChild(el);setTimeout(()=>el.remove(),950);
}
function doFX(kind){
  if(MODE.reduced)return;
  if(kind==="shake"||kind==="shake-hard"){$("stage").classList.remove("shake","shake-hard");void $("stage").offsetWidth;$("stage").classList.add(kind);}
  if(kind==="flash"){$("flash").className="on";setTimeout(()=>$("flash").className="",500);}
  if(kind==="flash-long"){$("flash").className="on long";setTimeout(()=>$("flash").className="",1100);}
  if(kind==="speedlines"){const s=$("speedlines");s.classList.remove("on");void s.offsetWidth;s.classList.add("on");}
  if(kind==="ink"){const s=$("inksplash");s.classList.remove("on");void s.offsetWidth;s.classList.add("on");}
}
function names(id){return ({merdou:"MERDOU",ashren:"ASHREN",gups:"GUPS",marn:"AUNTIE MARN",hale:"SGT. HALE",
  priya:"PRIYA",cesto:"OLD CESTO",joro:"JORO",pinch:"PINCH",tam:"TAM",herrel:"HERREL",brakko:"BRAKKO",
  collector:"COLLECTOR",announcer:"ANNOUNCER",bruna:"BRUNA",grandmother:"GRANDMOTHER",dyegirl:"DYE-GIRL",
  wornman:"???",narrator:"",cope:"COPE",mott:"MOTT",voice:"VOICE"})[id]||id.toUpperCase();}

/* text box */
function showText(kind,who,text){
  const tb=$("textbox");tb.classList.remove("hiddenEl","captionmode");
  const np=$("nameplate");
  if(kind==="say"){np.className="";np.textContent=names(who);if(!names(who))np.className="hidden";}
  else{tb.classList.add("captionmode");np.className="hidden";}
  $("btext").innerHTML=text;
  HISTORY.push({name:kind==="say"?names(who):"",text:text,cls:kind==="say"?"":"lcap"});
}
function hideText(){$("textbox").classList.add("hiddenEl");}

/* HUD */
function hudFlash(id){const el=$(id);el.classList.remove("flash");void el.offsetWidth;el.classList.add("flash");}
function refreshHUD(prev){
  const b=S.resources.purse;
  $("hud-berry").textContent=b>0?b.toLocaleString()+"₿":(b<0?b.toLocaleString()+"₿":"broke");
  const inj=[...S.injuries.merdou,...S.injuries.ashren];
  $("hud-injury").textContent=inj.length?inj.map(i=>i.label).join(", "):"sound";
  $("hud-promise").textContent=S.promises.filter(p=>p.status==="open").length;
  const lv=S.exposure.level, pips=$("hud-exposure").children;
  const litN=lv==="none"?(S.exposure.whispers.length?1:0):(lv==="whisper"?1:3);
  for(let i=0;i<pips.length;i++)pips[i].classList.toggle("lit",i<litN);
  const scn=currentScene();$("hud-scene").textContent="EP "+S.meta.episode+(scn?" · "+scn.title:"");
  if(prev){if(prev.purse!==S.resources.purse)hudFlash("hud-berry");
    if(prev.inj!==inj.length)hudFlash("hud-injury");
    if(prev.pr!==S.promises.length)hudFlash("hud-promise");}
}
function hudSnapshot(){return {purse:S.resources.purse,inj:S.injuries.merdou.length+S.injuries.ashren.length,pr:S.promises.length};}

/* ================= FLOW ================= */
const DEBUG=/[?&]debug=1/.test(location.search);
let EP=null,SCENE=null,IDX=0;

function currentScene(){return SCENE;}
function gotoScene(sid){
  const ep=SAGA.episodes[S.meta.episode];
  let scene=ep&&ep.scenes[sid];
  if(!scene){ // maybe next episode
    for(const e in SAGA.episodes){if(SAGA.episodes[e].scenes[sid]){S.meta.episode=+e;scene=SAGA.episodes[e].scenes[sid];break;}}
  }
  if(!scene){endOfContent();return;}
  EP=SAGA.episodes[S.meta.episode];SCENE=scene;IDX=0;
  S.meta.scene=sid;S.meta.beat=0;
  if(!scene.consequence){clearActors();hideText();}
  if(scene.bg)setBG(scene.bg,scene.bgAnim);
  setParticles(scene.particles);setVignette(scene.vignette);
  if(scene.actors)scene.actors.forEach(a=>showActor(a.id,a.mood,a.pos));
  autosave();refreshHUD();
  advance();
}
function endOfContent(){
  showText("cap","", "<b>END OF CURRENT BUILD.</b> The saga continues in the next stage of construction. Your save is kept.");
  MODE.waiting="end";
}

function advance(){
  if(MODE.busy)return;
  const beats=SCENE.beats;
  while(IDX<beats.length){
    const b=beats[IDX];IDX++;S.meta.beat=IDX;
    if(b.if&&!passes(b.if))continue;
    markRead();
    if(renderBeat(b))return; // beat holds (waits for input/choice/panel)
  }
  // scene end
  if(SCENE.goto)gotoScene(SCENE.goto);else endOfContent();
}
function markRead(){const k=SCENE.id;S.read[k]=Math.max(S.read[k]||0,IDX);}
function isRead(){return (S.read[SCENE.id]||0)>=IDX;}

function renderBeat(b){
  switch(b.t){
    case "bg":setBG(b.id,b.anim);return false;
    case "pt":setParticles(b.kind,b.count);return false;
    case "vig":setVignette(b.mode);return false;
    case "show":showActor(b.who,b.mood,b.pos);return false;
    case "hide":hideActor(b.who);return false;
    case "mood":if(ACTORS[b.who])showActor(b.who,b.mood,ACTORS[b.who].dataset.pos);return false;
    case "clear":clearActors();return false;
    case "set":applyEffects(b.effects);refreshHUD();return false;
    case "fx":doFX(b.kind);sfxWord(b.sfx);return false;
    case "card":hideText();focusSpeaker(null);
      showEl("opcard",`<div class="opcard">${b.text}</div>`);HISTORY.push({name:"",text:b.text,cls:"lcap"});
      return hold();
    case "title":hideText();clearActors();
      showEl("titlecard",`<div class="titlecard${b.sting?" sting-card":""}"><div class="ep">${b.ep||""}</div><div class="rule"></div><div class="tt">${b.title}</div></div>`);
      HISTORY.push({name:"",text:(b.ep?b.ep+" — ":"")+b.title,cls:"lcap"});
      return hold();
    case "cap":clearOverlays();showText("cap","",fmt(b.text));focusSpeaker(null);return hold();
    case "say":clearOverlays();
      if(b.who!=="voice"&&b.who!=="narrator"&&window.PORTRAITS.has(b.who)){
        if(!ACTORS[b.who])showActor(b.who,b.mood,b.pos||autoPos());
        else if(b.mood)showActor(b.who,b.mood,ACTORS[b.who].dataset.pos);
        focusSpeaker(b.who);}
      showText("say",b.who,fmt(b.text));return hold();
    case "attack":clearOverlays();hideText();
      showEl("attackcard",`<div class="attackcard ${b.style||""}"><div class="aname">${b.name}</div></div>`);
      doFX(b.style==="electro"?"flash":"speedlines");sfxWord(b.sfx);
      HISTORY.push({name:"",text:"⚔ "+b.name,cls:"lcap"});
      return hold();
    case "cutin":clearOverlays();
      showEl("cutin",`<div class="cutin">${window.PORTRAITS.get(b.who,b.mood||"shock")}<div class="ctext">${fmt(b.text||"")}</div></div>`);
      HISTORY.push({name:names(b.who),text:b.text||"(reaction)",cls:""});
      return hold();
    case "choice":return doChoice(b);
    case "panel":return doPanel(b.lines,b.hidden);
    case "goto":gotoScene(b.scene);return true;
    default:return false;
  }
}
function autoPos(){const n=Object.keys(ACTORS).length;return ["midleft","midright","left","right","mid"][n%5];}
function fmt(t){return t.replace(/\*\*(.+?)\*\*/g,'<span class="shout">$1</span>').replace(/\*(.+?)\*/g,'<em>$1</em>');}
let overlayEl=null;
function showEl(kind,html){clearOverlays();const d=document.createElement("div");d.innerHTML=html;overlayEl=d.firstChild;$("stage").appendChild(overlayEl);}
function clearOverlays(){if(overlayEl){overlayEl.remove();overlayEl=null;}}
function hold(){MODE.waiting="tap";
  if(MODE.skip&&isRead()){MODE.waiting=null;setTimeout(advance,30);return true;}
  return true;}

/* choices */
function doChoice(b){
  hideText();clearOverlays();MODE.waiting="choice";
  const wrap=document.createElement("div");wrap.id="choicewrap";
  wrap.innerHTML=`<div id="choicehead">◆ ${b.prompt||"What does Merdou do?"} ◆</div>`;
  b.options.forEach(o=>{
    if(o.if&&!passes(o.if)&&!o.lockedText)return; // hidden option
    const locked=o.if&&!passes(o.if);
    const btn=document.createElement("button");btn.className="copt"+(locked?" locked":"");
    btn.innerHTML=`<span class="clabel">${o.label}</span><span class="crisk">${locked?(o.lockedText||"— unavailable —"):(o.risk||"")}</span>`;
    if(!locked)btn.onclick=()=>{pickOption(b,o,wrap,btn);};
    wrap.appendChild(btn);});
  $("stage").appendChild(wrap);overlayEl=wrap;
  return true;
}
function pickOption(b,o,wrap,btn){
  MODE.busy=true;
  [...wrap.querySelectorAll(".copt")].forEach(x=>{if(x!==btn)x.classList.add("faded");});
  btn.classList.add("picked");
  S.choices.push({id:b.id,opt:o.id,label:o.label});
  dbg("CHOICE "+b.id+" -> "+o.id);
  const prev=hudSnapshot();
  const res=applyEffects(o.effects,{id:b.id});
  o._pending={known:res.known,hidden:res.hidden};
  HISTORY.push({name:"CHOICE",text:o.label,cls:""});
  setTimeout(()=>{
    MODE.busy=false;clearOverlays();refreshHUD(prev);autosave();
    // stash panel data for the consequence scene end (played after its beats via explicit panel beat)
    PENDING_PANEL={lines:res.known,hidden:res.hidden};
    if(o.goto)gotoScene(o.goto);else advance();
  },650);
}
let PENDING_PANEL=null;
function doPanel(lines,hiddenFlag){
  const data=lines?{lines:lines,hidden:hiddenFlag}:(PENDING_PANEL||{lines:[],hidden:false});
  PENDING_PANEL=null;
  if(!data.lines.length&&!data.hidden)return false;
  hideText();MODE.waiting="panel";
  const wrap=document.createElement("div");wrap.id="changedwrap";
  let html=`<div id="changedcard"><h3>— WHAT CHANGED —</h3>`;
  data.lines.forEach(l=>{html+=`<div class="chline"><div class="cicon">${ICONS[l.icon]||"•"}</div><div><span class="cwho">${l.who||""}</span>${l.text}</div></div>`;});
  if(data.hidden)html+=`<div class="chline hiddenline"><div class="cicon">⟡</div><div>A hidden thread has changed.</div></div>`;
  html+=`<button id="changedok">CONTINUE ▸</button></div>`;
  wrap.innerHTML=html;$("stage").appendChild(wrap);overlayEl=wrap;
  $("changedok").onclick=()=>{MODE.waiting=null;clearOverlays();advance();};
  return true;
}
const ICONS={crowd:"👥",berry:"₿",injury:"✚",bond:"♦",alert:"!",secret:"⟡",route:"⇉",routeX:"⛔",
  rep:"★",promise:"✎",boat:"⚓",fire:"🔥",law:"⚖",skull:"☠"};

/* ================= INPUT ================= */
function tap(){
  if(MODE.busy)return;
  if(MODE.waiting==="tap"){MODE.waiting=null;advance();}
}
document.addEventListener("keydown",e=>{
  if($("menuwrap")&&!$("menuwrap").classList.contains("hiddenEl")){if(e.key==="Escape")closeMenu();return;}
  if(e.key===" "||e.key==="Enter"||e.key==="ArrowRight"){e.preventDefault();tap();}
  if(e.key==="Escape"){toggleMenu();}
  if(e.key.toLowerCase()==="l"){toggleLog();}
  if(e.key.toLowerCase()==="d"){toggleDrawer();}
  if(e.key.toLowerCase()==="s"){MODE.skip=!MODE.skip;$("hud-skip").textContent=MODE.skip?"SKIP✓":"SKIP";if(MODE.skip)tap();}
});

/* ================= DRAWERS / LOG / MENU ================= */
const BONDNOTES={hostile:"would spit first",wary:"keeps distance",neutral:"undecided",warm:"pours without asking",
  loyal:"would follow",strained:"words unfinished",frightened:"won't meet your eyes",impressed:"tells the story",suspicious:"watches your hands"};
function drawerHTML(tab){
  if(tab==="state"){
    let h=`<h4>THE CAMPAIGN</h4>`;
    h+=`<div class="ditem">Island mark: <span class="dstate">${S.marks.cointoss||"— undecided —"}</span></div>`;
    h+=`<div class="ditem">Purse: <span class="dstate">${S.resources.purse.toLocaleString()} berries</span>${Object.keys(S.resources.debt).map(d=>` · owes ${d.toUpperCase()}`).join("")}</div>`;
    h+=`<div class="ditem">Pit reputation: <span class="dstate">${S.reputation.pit}</span></div>`;
    h+=`<div class="ditem">Exposure: <span class="dstate">${S.exposure.level}</span>${S.exposure.whispers.length?`<div class="dnote">people talk: ${S.exposure.whispers.join("; ")}</div>`:""}</div>`;
    h+=`<h4>CHOICES MADE</h4>`+(S.choices.length?S.choices.map(c=>`<div class="ditem"><span class="dnote">${c.id}</span> — ${c.label}</div>`).join(""):`<div class="dnote">none yet</div>`);
    return h;}
  if(tab==="people"){
    let h=`<h4>PEOPLE</h4>`;
    for(const id in S.bonds){h+=`<div class="ditem"><b>${names(id)||id.toUpperCase()}</b>: <span class="dstate">${S.bonds[id]}</span><div class="dnote">${BONDNOTES[S.bonds[id]]||""}</div></div>`;}
    return h;}
  if(tab==="threads"){
    let h=`<h4>PROMISES</h4>`;
    h+=S.promises.length?S.promises.map(p=>`<div class="ditem">${p.text} — <span class="dstate">${p.status}</span></div>`).join(""):`<div class="dnote">nothing sworn yet</div>`;
    h+=`<h4>INJURIES</h4>`;
    const inj=[...S.injuries.merdou.map(i=>"Merdou: "+i.label),...S.injuries.ashren.map(i=>"Ashren: "+i.label)];
    h+=inj.length?inj.map(i=>`<div class="ditem">${i}</div>`).join(""):`<div class="dnote">standing, somehow</div>`;
    h+=`<h4>UNRESOLVED</h4>`;
    const th=S.threads.filter(t=>!t.surfaced);
    h+=th.length?th.map(()=>`<div class="ditem dnote">⟡ a thread you cannot see yet</div>`).join(""):`<div class="dnote">no loose threads… that you know of</div>`;
    return h;}
  if(tab==="routes"){
    let h=`<h4>ROADS OPENED</h4>`;
    h+=S.routes.opened.length?S.routes.opened.map(r=>`<div class="ditem opened">⇉ ${r}</div>`).join(""):`<div class="dnote">none marked</div>`;
    h+=`<h4>ROADS CLOSED</h4>`;
    h+=S.routes.closed.length?S.routes.closed.map(r=>`<div class="ditem locked">⛔ ${r}</div>`).join(""):`<div class="dnote">none closed</div>`;
    return h;}
}
let drawerTab="state";
function toggleDrawer(force){const d=$("drawer");const open=force!=null?force:!d.classList.contains("open");
  d.classList.toggle("open",open);if(open)$("drawerbody").innerHTML=drawerHTML(drawerTab);}
function toggleLog(){const l=$("logwrap");const show=l.classList.contains("hiddenEl");
  l.classList.toggle("hiddenEl",!show);
  if(show){$("logbody").innerHTML=HISTORY.slice(-160).map(h=>`<p>${h.name?`<span class="lname">${h.name}</span> `:""}<span class="${h.cls}">${h.text}</span></p>`).join("");
    $("logbody").scrollTop=$("logbody").scrollHeight;}}

function menuHTML(){
  let h=`<h2>ONE PIECE: LEGACY — THE COIN LANDS</h2>`;
  h+=`<div class="slot"><div class="sinfo"><b>Continue</b> — autosave${slotLine(0)}</div><button data-a="load" data-n="0">RESUME</button></div>`;
  for(let n=1;n<=6;n++){const inf=slotInfo(n);
    h+=`<div class="slot"><div class="sinfo"><b>Slot ${n}</b>${inf?slotLine(n):" — empty"}</div>
      <button data-a="save" data-n="${n}">SAVE</button>${inf?`<button data-a="load" data-n="${n}">LOAD</button>`:""}</div>`;}
  h+=`<label><input type="checkbox" id="rmotion" ${MODE.reduced?"checked":""}/> Reduced motion (no shake, flash, particles, pans)</label>`;
  h+=`<div style="display:flex;gap:.6em;flex-wrap:wrap;margin-top:.8em">
    <button data-a="export">EXPORT SAVE</button><button data-a="import">IMPORT SAVE</button>
    <button data-a="replay">REPLAY EPISODE</button>
    <button class="danger" data-a="new">NEW GAME</button>
    <button data-a="close">CLOSE</button></div>`;
  h+=`<div class="dnote" style="margin-top:1em">Keys: SPACE/ENTER advance · L backscroll · D drawers · S skip-read · ESC menu.
    Replaying a finished choice in this save marks the timeline as <span class="altbadge">ALTERED</span>.</div>`;
  return h;
}
function slotLine(n){const i=slotInfo(n);if(!i)return "";
  return ` — EP ${i.ep}, ${i.scene||"start"} · ${i.choices} choices · ${new Date(i.ts).toLocaleString()}${i.alt?' <span class="altbadge">ALTERED</span>':""}`;}
function toggleMenu(force){const m=$("menuwrap");const show=force!=null?force:m.classList.contains("hiddenEl");
  m.classList.toggle("hiddenEl",!show);if(show){$("menucard").innerHTML=menuHTML();wireMenu();}}
function closeMenu(){toggleMenu(false);}
function wireMenu(){
  $("menucard").querySelectorAll("button").forEach(b=>{
    b.onclick=()=>{const a=b.dataset.a,n=+b.dataset.n;
      if(a==="close")closeMenu();
      if(a==="save"){saveSlot(n);toggleMenu(true);}
      if(a==="load"){const d=loadSlot(n);if(d){restore(d);closeMenu();}}
      if(a==="new"){if(confirm("Start a NEW GAME? (Autosave slot will restart. Numbered slots are kept.)")){S=freshState();HISTORY=[];LOG=[];begin();closeMenu();}}
      if(a==="export"){prompt("Copy this save text:",snapshot());}
      if(a==="import"){const t=prompt("Paste save text:");if(t){try{restore(JSON.parse(t));closeMenu();}catch(e){alert("Not a valid save.");}}}
      if(a==="replay"){const ep=prompt("Replay which episode? (1-3; only completed episodes)");
        if(ep&&SAGA.episodes[+ep]){const d=loadSlot(0)||S;const c=JSON.parse(JSON.stringify(d));
          c.meta.timeline_altered=(c.meta.episode>+ep)||c.meta.timeline_altered;
          c.meta.episode=+ep;S=c;gotoScene(SAGA.episodes[+ep].start);closeMenu();}}
    };});
  $("rmotion").onchange=e=>{MODE.reduced=e.target.checked;document.body.classList.toggle("reduced-motion",MODE.reduced);
    try{localStorage.setItem("oplegacy_rmotion",MODE.reduced?"1":"0");}catch(_){}};
}
function restore(d){
  const revisit=d.meta&&S.meta&&d.meta.ts&&S.choices.length>((d.choices||[]).length);
  S=d;if(revisit)S.meta.timeline_altered=true;
  HISTORY=[];S.meta.episode=S.meta.episode||1;
  gotoScene(S.meta.scene||SAGA.episodes[S.meta.episode].start);
}

/* ================= BOOT ================= */
function begin(){S.meta.episode=1;gotoScene(SAGA.episodes[1].start);}
window.addEventListener("DOMContentLoaded",()=>{
  $("stage").addEventListener("click",e=>{
    if(e.target.closest("#choicewrap,#changedwrap,#drawer,#logwrap,#menuwrap,button"))return;tap();});
  $("hud-menu").onclick=()=>toggleMenu();
  $("hud-log").onclick=()=>toggleLog();
  $("hud-drawer").onclick=()=>toggleDrawer();
  $("hud-skip").onclick=()=>{MODE.skip=!MODE.skip;$("hud-skip").textContent=MODE.skip?"SKIP✓":"SKIP";if(MODE.skip)tap();};
  $("logclose").onclick=()=>toggleLog();
  $("drawerclose").onclick=()=>toggleDrawer(false);
  $("drawertabs").querySelectorAll("button").forEach(b=>b.onclick=()=>{
    drawerTab=b.dataset.tab;
    $("drawertabs").querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b));
    $("drawerbody").innerHTML=drawerHTML(drawerTab);});
  try{MODE.reduced=localStorage.getItem("oplegacy_rmotion")==="1";}catch(_){}
  document.body.classList.toggle("reduced-motion",MODE.reduced);
  if(DEBUG)$("debugpane").classList.add("on");
  const auto=loadSlot(0);
  if(auto&&auto.meta&&auto.meta.scene){restore(auto);}else{begin();}
});
})();
