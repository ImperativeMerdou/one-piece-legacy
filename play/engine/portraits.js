/* ONE PIECE: LEGACY — original SVG portrait/silhouette system.
   All art original (asset manifest: source "original"). Stylized ink-bust style:
   flat shapes, per-character silhouette + accent, parameterized expressions.
   Replaceable via assets/private-overrides/overrides.js (window.PRIVATE_OVERRIDES). */
"use strict";
(function(){
  const NS='http://www.w3.org/2000/svg';
  // palette
  const INK='#151a22', SKIN='#d8b18f', SKIN2='#c69c7b', PAPER='#e9e2d0';

  // Expression feature sets: brows + eyes + mouth per mood.
  // Each face fn receives (cx, eyeY, mouthY, s=scale) and returns SVG string.
  const FACES = {
    neutral:(x,ey,my)=>`<path d="M${x-26},${ey-14} q10,-6 20,-2" class="brow"/><path d="M${x+6},${ey-16} q10,-4 20,2" class="brow"/>
      <ellipse cx="${x-15}" cy="${ey}" rx="4.5" ry="5.5" fill="#151a22"/><ellipse cx="${x+17}" cy="${ey}" rx="4.5" ry="5.5" fill="#151a22"/>
      <path d="M${x-10},${my} q11,4 22,0" class="mouth"/>`,
    talk:(x,ey,my)=>`<path d="M${x-26},${ey-14} q10,-6 20,-2" class="brow"/><path d="M${x+6},${ey-16} q10,-4 20,2" class="brow"/>
      <ellipse cx="${x-15}" cy="${ey}" rx="4.5" ry="5.5" fill="#151a22"/><ellipse cx="${x+17}" cy="${ey}" rx="4.5" ry="5.5" fill="#151a22"/>
      <ellipse cx="${x+1}" cy="${my+2}" rx="9" ry="7" fill="#151a22"/>`,
    shout:(x,ey,my)=>`<path d="M${x-28},${ey-18} l24,8" class="brow thick"/><path d="M${x+30},${ey-18} l-24,8" class="brow thick"/>
      <ellipse cx="${x-15}" cy="${ey}" rx="5" ry="6" fill="#151a22"/><ellipse cx="${x+17}" cy="${ey}" rx="5" ry="6" fill="#151a22"/>
      <path d="M${x-13},${my-4} q14,20 28,0 q-14,10 -28,0 z" fill="#151a22"/>`,
    angry:(x,ey,my)=>`<path d="M${x-30},${ey-20} l26,10" class="brow thick"/><path d="M${x+32},${ey-20} l-26,10" class="brow thick"/>
      <path d="M${x-20},${ey} l10,2" stroke="#151a22" stroke-width="4"/><path d="M${x+12},${ey+2} l10,-2" stroke="#151a22" stroke-width="4"/>
      <path d="M${x-11},${my+3} q12,-7 24,0" class="mouth thick"/>`,
    grin:(x,ey,my)=>`<path d="M${x-26},${ey-16} q10,-7 20,-3" class="brow"/><path d="M${x+6},${ey-19} q10,-4 20,3" class="brow"/>
      <path d="M${x-19},${ey} q4,-6 9,0" class="mouth"/><path d="M${x+12},${ey} q4,-6 9,0" class="mouth"/>
      <path d="M${x-14},${my-3} q15,14 30,0 l-2,3 q-13,10 -26,0 z" fill="#151a22"/>`,
    shock:(x,ey,my)=>`<path d="M${x-26},${ey-20} q10,-8 20,-4" class="brow"/><path d="M${x+6},${ey-23} q10,-5 20,4" class="brow"/>
      <circle cx="${x-15}" cy="${ey}" r="7" fill="none" stroke="#151a22" stroke-width="3"/><circle cx="${x-15}" cy="${ey}" r="2.4" fill="#151a22"/>
      <circle cx="${x+17}" cy="${ey}" r="7" fill="none" stroke="#151a22" stroke-width="3"/><circle cx="${x+17}" cy="${ey}" r="2.4" fill="#151a22"/>
      <ellipse cx="${x+1}" cy="${my+3}" rx="6" ry="8" fill="#151a22"/>`,
    hurt:(x,ey,my)=>`<path d="M${x-28},${ey-14} l22,4" class="brow"/><path d="M${x+30},${ey-14} l-22,4" class="brow"/>
      <path d="M${x-20},${ey-3} l11,5 M${x-20},${ey+4} l11,-3" stroke="#151a22" stroke-width="3.4"/>
      <path d="M${x+11},${ey+2} l11,-5 M${x+12},${ey+1} l11,4" stroke="#151a22" stroke-width="3.4"/>
      <path d="M${x-9},${my+2} q10,-5 20,1" class="mouth"/>`,
    serious:(x,ey,my)=>`<path d="M${x-28},${ey-15} l24,3" class="brow thick"/><path d="M${x+30},${ey-15} l-24,3" class="brow thick"/>
      <path d="M${x-20},${ey} q6,3 11,0" stroke="#151a22" stroke-width="4" fill="none"/><path d="M${x+11},${ey} q6,3 11,0" stroke="#151a22" stroke-width="4" fill="none"/>
      <path d="M${x-9},${my+1} l20,0" class="mouth"/>`,
    smug:(x,ey,my)=>`<path d="M${x-26},${ey-15} q10,-5 20,-1" class="brow"/><path d="M${x+8},${ey-18} q10,-3 18,4" class="brow"/>
      <path d="M${x-20},${ey} q6,4 11,0" stroke="#151a22" stroke-width="4" fill="none"/><path d="M${x+11},${ey} q6,4 11,0" stroke="#151a22" stroke-width="4" fill="none"/>
      <path d="M${x-8},${my} q14,7 24,-4" class="mouth"/>`
  };

  const STYLE=`<style>.brow{fill:none;stroke:#151a22;stroke-width:4;stroke-linecap:round}
    .brow.thick{stroke-width:6}.mouth{fill:none;stroke:#151a22;stroke-width:3.6;stroke-linecap:round}
    .mouth.thick{stroke-width:5}</style>`;

  function wrap(inner, w=260, h=520){
    return `<svg xmlns="${NS}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax meet">${STYLE}${inner}</svg>`;
  }

  /* ============ MAIN CAST ============ */

  // MERDOU — huge bald bust, heavy jaw, chest scar, open crimson shirt, neck kanji, horned belt implied off-frame.
  function merdou(mood){
    const f=FACES[mood]||FACES.neutral;
    return wrap(`
    <path d="M20,520 L20,400 Q22,330 70,305 L100,290 L160,290 L190,305 Q238,330 240,400 L240,520 Z" fill="#8e2f35"/>
    <path d="M78,520 L78,392 Q80,350 110,332 L150,332 Q180,350 182,392 L182,520 Z" fill="${SKIN}"/>
    <path d="M84,430 q22,-30 44,-58 M96,470 q30,-36 52,-70" stroke="#7a5b45" stroke-width="3" fill="none" opacity=".6"/>
    <path d="M92,368 L172,452" stroke="#a05a4a" stroke-width="7" stroke-linecap="round" opacity=".85"/>
    <path d="M20,520 L20,400 Q22,330 70,305 L96,294 Q80,360 84,520 Z" fill="#7d262c"/>
    <path d="M240,520 L240,400 Q238,330 190,305 L164,294 Q180,360 176,520 Z" fill="#7d262c"/>
    <text x="130" y="326" font-family="serif" font-size="19" fill="#6b4636" opacity=".8" text-anchor="middle" transform="rotate(6 130 326)">遺産</text>
    <g>
      <path d="M62,180 Q62,84 130,80 Q198,84 198,180 Q198,236 178,266 Q158,292 130,292 Q102,292 82,266 Q62,236 62,180 Z" fill="${SKIN}"/>
      <path d="M62,180 Q62,84 130,80 Q160,82 178,102 Q140,92 106,104 Q70,120 66,180 Z" fill="${SKIN2}" opacity=".7"/>
      <path d="M70,150 Q100,136 126,148" stroke="${SKIN2}" stroke-width="3" fill="none" opacity=".8"/>
      <path d="M134,148 Q160,136 190,150" stroke="${SKIN2}" stroke-width="3" fill="none" opacity=".8"/>
      <path d="M58,208 q-8,-6 -6,-18 M202,208 q8,-6 6,-18" stroke="${SKIN2}" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="M118,206 q12,8 24,0" stroke="${SKIN2}" stroke-width="4" fill="none"/>
      ${f(130,178,244)}
      <path d="M96,258 q34,18 68,0 l-4,10 q-30,14 -60,0 z" fill="#5a4433" opacity=".5"/>
    </g>`);
  }

  // ASHREN — lean, high-collared dark coat, sharp swept hair, thin face; wing ridge hinted at shoulder.
  function ashren(mood){
    const f=FACES[mood]||FACES.neutral;
    return wrap(`
    <path d="M34,520 L34,410 Q36,340 86,318 L110,306 L150,306 L176,318 Q226,340 228,410 L228,520 Z" fill="#232a36"/>
    <path d="M196,338 q34,10 30,58 q-2,26 -18,40 l-8,-8 q12,-16 10,-34 q-2,-30 -22,-44 z" fill="#1a2029"/>
    <path d="M88,322 L100,282 L160,282 L172,322 L150,340 L110,340 Z" fill="#2c3542"/>
    <path d="M88,322 L100,282 L112,286 L104,330 Z M172,322 L160,282 L148,286 L156,330 Z" fill="#38424f"/>
    <path d="M104,520 L104,406 Q106,368 130,360 Q154,368 156,406 L156,520 Z" fill="#1a2029"/>
    <g>
      <path d="M76,190 Q76,104 130,100 Q184,104 184,190 Q184,240 168,264 Q152,286 130,286 Q108,286 92,264 Q76,240 76,190 Z" fill="${SKIN}"/>
      <path d="M70,160 Q74,96 130,92 Q186,96 190,160 L196,140 Q196,86 130,80 Q64,86 64,140 Z" fill="#1c222c"/>
      <path d="M64,140 Q66,110 92,96 L118,88 L96,132 L80,168 Z" fill="#1c222c"/>
      <path d="M196,140 Q194,108 168,94 L182,140 L188,170 Z" fill="#1c222c"/>
      <path d="M118,88 L154,84 L140,120 L124,124 Z" fill="#242c38"/>
      ${f(130,186,246)}
    </g>`);
  }

  // GUPS — elephant Mink: gray head, great ears, trunk, tiny spectacles, immaculate coat + silk cravat.
  function gups(mood){
    // custom face handling: spectacles + trunk override mouth
    const browAngry = (mood==='angry'||mood==='shout') ?
      `<path d="M96,128 l30,12 M224,128 l-30,12" stroke="#151a22" stroke-width="7" stroke-linecap="round"/>` :
      (mood==='shock' ? `<path d="M98,120 q16,-10 30,-4 M222,120 q-16,-10 -30,-4" stroke="#151a22" stroke-width="6" fill="none" stroke-linecap="round"/>`
      : `<path d="M98,126 q16,-8 30,-2 M222,126 q-16,-8 -30,-2" stroke="#151a22" stroke-width="6" fill="none" stroke-linecap="round"/>`);
    const eyes = (mood==='shock') ?
      `<circle cx="118" cy="150" r="7" fill="none" stroke="#151a22" stroke-width="3"/><circle cx="202" cy="150" r="7" fill="none" stroke="#151a22" stroke-width="3"/>` :
      `<circle cx="118" cy="150" r="4.4" fill="#151a22"/><circle cx="202" cy="150" r="4.4" fill="#151a22"/>`;
    const trunkPath = (mood==='angry'||mood==='shout') ?
      `M160,168 q-6,44 -34,64 q-20,14 -44,10` : `M160,168 q4,52 -12,84 q-10,20 -30,26`;
    return wrap(`
    <path d="M10,560 L10,432 Q14,352 84,330 L120,318 L240,318 L276,330 Q346,352 350,432 L350,560 Z" fill="#3a3f4a"/>
    <path d="M120,318 L240,318 L232,352 L128,352 Z" fill="#e6e0d2"/>
    <path d="M156,352 q24,20 48,0 l-6,34 q-18,12 -36,0 z" fill="#b03a4a"/>
    <circle cx="180" cy="368" r="6" fill="#d8b64a"/>
    <path d="M30,470 l70,0 M260,470 l70,0" stroke="#2e323c" stroke-width="10"/>
    <g>
      <path d="M52,120 Q30,96 34,64 Q60,74 76,98 Z" fill="#8b8f99"/>
      <path d="M268,120 Q290,96 286,64 Q260,74 244,98 Z" fill="#8b8f99"/>
      <path d="M46,168 Q30,120 62,86 Q64,120 84,140 Z" fill="#767b86"/>
      <path d="M274,168 Q290,120 258,86 Q256,120 236,140 Z" fill="#767b86"/>
      <path d="M74,168 Q74,84 160,80 Q246,84 246,168 Q246,208 232,232 Q210,262 160,262 Q110,262 88,232 Q74,208 74,168 Z" fill="#9aa0ab"/>
      <path d="M74,168 Q74,84 160,80 Q200,82 222,104 Q170,94 122,108 Q84,124 78,168 Z" fill="#8b8f99"/>
      <path d="M112,206 q-18,10 -20,30 M208,206 q18,10 20,30" stroke="#f0ead8" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="${trunkPath}" stroke="#9aa0ab" stroke-width="34" stroke-linecap="round" fill="none"/>
      <path d="${trunkPath}" stroke="#8b8f99" stroke-width="34" stroke-linecap="round" fill="none" stroke-dasharray="6 14" opacity=".5"/>
      ${browAngry}${eyes}
      <circle cx="118" cy="150" r="13" fill="none" stroke="#d8b64a" stroke-width="3"/>
      <circle cx="202" cy="150" r="13" fill="none" stroke="#d8b64a" stroke-width="3"/>
      <path d="M131,150 L189,150" stroke="#d8b64a" stroke-width="3"/>
    </g>`, 360, 560);
  }

  /* ============ MINOR CAST (single-mood busts with talk variant via mood param) ============ */

  function marn(mood){const f=FACES[mood==='talk'?'talk':(mood==='angry'?'angry':(mood==='serious'?'serious':'neutral'))];
    return wrap(`
    <path d="M34,520 L34,414 Q38,352 92,332 L120,322 L140,322 L168,332 Q222,352 226,414 L226,520 Z" fill="#5a5347"/>
    <path d="M60,380 q70,26 140,0 l0,14 q-70,24 -140,0 z" fill="#8e7f68"/>
    <path d="M96,326 L164,326 L156,360 L104,360 Z" fill="#cfc7b4"/>
    <g><path d="M84,190 Q84,116 130,112 Q176,116 176,190 Q176,232 162,254 Q148,274 130,274 Q112,274 98,254 Q84,232 84,190 Z" fill="${SKIN}"/>
    <path d="M80,168 Q78,108 130,102 Q182,108 180,168 Q186,150 184,128 Q178,92 130,88 Q82,92 76,128 Q74,150 80,168 Z" fill="#b8b2a4"/>
    <circle cx="130" cy="86" r="22" fill="#b8b2a4"/>
    ${f(130,182,238)}
    <path d="M92,206 q-6,10 -2,20 M168,206 q6,10 2,20" stroke="${SKIN2}" stroke-width="3" fill="none"/></g>`);}

  function hale(mood){const f=FACES[mood==='talk'?'talk':(mood==='serious'?'serious':(mood==='shock'?'shock':(mood==='hurt'?'hurt':'neutral')))];
    return wrap(`
    <path d="M40,520 L40,410 Q44,348 96,330 L126,320 L134,320 L164,330 Q216,348 220,410 L220,520 Z" fill="#f0ead8"/>
    <path d="M40,440 L220,440 L220,452 L40,452 Z" fill="#2e4a68"/>
    <path d="M96,330 L126,320 L134,320 L164,330 L150,352 L110,352 Z" fill="#2e4a68"/>
    <g><path d="M86,188 Q86,116 130,112 Q174,116 174,188 Q174,228 161,250 Q148,270 130,270 Q112,270 99,250 Q86,228 86,188 Z" fill="${SKIN}"/>
    <path d="M76,132 L184,132 L190,112 Q188,96 172,96 L88,96 Q72,96 70,112 Z" fill="#f0ead8"/>
    <path d="M70,112 L190,112 L184,132 L76,132 Z" fill="#2e4a68"/>
    <circle cx="130" cy="104" r="7" fill="#d8b64a"/>
    ${f(130,180,234)}</g>`);}

  function priya(mood){const f=FACES[mood==='talk'?'talk':(mood==='smug'?'smug':'neutral')];
    return wrap(`
    <path d="M44,520 L44,414 Q48,354 98,336 L126,326 L134,326 L162,336 Q212,354 216,414 L216,520 Z" fill="#3c3348"/>
    <path d="M44,470 l172,0" stroke="#d8b64a" stroke-width="3"/>
    <g><path d="M86,186 Q86,116 130,112 Q174,116 174,186 Q174,226 161,248 Q148,268 130,268 Q112,268 99,248 Q86,226 86,186 Z" fill="${SKIN}"/>
    <path d="M80,150 Q80,100 130,96 Q180,100 180,150 L184,210 Q188,150 184,120 Q176,88 130,84 Q84,88 76,120 Q72,150 76,210 Z" fill="#1e1a26"/>
    ${f(130,178,234)}
    <circle cx="113" cy="178" r="11" fill="none" stroke="#d8b64a" stroke-width="2.4"/>
    <path d="M124,178 L136,178" stroke="#d8b64a" stroke-width="2.4"/>
    <circle cx="147" cy="178" r="11" fill="none" stroke="#8a93a5" stroke-width="2.4"/></g>`);}

  function cesto(mood){const f=FACES[mood==='talk'?'talk':(mood==='serious'?'serious':(mood==='hurt'?'hurt':'grin'))];
    return wrap(`
    <path d="M36,520 L36,412 Q40,350 94,332 L124,322 L136,322 L166,332 Q220,350 224,412 L224,520 Z" fill="#9c9484"/>
    <path d="M36,520 L36,430 Q80,440 130,440 Q180,440 224,430 L224,520 Z" fill="#e6e0d2"/>
    <path d="M60,380 q30,20 70,16 M200,380 q-20,14 -46,16" stroke="#e6e0d2" stroke-width="6" opacity=".7" fill="none"/>
    <g><path d="M82,190 Q82,118 130,114 Q178,118 178,190 Q178,230 164,252 Q150,272 130,272 Q110,272 96,252 Q82,230 82,190 Z" fill="${SKIN2}"/>
    <path d="M92,132 Q110,120 130,122 Q150,120 168,132 L172,116 Q150,104 130,106 Q110,104 88,116 Z" fill="#d8d2c2"/>
    <path d="M100,244 q30,16 60,0 l0,10 q-30,14 -60,0 z" fill="#d8d2c2"/>
    ${f(130,184,240)}
    <path d="M96,158 l10,-6 M164,158 l-10,-6" stroke="#a8a294" stroke-width="5"/></g>`);}

  function joro(mood){const f=FACES[mood==='talk'?'talk':(mood==='shock'?'shock':(mood==='hurt'?'hurt':'neutral'))];
    return wrap(`
    <path d="M46,520 L46,416 Q50,356 100,338 L126,328 L134,328 L160,338 Q210,356 214,416 L214,520 Z" fill="#4a5a52"/>
    <path d="M46,520 L46,468 Q130,480 214,468 L214,520 Z" fill="#3a473f"/>
    <g><path d="M88,190 Q88,120 130,116 Q172,120 172,190 Q172,228 159,249 Q146,268 130,268 Q114,268 101,249 Q88,228 88,190 Z" fill="${SKIN}"/>
    <path d="M82,138 Q84,104 130,100 Q176,104 178,138 L182,126 Q178,94 130,90 Q82,94 78,126 Z" fill="#3b332a"/>
    <path d="M78,126 L182,126 L178,140 L82,140 Z" fill="#54493c"/>
    ${f(130,182,236)}</g>`);}

  function pinch(mood){const f=FACES[mood==='talk'?'talk':(mood==='grin'?'grin':(mood==='shock'?'shock':'grin'))];
    return wrap(`
    <path d="M70,520 L70,440 Q72,398 106,386 L122,380 L138,380 L154,386 Q188,398 190,440 L190,520 Z" fill="#6b5a44"/>
    <path d="M70,520 L70,470 Q130,478 190,470 L190,520 Z" fill="#57493a"/>
    <g><path d="M96,268 Q96,212 130,208 Q164,212 164,268 Q164,300 154,316 Q144,332 130,332 Q116,332 106,316 Q96,300 96,268 Z" fill="${SKIN}"/>
    <path d="M92,236 Q94,206 130,202 Q166,206 168,236 L172,224 Q168,196 130,192 Q92,196 88,224 Z" fill="#8a6a3c"/>
    <path d="M88,224 l84,0 l-4,14 l-76,0 Z" fill="#a5854f"/>
    ${(FACES[mood==='talk'?'talk':'grin'])(130,262,306)}</g>`, 260, 520);}

  function tam(mood){const f=FACES[mood==='talk'?'talk':(mood==='shock'?'shock':(mood==='hurt'?'hurt':(mood==='serious'?'serious':'neutral')))];
    return wrap(`
    <path d="M56,520 L56,424 Q60,368 106,350 L126,342 L134,342 L154,350 Q200,368 204,424 L204,520 Z" fill="#5b6b78"/>
    <path d="M56,486 Q130,496 204,486 L204,498 Q130,508 56,498 Z" fill="#48555f"/>
    <g><path d="M92,208 Q92,142 130,138 Q168,142 168,208 Q168,244 156,264 Q144,282 130,282 Q116,282 104,264 Q92,244 92,208 Z" fill="${SKIN}"/>
    <path d="M86,160 Q90,126 130,122 Q170,126 174,160 Q178,142 172,124 Q162,106 130,104 Q98,106 88,124 Q82,142 86,160 Z" fill="#7a5b3a"/>
    ${f(130,200,254)}
    <circle cx="103" cy="228" r="4" fill="#c98a7a" opacity=".55"/><circle cx="157" cy="228" r="4" fill="#c98a7a" opacity=".55"/></g>`);}

  function herrel(mood){const f=FACES[mood==='talk'?'talk':(mood==='serious'?'serious':'neutral')];
    return wrap(`
    <path d="M40,520 L40,412 Q44,352 96,334 L124,324 L136,324 L164,334 Q216,352 220,412 L220,520 Z" fill="#6e5f4a"/>
    <path d="M40,438 Q130,450 220,438 L220,452 Q130,464 40,452 Z" fill="#57493a"/>
    <path d="M176,300 q20,-8 22,-28 l8,4 q-2,26 -26,36 z" fill="#3b332a"/>
    <g><path d="M84,190 Q84,120 130,116 Q176,120 176,190 Q176,228 162,250 Q148,270 130,270 Q112,270 98,250 Q84,228 84,190 Z" fill="${SKIN2}"/>
    <path d="M92,238 q38,26 76,0 l0,26 q-38,22 -76,0 z" fill="#8a8274"/>
    <path d="M78,140 Q84,106 130,102 Q176,106 182,140 L186,152 Q186,120 172,104 Q152,90 130,90 Q108,90 88,104 Q74,120 74,152 Z" fill="#3b332a"/>
    ${f(130,182,232)}</g>`);}

  function brakko(mood){const f=FACES[mood==='talk'?'talk':(mood==='shock'?'shock':(mood==='hurt'?'hurt':'angry'))];
    return wrap(`
    <path d="M18,520 L18,404 Q22,336 78,314 L108,300 L152,300 L182,314 Q238,336 242,404 L242,520 Z" fill="#7a6a52"/>
    <path d="M30,430 q22,-16 40,-8 M230,430 q-22,-16 -40,-8" stroke="#4a4036" stroke-width="16" fill="none"/>
    <path d="M22,470 q30,-10 56,4 M238,470 q-30,-10 -56,4" stroke="#8a93a5" stroke-width="7" fill="none" stroke-dasharray="10 6"/>
    <g><path d="M76,184 Q76,110 130,106 Q184,110 184,184 Q184,226 168,250 Q152,272 130,272 Q108,272 92,250 Q76,226 76,184 Z" fill="${SKIN2}"/>
    <path d="M76,150 Q86,120 130,116 Q174,120 184,150 Q186,128 170,112 Q150,98 130,98 Q110,98 90,112 Q74,128 76,150 Z" fill="#5a4d3e"/>
    ${f(130,178,240)}
    <path d="M112,246 l8,10 M136,246 l-8,10" stroke="#151a22" stroke-width="3"/></g>`);}

  function collector(mood){
    return wrap(`
    <path d="M46,520 L46,410 Q50,348 102,330 L128,320 L132,320 L158,330 Q210,348 214,410 L214,520 Z" fill="#242c30"/>
    <path d="M102,330 L128,320 L132,320 L158,330 L146,354 L114,354 Z" fill="#e6e0d2"/>
    <path d="M118,354 l24,0 l-4,60 l-16,0 Z" fill="#1a2124"/>
    <g><path d="M88,188 Q88,118 130,114 Q172,118 172,188 Q172,226 159,247 Q146,266 130,266 Q114,266 101,247 Q88,226 88,188 Z" fill="${SKIN}"/>
    <path d="M74,136 L186,136 L192,120 Q188,104 170,104 L90,104 Q72,104 68,120 Z" fill="#1a2124"/>
    ${FACES[mood==='talk'?'talk':'serious'](130,180,234)}</g>`);}

  function announcer(mood){return wrap(`
    <path d="M48,520 L48,414 Q52,356 102,338 L127,328 L133,328 L158,338 Q208,356 212,414 L212,520 Z" fill="#8e2f35"/>
    <path d="M48,442 L212,442 L212,454 L48,454 Z" fill="#d8b64a"/>
    <g><path d="M88,190 Q88,120 130,116 Q172,120 172,190 Q172,228 159,249 Q146,268 130,268 Q114,268 101,249 Q88,228 88,190 Z" fill="${SKIN}"/>
    <path d="M96,120 Q112,106 130,108 Q148,106 164,120 L168,110 Q150,96 130,98 Q110,96 92,110 Z" fill="#3b332a"/>
    ${FACES[mood==='shout'?'shout':'talk'](130,182,236)}</g>`);}

  function bruna(mood){const f=FACES[mood==='talk'?'talk':(mood==='grin'?'grin':'grin')];
    return wrap(`
    <path d="M36,520 L36,410 Q40,350 94,332 L122,322 L138,322 L166,332 Q220,350 224,410 L224,520 Z" fill="#7a4a3a"/>
    <path d="M36,520 L36,462 Q130,472 224,462 L224,520 Z" fill="#5f392e"/>
    <g><path d="M86,188 Q86,118 130,114 Q174,118 174,188 Q174,226 161,248 Q148,268 130,268 Q112,268 99,248 Q86,226 86,188 Z" fill="${SKIN}"/>
    <path d="M80,140 Q86,106 130,102 Q174,106 180,140 L186,180 Q190,130 178,108 Q158,88 130,88 Q102,88 82,108 Q70,130 74,180 Z" fill="#8a3b28"/>
    <path d="M74,180 q-6,20 4,36 M186,180 q6,20 -4,36" stroke="#8a3b28" stroke-width="10" fill="none"/>
    ${f(130,180,236)}</g>`);}

  function grandmother(mood){return wrap(`
    <path d="M62,520 L62,436 Q64,392 100,380 L118,374 L142,374 L160,380 Q196,392 198,436 L198,520 Z" fill="#5a5347"/>
    <path d="M62,470 q68,14 136,0" stroke="#c95b6e" stroke-width="5" fill="none"/>
    <g><path d="M96,266 Q96,212 130,208 Q164,212 164,266 Q164,296 154,312 Q144,328 130,328 Q116,328 106,312 Q96,296 96,266 Z" fill="${SKIN2}"/>
    <path d="M92,236 Q96,206 130,202 Q164,206 168,236 Q172,218 162,204 Q148,192 130,192 Q112,192 98,204 Q88,218 92,236 Z" fill="#c8c2b4"/>
    <circle cx="130" cy="196" r="14" fill="#c8c2b4"/>
    ${FACES[mood==='talk'?'talk':'serious'](130,258,304)}</g>`, 260, 520);}

  function dyegirl(mood){return wrap(`
    <path d="M52,520 L52,418 Q56,360 104,342 L127,332 L133,332 L156,342 Q204,360 208,418 L208,520 Z" fill="#a05a74"/>
    <path d="M52,520 L52,468 Q130,478 208,468 L208,520 Z" fill="#874962"/>
    <path d="M86,380 l20,60 M174,380 l-20,60" stroke="#c95b6e" stroke-width="5" opacity=".6"/>
    <g><path d="M88,190 Q88,122 130,118 Q172,122 172,190 Q172,226 159,246 Q146,264 130,264 Q114,264 101,246 Q88,226 88,190 Z" fill="${SKIN}"/>
    <path d="M82,150 Q84,108 130,104 Q176,108 178,150 L182,220 Q188,140 180,116 Q168,92 130,90 Q92,92 80,116 Q72,140 78,220 Z" fill="#4a3040"/>
    ${FACES[mood==='talk'?'talk':(mood==='grin'?'grin':'neutral')](130,182,234)}</g>`);}

  // Wornman sting silhouette — lean man + hat + paper, pure black (stinger only).
  function wornman(){return wrap(`
    <path d="M60,520 L60,420 Q64,356 108,338 L126,330 L134,330 L152,338 Q196,356 200,420 L200,520 Z" fill="#0c0f14"/>
    <path d="M92,190 Q92,120 130,116 Q168,120 168,190 Q168,230 155,251 Q142,270 130,270 Q118,270 105,251 Q92,230 92,190 Z" fill="#0c0f14"/>
    <path d="M64,132 L196,132 L188,112 Q180,84 130,82 Q80,84 72,112 Z" fill="#0c0f14"/>
    <path d="M150,360 l50,-16 l6,52 l-48,14 Z" fill="#e9e2d0" transform="rotate(8 170 380)"/>
    <path d="M158,372 l34,-10 M160,384 l34,-10 M162,396 l30,-9" stroke="#8a93a5" stroke-width="2.4"/>`);}

  // cat + dog props (Ashren gags)
  function cat(){return wrap(`<g>
    <path d="M96,470 Q88,420 110,398 Q100,380 108,364 L124,382 Q132,378 140,382 L156,364 Q164,380 154,398 Q176,420 168,470 Q160,500 132,500 Q104,500 96,470 Z" fill="#2c3542"/>
    <circle cx="120" cy="428" r="4" fill="#d8b64a"/><circle cx="146" cy="428" r="4" fill="#d8b64a"/>
    <path d="M126,444 q6,5 12,0" stroke="#d8b64a" stroke-width="2.4" fill="none"/>
    <path d="M168,470 q26,-8 22,-38" stroke="#2c3542" stroke-width="10" fill="none" stroke-linecap="round"/></g>`,260,520);}

  const REG = { merdou, ashren, gups, marn, hale, priya, cesto, joro, pinch, tam, herrel,
    brakko, collector, announcer, bruna, grandmother, dyegirl, wornman, cat };

  window.PORTRAITS = {
    get(id, mood){
      const ov = (window.PRIVATE_OVERRIDES && window.PRIVATE_OVERRIDES.portraits) || {};
      if (ov[id+':'+mood]) return `<img src="${ov[id+':'+mood]}" style="height:100%" alt="">`;
      if (ov[id]) return `<img src="${ov[id]}" style="height:100%" alt="">`;
      const fn = REG[id];
      return fn ? fn(mood||'neutral') : '';
    },
    has(id){ return !!REG[id]; }
  };
})();
