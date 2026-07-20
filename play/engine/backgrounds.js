/* ONE PIECE: LEGACY — original SVG background set (source: original; see ASSET_MANIFEST).
   One coherent system: cold North Blue palette + petal accents, 16:9, 3 depth planes,
   shared grain/vignette applied by the renderer. Overridable via PRIVATE_OVERRIDES.backgrounds. */
"use strict";
(function(){
  const W=1600,H=900;
  const sky={night:['#16223a','#2a3d5e'],dusk:['#2a2438','#7a4a58'],dawn:['#31404f','#c98a6a'],
             day:['#5e7d99','#b8c9d4'],storm:['#161c26','#2e3d50'],gold:['#3b3a52','#d8a45a']};
  function svg(inner, skyKey){
    const s=sky[skyKey]||sky.night;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${s[0]}"/><stop offset="1" stop-color="${s[1]}"/></linearGradient>
<linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#2a4058"/><stop offset="1" stop-color="#16222f"/></linearGradient>
<radialGradient id="lamp"><stop offset="0" stop-color="#ffd98a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
</defs><rect width="${W}" height="${H}" fill="url(#sky)"/>${inner}</svg>`;
  }
  const uri=s=>'url("data:image/svg+xml,'+encodeURIComponent(s).replace(/'/g,'%27')+'")';
  // shared pieces
  const stars=`<g fill="#cfd8e4" opacity=".7">${[...Array(40)].map((_,i)=>`<circle cx="${(i*397)%1600}" cy="${(i*211)%330}" r="${1+(i%3)*.6}"/>`).join('')}</g>`;
  const gulls=`<g stroke="#dfe6ee" stroke-width="4" fill="none" opacity=".8">
    <path d="M300,180 q14,-14 28,0 q14,-14 28,0"/><path d="M420,140 q11,-11 22,0 q11,-11 22,0"/>
    <path d="M240,240 q10,-10 20,0 q10,-10 20,0"/></g>`;
  function mountain(color1,color2){return `
    <path d="M-50,900 L-50,560 L200,420 L420,300 L640,190 L820,120 L980,180 L1180,280 L1420,430 L1650,560 L1650,900 Z" fill="${color1}"/>
    <path d="M300,900 L300,560 L520,420 L760,290 L880,240 L1040,320 L1240,440 L1400,560 L1400,900 Z" fill="${color2}"/>`;}
  function terraces(y0,n,c){let out='';for(let i=0;i<n;i++){const y=y0+i*46;
    out+=`<path d="M${180+i*40},${y} L${1420-i*36},${y} L${1400-i*36},${y+16} L${200+i*40},${y+16} Z" fill="${c}" opacity="${.5+.05*i}"/>`;}return out;}
  function windows(seed,n,x0,x1,y0,y1,r=5){let out='<g>';for(let i=0;i<n;i++){
    const x=x0+((seed*i*librand(i))% (x1-x0)), y=y0+((seed*7+i*i*31)%(y1-y0));
    out+=`<rect x="${x}" y="${y}" width="${r}" height="${r*1.5}" fill="#ffd98a" opacity="${.5+(i%4)*.12}"/>`;}return out+'</g>';}
  function librand(i){return ((i*2654435761)%97)+1;}
  const banners=(y)=>`<g opacity=".85"><path d="M100,${y} Q800,${y+60} 1500,${y}" stroke="#4a3a44" stroke-width="3" fill="none"/>
    ${[...Array(18)].map((_,i)=>`<path d="M${140+i*76},${y+Math.sin(i)*8+((i*i)%18)} l14,0 l-7,22 z" fill="${i%3?'#c95b6e':'#d8b64a'}" opacity=".8"/>`).join('')}</g>`;

  const BG={};

  /* --- island establishing view (sea approach) --- */
  BG['island-establishing']=svg(`
    ${stars}${gulls}
    <rect y="620" width="1600" height="280" fill="url(#seaG)"/>
    ${mountain('#232f42','#1a2432')}
    ${terraces(430,4,'#2c3a50')}
    ${windows(13,60,300,1300,380,600)}
    <path d="M780,120 L830,96 L880,120 L872,168 L788,168 Z" fill="#3a4a62"/>
    <circle cx="830" cy="132" r="30" fill="url(#lamp)" opacity=".5"/>
    <g opacity=".9"><path d="M240,700 l60,0 l-8,26 l-44,0 Z" fill="#171f2b"/><path d="M270,700 L270,640 L296,690 Z" fill="#d8d2c2"/></g>
    <path d="M0,640 q400,26 800,10 q400,-16 800,6 l0,20 q-400,-18 -800,-4 q-400,14 -800,-8 Z" fill="#2c3f57" opacity=".6"/>`,'dawn');

  /* --- Gullwharf docks --- */
  BG['gullwharf']=svg(`
    ${stars}
    <rect y="560" width="1600" height="340" fill="url(#seaG)"/>
    ${mountain('#2a3a52','#1e2c40')}
    ${windows(7,40,200,1400,340,540)}
    <path d="M0,640 L1600,640 L1600,690 L0,690 Z" fill="#3a424f"/>
    ${[...Array(14)].map((_,i)=>`<rect x="${60+i*115}" y="690" width="14" height="120" fill="#28303c"/>`).join('')}
    <g><path d="M180,560 l150,0 l-16,80 l-118,0 Z" fill="#303a48"/><rect x="230" y="500" width="12" height="70" fill="#28303c"/>
    <path d="M236,500 L236,430 L300,480 Z" fill="#b8b2a2"/></g>
    <g><path d="M1160,570 l190,0 l-20,76 l-150,0 Z" fill="#20262f"/><rect x="1240" y="480" width="12" height="96" fill="#28303c"/></g>
    ${[...Array(6)].map((_,i)=>`<circle cx="${260+i*220}" cy="620" r="34" fill="url(#lamp)" opacity=".55"/><rect x="${256+i*220}" y="596" width="8" height="46" fill="#3b3a35"/><circle cx="${260+i*220}" cy="596" r="7" fill="#ffd98a"/>`).join('')}
    <path d="M0,810 q400,14 800,4 q400,-10 800,4 l0,86 l-1600,0 Z" fill="#16222f"/>
    ${banners(430)}`,'night');

  /* --- the Pit --- */
  BG['pit-night']=svg(`
    <rect width="1600" height="900" fill="#202837"/>
    <ellipse cx="800" cy="760" rx="720" ry="190" fill="#4a4231"/>
    <ellipse cx="800" cy="740" rx="640" ry="150" fill="#655c44"/>
    <ellipse cx="800" cy="735" rx="560" ry="120" fill="#7d7258"/>
    <path d="M60,560 L1540,560 L1600,900 L0,900 Z" fill="none"/>
    ${[...Array(4)].map((_,i)=>`<path d="M${120+i*40},${240-i*46} L${1480-i*40},${240-i*46} L${1480-i*36},${272-i*46} L${116+i*40},${272-i*46} Z" fill="#2a3444" opacity="${.9-.13*i}"/>`).join('')}
    <g fill="#3c4860">${[...Array(60)].map((_,i)=>`<circle cx="${140+(i*97)%1320}" cy="${188-(i%4)*46+((i*13)%14)}" r="${9+(i%3)*2}"/>`).join('')}</g>
    <rect x="80" y="330" width="1440" height="16" fill="#3a4356"/>
    ${[...Array(9)].map((_,i)=>`<rect x="${90+i*170}" y="346" width="10" height="120" fill="#2a303c"/>`).join('')}
    <circle cx="330" cy="300" r="90" fill="url(#lamp)" opacity=".8"/><circle cx="330" cy="288" r="14" fill="#ffe6a8"/>
    <circle cx="1270" cy="300" r="90" fill="url(#lamp)" opacity=".8"/><circle cx="1270" cy="288" r="14" fill="#ffe6a8"/>
    <circle cx="800" cy="240" r="120" fill="url(#lamp)" opacity=".7"/><circle cx="800" cy="228" r="16" fill="#ffe6a8"/>
    <path d="M1210,120 l260,0 l0,140 l-260,0 Z" fill="#2c3650"/><path d="M1210,120 l260,0 l0,20 l-260,0 Z" fill="#d8b64a" opacity=".4"/>
    <rect x="120" y="96" width="300" height="150" fill="#232c3c"/>
    <path d="M140,120 l120,0 M140,150 l180,0 M140,180 l150,0 M140,210 l90,0" stroke="#cfd8e4" stroke-width="10" opacity=".5"/>`,'night');

  /* --- Copper Kettle interior --- */
  BG['kettle-interior']=svg(`
    <rect width="1600" height="900" fill="#332a1c"/>
    <path d="M0,0 L1600,0 L1600,180 L0,180 Z" fill="#241c12"/>
    ${[...Array(7)].map((_,i)=>`<rect x="${i*240}" y="0" width="26" height="620" fill="#242017"/>`).join('')}
    <rect x="0" y="560" width="1600" height="340" fill="#3b2f1f"/>
    <path d="M60,180 L620,180 L620,560 L60,560 Z" fill="#413425"/>
    <rect x="90" y="220" width="200" height="130" fill="#3f2f1c"/><rect x="100" y="230" width="180" height="110" fill="#57420f" opacity=".7"/>
    <circle cx="190" cy="285" r="70" fill="url(#lamp)" opacity=".5"/>
    <rect x="360" y="210" width="220" height="300" fill="#241c12"/>
    ${[...Array(4)].map((_,i)=>`<rect x="372" y="${226+i*72}" width="196" height="14" fill="#4a3a24"/>
      ${[...Array(5)].map((_,j)=>`<rect x="${386+j*38}" y="${196+i*72}" width="16" height="30" rx="4" fill="#7d6a4a"/>`).join('')}`).join('')}
    <path d="M700,180 L1600,180 L1600,560 L700,560 Z" fill="#2b2216"/>
    <rect x="740" y="420" width="820" height="30" fill="#4a3823"/><rect x="760" y="450" width="780" height="110" fill="#3a2c1a"/>
    ${[...Array(7)].map((_,i)=>`<rect x="${790+i*112}" y="368" width="20" height="52" fill="#8a6d3f"/><ellipse cx="${800+i*112}" cy="368" rx="12" ry="5" fill="#a5854f"/>`).join('')}
    <circle cx="900" cy="260" r="80" fill="url(#lamp)" opacity=".7"/><circle cx="900" cy="252" r="12" fill="#ffcf7a"/>
    <circle cx="1300" cy="260" r="80" fill="url(#lamp)" opacity=".7"/><circle cx="1300" cy="252" r="12" fill="#ffcf7a"/>
    <rect x="640" y="560" width="90" height="340" fill="#1c1610"/>
    <ellipse cx="1120" cy="720" rx="240" ry="60" fill="#1f180f"/>
    <ellipse cx="380" cy="740" rx="210" ry="56" fill="#1f180f"/>
    <path d="M1420,200 q60,60 40,150" stroke="#8a6d3f" stroke-width="8" fill="none" opacity=".6"/>
    <circle cx="1462" cy="356" r="26" fill="#b8763a" opacity=".8"/>`,'night');

  /* --- Six Hundred Steps (night) --- */
  BG['steps-night']=svg(`
    ${stars}
    ${mountain('#243450','#1c2942')}
    <g>${[...Array(16)].map((_,i)=>{const y=880-i*52,x=430-i*13,w=740+i*10;
      return `<path d="M${x},${y} L${x+w},${y} L${x+w-26},${y-30} L${x+26},${y-30} Z" fill="${i%2?'#3a4a66':'#303e58'}"/>`;}).join('')}</g>
    ${windows(11,34,180,520,290,700)} ${windows(23,34,1080,1420,290,700)}
    ${[...Array(3)].map((_,i)=>`<circle cx="${560+i*240}" cy="${560-i*110}" r="42" fill="url(#lamp)" opacity=".6"/><rect x="${556+i*240}" y="${560-i*110}" width="8" height="90" fill="#2a2f3a"/><circle cx="${560+i*240}" cy="${556-i*110}" r="8" fill="#ffd98a"/>`).join('')}
    <path d="M60,240 l150,0 l0,190 l-150,0 Z" fill="#232c3e"/>
    <path d="M70,250 l130,0 l0,150 l-130,0 Z" fill="#39455c"/>
    <path d="M92,290 q40,-30 86,0 l0,86 l-86,0 Z" fill="#8b8f99"/>
    <path d="M120,330 q14,26 -6,44" stroke="#767b86" stroke-width="12" fill="none"/>
    ${banners(300)}`,'night');

  /* --- Petal Row / flower terraces --- */
  BG['petal-row']=svg(`
    ${gulls}
    ${mountain('#31435c','#26354a')}
    ${terraces(300,7,'#3a4d68')}
    <g>${[...Array(60)].map((_,i)=>`<circle cx="${140+(i*131)%1340}" cy="${330+(i*67)%330}" r="${5+(i%3)*2}" fill="${i%2?'#c95b6e':'#d88a97'}" opacity=".85"/>`).join('')}</g>
    <g>${[...Array(9)].map((_,i)=>`<path d="M${170+i*160},640 l54,0 l-6,90 l-42,0 Z" fill="#4a3540"/><ellipse cx="${197+i*160}" cy="640" rx="30" ry="10" fill="#6b4a58"/>`).join('')}</g>
    <path d="M0,760 L1600,760 L1600,900 L0,900 Z" fill="#2e3b4e"/>
    ${[...Array(5)].map((_,i)=>`<rect x="${120+i*310}" y="700" width="150" height="60" fill="#3f3040"/><path d="M${120+i*310},700 l150,0 l-12,-36 l-126,0 Z" fill="#553f52"/>`).join('')}
    ${banners(210)}`,'day');

  /* --- Highbasket cliff gardens --- */
  BG['highbasket']=svg(`
    ${gulls}
    <rect y="640" width="1600" height="260" fill="url(#seaG)"/>
    <path d="M0,900 L0,300 L240,260 L420,330 L560,300 L560,900 Z" fill="#2c3a50"/>
    <path d="M1600,900 L1600,240 L1380,280 L1180,330 L1180,900 Z" fill="#2c3a50"/>
    ${[...Array(6)].map((_,i)=>`<g><path d="M${600+i*90},${200+((i*53)%60)} q45,60 0,120 q-45,-60 0,-120" fill="none" stroke="#6b5a44" stroke-width="5"/>
      <path d="M${570+i*90},${300+((i*53)%60)} q30,50 60,0 l-6,44 q-24,26 -48,0 Z" fill="#4a5540"/>
      ${[...Array(5)].map((_,j)=>`<circle cx="${580+i*90+j*11}" cy="${310+((i*53)%60)+((j*17)%26)}" r="5" fill="${j%2?'#c95b6e':'#e0a0ac'}"/>`).join('')}</g>`).join('')}
    <path d="M0,300 L240,260 L420,330 L400,360 L200,300 L0,340 Z" fill="#3a4c66"/>
    ${terraces(360,3,'#3a4d68')}
    <path d="M60,340 q80,-14 150,10" stroke="#655c44" stroke-width="10" fill="none"/>`,'dusk');

  /* --- fishing district --- */
  BG['fishing-district']=svg(`
    ${gulls}
    <rect y="600" width="1600" height="300" fill="url(#seaG)"/>
    ${mountain('#243146','#1a2432')}
    <g>${[...Array(8)].map((_,i)=>`<path d="M${80+i*190},600 l120,0 l-14,-90 l-92,0 Z" fill="#2e3846"/><path d="M${66+i*190},510 l148,0 l-74,-46 Z" fill="#222c38"/>`).join('')}</g>
    ${[...Array(10)].map((_,i)=>`<path d="M${60+i*160},640 q40,${16+(i%3)*8} 80,0" stroke="#8a93a5" stroke-width="4" fill="none" opacity=".6"/>`).join('')}
    <g>${[...Array(5)].map((_,i)=>`<path d="M${200+i*280},680 l90,0 l-10,34 l-70,0 Z" fill="#1c232e"/><rect x="${240+i*280}" y="610" width="9" height="76" fill="#161c25"/>`).join('')}</g>
    <path d="M120,650 l90,0 M420,662 l70,0" stroke="#d8d2c2" stroke-width="5" opacity=".5"/>
    <ellipse cx="800" cy="850" rx="900" ry="90" fill="#16222f"/>`,'dawn');

  /* --- Marine post --- */
  BG['marine-post']=svg(`
    ${mountain('#26354a','#1d2938')}
    <path d="M480,900 L480,360 L1120,360 L1120,900 Z" fill="#3b4757"/>
    <path d="M440,360 L1160,360 L1160,330 L440,330 Z" fill="#2e4a68"/>
    <path d="M760,900 L760,560 L840,560 L840,900 Z" fill="#242f3c"/>
    <path d="M756,560 L844,560 L800,520 Z" fill="#1d2733"/>
    ${[...Array(3)].map((_,i)=>`<rect x="${540+i*160}" y="420" width="60" height="80" fill="#8fb6d9" opacity=".55"/><rect x="${540+i*160}" y="420" width="60" height="80" fill="none" stroke="#232c38" stroke-width="6"/>`).join('')}
    <rect x="770" y="240" width="10" height="96" fill="#232c38"/>
    <path d="M780,244 l70,0 l0,40 l-70,0 Z" fill="#3f6a99"/><circle cx="815" cy="264" r="12" fill="#e9e2d0"/>
    <path d="M0,900 L1600,900 L1600,830 L0,830 Z" fill="#3a424f"/>`,'day');

  /* --- propaganda streets (Gups posters) --- */
  BG['propaganda-street']=svg(`
    ${mountain('#1e2a3c','#16202e')}
    <path d="M0,900 L200,340 L440,340 L360,900 Z" fill="#242e40"/>
    <path d="M1600,900 L1400,340 L1160,340 L1240,900 Z" fill="#242e40"/>
    ${windows(17,20,220,420,380,760)} ${windows(29,20,1180,1380,380,760)}
    ${[...Array(3)].map((_,i)=>`<g transform="translate(${420+i*300},${380+(i%2)*40})">
      <rect width="200" height="260" fill="#d8d2c2"/><rect x="8" y="8" width="184" height="244" fill="#b8b2a2"/>
      <path d="M60,90 Q60,54 100,52 Q140,54 140,90 Q140,116 128,128 Q140,132 138,150 L62,150 Q60,132 72,128 Q60,116 60,90 Z" fill="#767b86"/>
      <path d="M96,120 q6,26 -4,40" stroke="#5f646e" stroke-width="10" fill="none"/>
      <rect x="30" y="180" width="140" height="16" fill="#8e2f35"/><rect x="46" y="206" width="108" height="10" fill="#5f646e"/>
    </g>`).join('')}
    <path d="M0,860 L1600,860 L1600,900 L0,900 Z" fill="#1c222c"/>
    ${banners(250)}`,'dusk');

  /* --- Crown exterior (arena gate) --- */
  BG['crown-exterior']=svg(`
    ${gulls}
    <path d="M0,900 L0,540 L1600,540 L1600,900 Z" fill="#2c3444"/>
    <path d="M100,540 Q100,240 800,220 Q1500,240 1500,540 Z" fill="#3d4658"/>
    ${[...Array(11)].map((_,i)=>`<path d="M${190+i*112},540 L${190+i*112},${400-Math.sin(i/10*Math.PI)*110} q28,-34 56,0 L${246+i*112},540 Z" fill="#232c3c"/>`).join('')}
    <path d="M690,540 L690,360 q110,-90 220,0 L910,540 Z" fill="#171e2a"/>
    <path d="M700,540 L700,368 q100,-80 200,0 L900,540 Z" fill="#0f141d"/>
    <path d="M770,260 l60,0 l-8,60 l-44,0 Z" fill="#d8b64a" opacity=".8"/>
    <rect x="60" y="600" width="180" height="240" fill="#d8d2c2" opacity=".9"/>
    <path d="M84,660 Q84,630 120,628 Q156,630 156,660 Q156,680 148,690 L92,690 Q84,680 84,660 Z" fill="#767b86"/>
    <rect x="80" y="740" width="140" height="12" fill="#8e2f35"/>
    ${banners(180)}
    <path d="M0,860 L1600,860 L1600,900 L0,900 Z" fill="#20262f"/>`,'day');

  /* --- arena tunnel --- */
  BG['arena-tunnel']=svg(`
    <rect width="1600" height="900" fill="#181d26"/>
    <path d="M0,900 L0,220 Q800,60 1600,220 L1600,900 Z" fill="#26303f"/>
    ${[...Array(6)].map((_,i)=>{const k=i/5,x=180+k*500,w=1600-2*x,y=200+k*140;
      return `<path d="M${x},900 L${x},${y} Q800,${y-120+k*80} ${x+w},${y} L${x+w},900 Z" fill="none" stroke="#2c3542" stroke-width="${14-i}"/>`;}).join('')}
    <path d="M660,900 L660,470 Q800,400 940,470 L940,900 Z" fill="#e8dcbe"/>
    <path d="M700,900 L700,500 Q800,444 900,500 L900,900 Z" fill="#f5ecd2" opacity=".9"/>
    ${[...Array(4)].map((_,i)=>`<circle cx="${330+i*90}" cy="${520-i*30}" r="26" fill="url(#lamp)" opacity=".6"/><circle cx="${330+i*90}" cy="${520-i*30}" r="5" fill="#ffd98a"/>`).join('')}
    <path d="M0,830 L1600,830 L1600,900 L0,900 Z" fill="#1c232e"/>`,'night');

  /* --- arena floor (the Colosseum) --- */
  BG['arena-floor']=svg(`
    <rect width="1600" height="900" fill="#5e7d99"/>
    ${[...Array(7)].map((_,i)=>`<path d="M0,${60+i*52} L1600,${60+i*52} L1600,${92+i*52} L0,${92+i*52} Z" fill="${i%2?'#33415a':'#2c3950'}"/>`).join('')}
    <g fill="#4a566e">${[...Array(90)].map((_,i)=>`<circle cx="${20+(i*89)%1560}" cy="${70+(i%7)*52+((i*13)%18)}" r="${7+(i%3)}"/>`).join('')}</g>
    <path d="M0,428 L1600,428 L1600,460 L0,460 Z" fill="#7d7258"/>
    <ellipse cx="800" cy="720" rx="860" ry="240" fill="#8d8266"/>
    <ellipse cx="800" cy="710" rx="800" ry="210" fill="#a29470"/>
    <g stroke="#b8763a" stroke-width="7" fill="none" opacity=".85">
      <ellipse cx="800" cy="710" rx="620" ry="150"/><ellipse cx="800" cy="710" rx="430" ry="100"/>
      <path d="M240,710 q280,-120 560,0 q280,120 560,0"/>
      <path d="M370,760 q210,-90 430,-10 M800,640 q210,-40 400,60"/></g>
    <g stroke="#8a5a2c" stroke-width="4" opacity=".7">
      <path d="M500,660 l90,40 M700,620 l40,60 M1000,640 l-30,70 M1180,700 l-80,40"/></g>
    <path d="M740,300 q60,-40 120,0 l-12,90 q-48,26 -96,0 Z" fill="#8a6d3f"/>
    <path d="M756,316 q44,-28 88,0 l-9,66 q-35,19 -70,0 Z" fill="#b8934f"/>
    <path d="M800,180 L800,300" stroke="#4a3a24" stroke-width="10"/>
    <circle cx="330" cy="240" r="80" fill="url(#lamp)" opacity=".35"/><circle cx="1270" cy="240" r="80" fill="url(#lamp)" opacity=".35"/>`,'gold');

  /* --- arena floor, wrecked variant --- */
  BG['arena-wrecked']=svg(`
    <rect width="1600" height="900" fill="#3b3a52"/>
    ${[...Array(7)].map((_,i)=>`<path d="M0,${60+i*52} L1600,${60+i*52} L1600,${92+i*52} L0,${92+i*52} Z" fill="${i%2?'#2a3348':'#242c40'}"/>`).join('')}
    <path d="M0,428 L1600,428 L1600,460 L0,460 Z" fill="#655c44"/>
    <ellipse cx="800" cy="720" rx="860" ry="240" fill="#6e6650"/>
    <ellipse cx="800" cy="710" rx="800" ry="210" fill="#7d7258"/>
    <g stroke="#b8763a" stroke-width="7" fill="none" opacity=".6">
      <ellipse cx="800" cy="710" rx="620" ry="150" stroke-dasharray="60 40"/>
      <path d="M240,710 q280,-120 560,0" stroke-dasharray="40 60"/></g>
    <path d="M480,640 L640,600 L700,660 L560,700 Z" fill="#655c44"/>
    <path d="M900,760 L1080,720 L1120,790 L950,820 Z" fill="#524a38"/>
    <path d="M700,540 l120,-30 -20,60 z" fill="#463f30"/>
    <g stroke="#ffe27a" stroke-width="4" fill="none" opacity=".8">
      <path d="M420,690 l40,-18 l-14,26 l38,-12"/><path d="M1130,660 l-34,20 l26,6 l-30,22"/></g>
    <path d="M740,300 q60,-40 120,0 l-12,90 q-48,26 -96,0 Z" fill="#8a6d3f"/>
    <path d="M800,180 L800,300" stroke="#4a3a24" stroke-width="10"/>
    <circle cx="800" cy="350" r="130" fill="url(#lamp)" opacity=".25"/>`,'storm');

  /* --- debt cells --- */
  BG['debt-cells']=svg(`
    <rect width="1600" height="900" fill="#141924"/>
    <path d="M0,900 L0,200 L1600,200 L1600,900 Z" fill="#1e2634"/>
    ${[...Array(20)].map((_,i)=>`<rect x="${80+i*78}" y="220" width="12" height="560" fill="#303a48"/>`).join('')}
    <rect x="0" y="200" width="1600" height="26" fill="#2a303c"/><rect x="0" y="770" width="1600" height="20" fill="#2a303c"/>
    <circle cx="1200" cy="160" r="60" fill="url(#lamp)" opacity=".4"/><circle cx="1200" cy="150" r="8" fill="#ffd98a"/>
    <path d="M240,790 l130,0 l0,60 l-130,0 Z" fill="#1a212c"/>
    <path d="M1050,340 l150,0 l0,190 l-150,0 Z" fill="#d8d2c2" opacity=".85"/>
    <path d="M1070,370 l110,0 M1070,400 l110,0 M1070,430 l80,0 M1070,460 l110,0 M1070,490 l60,0" stroke="#5f646e" stroke-width="7"/>
    <path d="M420,520 q10,-40 40,-40 q30,0 40,40" stroke="#3f4856" stroke-width="8" fill="none"/>
    <path d="M0,860 L1600,860 L1600,900 L0,900 Z" fill="#161c26"/>`,'night');

  /* --- dawn harbor (departure) --- */
  BG['dawn-harbor']=svg(`
    ${gulls}
    <circle cx="1180" cy="240" r="110" fill="#e8b27a" opacity=".9"/><circle cx="1180" cy="240" r="180" fill="url(#lamp)" opacity=".5"/>
    <rect y="560" width="1600" height="340" fill="url(#seaG)"/>
    <path d="M0,560 L1600,560 L1600,590 L0,590 Z" fill="#c98a6a" opacity=".3"/>
    ${mountain('#33415a','#26354a')}
    ${windows(19,26,260,1200,340,520)}
    <path d="M0,640 L900,640 L900,690 L0,690 Z" fill="#3a424f"/>
    ${[...Array(8)].map((_,i)=>`<rect x="${60+i*112}" y="690" width="13" height="120" fill="#28303c"/>`).join('')}
    <g><path d="M950,600 l230,0 l-24,80 l-182,0 Z" fill="#3b332a"/>
    <rect x="1052" y="470" width="13" height="132" fill="#2a241d"/>
    <path d="M1060,470 L1060,380 L1160,450 Z" fill="#d8d2c2"/>
    ${[...Array(5)].map((_,i)=>`<rect x="${974+i*40}" y="612" width="26" height="10" rx="4" fill="#655c44"/>`).join('')}</g>
    <path d="M0,850 q800,26 1600,0 l0,50 l-1600,0 Z" fill="#16222f"/>`,'dawn');

  /* --- open sea --- */
  BG['open-sea']=svg(`
    ${gulls}
    <rect y="480" width="1600" height="420" fill="url(#seaG)"/>
    ${[...Array(7)].map((_,i)=>`<path d="M0,${520+i*54} q200,${18+(i%3)*8} 400,0 q200,-${18+(i%3)*8} 400,0 q200,${18+(i%3)*8} 400,0 q200,-${18+(i%3)*8} 400,0" stroke="#3a4f68" stroke-width="5" fill="none" opacity="${.7-.08*i}"/>`).join('')}
    <path d="M1290,470 L1560,470 L1520,430 L1330,430 Z" fill="#232f42" opacity=".8"/>
    <circle cx="380" cy="200" r="90" fill="#dfe6ee" opacity=".25"/><circle cx="470" cy="230" r="60" fill="#dfe6ee" opacity=".2"/>`,'day');

  /* --- Groomed deck (sting) --- */
  BG['groomed-deck']=svg(`
    ${gulls}
    <rect y="430" width="1600" height="470" fill="url(#seaG)"/>
    <path d="M0,900 L0,620 Q800,540 1600,620 L1600,900 Z" fill="#57422e"/>
    <path d="M0,660 Q800,585 1600,660" stroke="#3b2d1e" stroke-width="9" fill="none"/>
    <path d="M0,730 Q800,660 1600,730" stroke="#3b2d1e" stroke-width="9" fill="none"/>
    <rect x="1120" y="80" width="22" height="560" fill="#3b2d1e"/>
    <path d="M1142,120 L1470,200 L1142,320 Z" fill="#cfc4a8"/>
    <path d="M1142,340 L1400,400 L1142,480 Z" fill="#bfb49a"/>
    <rect x="330" y="90" width="18" height="500" fill="#3b2d1e"/>
    <path d="M330,130 L80,210 L330,320 Z" fill="#cfc4a8"/>
    <path d="M640,560 l220,0 l0,90 l-220,0 Z" fill="#46372a"/><rect x="660" y="580" width="60" height="40" fill="#8fb6d9" opacity=".4"/>
    ${[...Array(4)].map((_,i)=>`<circle cx="${480+i*160}" cy="640" r="20" fill="url(#lamp)" opacity=".7"/><circle cx="${480+i*160}" cy="640" r="6" fill="#ffd98a"/>`).join('')}`,'dawn');

  /* --- Crown receiving hall (Gups's) --- */
  BG['crown-hall']=svg(`
    <rect width="1600" height="900" fill="#242433"/>
    <path d="M0,900 L0,160 Q800,40 1600,160 L1600,900 Z" fill="#33313f"/>
    ${[...Array(5)].map((_,i)=>{const x=140+i*310;
      return `<path d="M${x},760 L${x},330 q75,-90 150,0 L${x+150},760 Z" fill="#262532"/>
      <path d="M${x+16},760 L${x+16},345 q59,-72 118,0 L${x+134},760 Z" fill="#8fa6c2" opacity=".28"/>
      <path d="M${x+75},345 L${x+75},760 M${x+16},520 L${x+134},520" stroke="#262532" stroke-width="9"/>`;}).join('')}
    ${[...Array(6)].map((_,i)=>`<rect x="${60+i*292}" y="200" width="30" height="560" fill="#3d3a4a"/><rect x="${54+i*292}" y="180" width="42" height="26" fill="#494559"/><rect x="${54+i*292}" y="754" width="42" height="26" fill="#494559"/>`).join('')}
    <path d="M0,760 L1600,760 L1600,900 L0,900 Z" fill="#2c2a38"/>
    ${[...Array(9)].map((_,i)=>`<path d="M${-40+i*200},900 L${60+i*200},760 l40,0 L${0+i*200},900 Z" fill="#242230" opacity=".7"/>`).join('')}
    <path d="M540,820 L1060,820 L1030,760 L570,760 Z" fill="#4a3a2c"/>
    <path d="M560,760 L1040,760 L1040,748 L560,748 Z" fill="#5c4936"/>
    <path d="M700,748 q10,-26 34,-26 q22,0 30,26 Z" fill="#d8d2c2"/>
    <circle cx="880" cy="726" r="17" fill="#d8d2c2"/><path d="M880,743 l0,5" stroke="#d8d2c2" stroke-width="5"/>
    <path d="M660,300 l280,0 l-16,120 l-248,0 Z" fill="#8e2f35"/>
    <path d="M700,330 q100,-46 200,0 l-14,58 q-86,-30 -172,0 Z" fill="#d8b64a" opacity=".85"/>
    <circle cx="800" cy="560" r="120" fill="url(#lamp)" opacity=".35"/>
    <circle cx="300" cy="480" r="60" fill="url(#lamp)" opacity=".3"/><circle cx="1300" cy="480" r="60" fill="url(#lamp)" opacity=".3"/>
    <rect x="1180" y="560" width="260" height="200" fill="#3d3a4a"/>
    ${[...Array(4)].map((_,i)=>`<rect x="${1194+i*62}" y="580" width="48" height="160" fill="#57422e"/><rect x="${1194+i*62}" y="580" width="48" height="12" fill="#d8b64a" opacity=".5"/>`).join('')}`,'night');

  /* --- Priya's counting-house --- */
  BG['counting-house']=svg(`
    <rect width="1600" height="900" fill="#26221e"/>
    <path d="M0,900 L0,180 L1600,180 L1600,900 Z" fill="#332d26"/>
    <path d="M0,180 L1600,180 L1600,210 L0,210 Z" fill="#2a251f"/>
    ${[...Array(2)].map((_,s)=>{const x0=s?1120:80;
      return [...Array(4)].map((_,r)=>`<rect x="${x0}" y="${240+r*130}" width="400" height="14" fill="#211c17"/>
      ${[...Array(11)].map((_,i)=>`<rect x="${x0+8+i*36}" y="${254+r*130}" width="26" height="100" fill="${['#57422e','#4a3a2c','#5c3a34','#3f3a2c'][(i+r+s)%4]}"/><rect x="${x0+8+i*36}" y="${254+r*130}" width="26" height="10" fill="#d8d2c2" opacity=".25"/>`).join('')}`).join('');}).join('')}
    <path d="M560,900 L560,470 L1040,470 L1040,900 Z" fill="#3f362c"/>
    <path d="M560,470 L1040,470 L1020,440 L580,440 Z" fill="#4a4034"/>
    <rect x="600" y="500" width="400" height="16" fill="#332b22"/>
    <path d="M640,440 l0,-90 M960,440 l0,-90" stroke="#211c17" stroke-width="8"/>
    <path d="M600,350 l400,0 l0,-14 l-400,0 Z" fill="#211c17"/>
    <path d="M760,336 q40,-40 80,0 l-8,0 q-32,-30 -64,0 Z" fill="#8a7440"/>
    <path d="M800,296 l0,40 M770,316 l60,0" stroke="#8a7440" stroke-width="5"/>
    <circle cx="770" cy="330" r="10" fill="#d8b64a"/><circle cx="830" cy="322" r="10" fill="#d8b64a"/>
    ${[...Array(5)].map((_,i)=>`<rect x="${620+i*76}" y="${486-((i*7)%3)*8}" width="34" height="${14+((i*11)%3)*8}" fill="#d8b64a" opacity=".75"/>`).join('')}
    <rect x="700" y="560" width="200" height="120" fill="#2c261f"/>
    <path d="M710,570 l180,0 M710,600 l180,0 M710,630 l140,0 M710,660 l180,0" stroke="#161310" stroke-width="6"/>
    <circle cx="800" cy="260" r="90" fill="url(#lamp)" opacity=".5"/><circle cx="800" cy="252" r="10" fill="#ffd98a"/>
    <rect x="240" y="700" width="180" height="200" fill="#2a251f"/>
    <path d="M240,700 l180,0 l0,14 l-180,0 Z" fill="#211c17"/>
    <circle cx="330" cy="790" r="34" fill="url(#lamp)" opacity=".35"/>`,'dusk');

  /* --- storm harbor --- */
  BG['storm-harbor']=svg(`
    <rect width="1600" height="900" fill="#161c26"/>
    ${mountain('#20293a','#182130')}
    <rect y="560" width="1600" height="340" fill="#1a2a3a"/>
    ${[...Array(6)].map((_,i)=>`<path d="M0,${580+i*50} q160,${30+(i%2)*16} 320,0 q160,-${30+(i%2)*16} 320,0 q160,${30+(i%2)*16} 320,0 q160,-${30+(i%2)*16} 320,0 q160,${30+(i%2)*16} 320,0" stroke="#2c445c" stroke-width="7" fill="none" opacity="${.8-.09*i}"/>`).join('')}
    <path d="M0,640 L760,640 L760,688 L0,688 Z" fill="#20242c"/>
    ${[...Array(6)].map((_,i)=>`<rect x="${50+i*120}" y="688" width="13" height="120" fill="#151a21"/>`).join('')}
    <path d="M920,300 l60,-90 -35,86 40,-20 -70,120 30,-80 z" fill="#ffe27a" opacity=".9"/>
    ${[...Array(4)].map((_,i)=>`<circle cx="${180+i*180}" cy="620" r="28" fill="url(#lamp)" opacity=".5"/><circle cx="${180+i*180}" cy="616" r="6" fill="#ffd98a"/>`).join('')}
    <path d="M320,560 q60,-46 120,0" stroke="#8a93a5" stroke-width="5" fill="none"/>`,'storm');

  window.BACKGROUNDS = {
    get(id){
      const ov=(window.PRIVATE_OVERRIDES && window.PRIVATE_OVERRIDES.backgrounds)||{};
      if(ov[id]) return 'url("'+ov[id]+'")';
      return BG[id]?uri(BG[id]):uri(BG['gullwharf']);
    },
    list(){return Object.keys(BG);}
  };
})();
