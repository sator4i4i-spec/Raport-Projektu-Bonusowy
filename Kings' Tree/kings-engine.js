/* ═══════════════════════════════════════════════════════════════════
   KINGS' TREE — Tree engine
   Reuses the hourglass layout algorithm; new visual treatment for cards.
   Depends on: d3, window.ELIADORA_DATA (kings-poland.js)
   ─────────────────────────────────────────────────────────────────── */
'use strict';

// ═══ DATA ═══════════════════════════════════════════════════════════
const _DATA = window.ELIADORA_DATA || { people: [], succession: [], defaultFocus: '' };
const FOCUS_ID = _DATA.defaultFocus || (_DATA.people?.[0]?.id) || '';
const PEOPLE = (_DATA.people || []).map(p => ({...p, p: p.p || [], s: p.s || []}));
let PMAP = Object.fromEntries(PEOPLE.map(p => [p.id, p]));

// ═══ DYNASTY ERAS ═══════════════════════════════════════════════════
// Range = [startIdx, endIdx] inclusive into _DATA.succession
const ERAS = [
  { id:'piast',     range:[0,18],
    name:{pl:'Piastowie',           en:'House of Piast'},
    years:{pl:'~960–1370',          en:'c. 960–1370'},
    color:'#A87010', soft:'#D8B264' },
  { id:'anjou',     range:[19,20],
    name:{pl:'Andegawenowie',       en:'House of Anjou'},
    years:{pl:'1370–1399',          en:'1370–1399'},
    color:'#7A1F2E', soft:'#C77384' },
  { id:'jagiel',    range:[21,27],
    name:{pl:'Jagiellonowie',       en:'Jagiellonian Dynasty'},
    years:{pl:'1386–1572',          en:'1386–1572'},
    color:'#1F3A6B', soft:'#6E8AB8' },
  { id:'elect',     range:[28,38],
    name:{pl:'Królowie elekcyjni',  en:'Elective Kings'},
    years:{pl:'1573–1795',          en:'1573–1795'},
    color:'#4A2C5A', soft:'#9374A4' },
];
function eraOfIndex(idx) {
  for (const e of ERAS) if (idx >= e.range[0] && idx <= e.range[1]) return e;
  return ERAS[0];
}
function eraOfPerson(id) {
  const idx = (_DATA.succession || []).indexOf(id);
  return idx >= 0 ? eraOfIndex(idx) : null;
}

// ═══ I18N (compact — only what we need) ═════════════════════════════
const I18N = {
  pl: { brand:'Drzewo polskich królów', sub:'historia opowiadana przez korony',
        born:'Urodzony', born_f:'Urodzona', died:'Zmarł', died_f:'Zmarła',
        reigned:'Panowanie', years:'lat', age:'wiek',
        biography:'Życie i czyny', funFact:'Ciekawostka!',
        keyEvents:'Wydarzenia panowania', map:'Polska za jego/jej panowania',
        parents:'Rodzice', spouses:'Małżonkowie', children:'Dzieci',
        siblings:'Rodzeństwo', noBio:'Brak biografii.',
        searchPh:'Szukaj imienia albo dynastii…',
        searchEmpty:'Nikogo nie znaleziono.',
        ruler:'Władca', queen:'Królowa',
        tweaks:'Ustawienia',
        bg:'Tło', density:'Drzewo', cards:'Karty',
        bgPaper:'pergamin', bgLinen:'len', bgPlain:'gładki',
        denCompact:'gęste', denSpacious:'luźne',
        cardMedal:'medalion', cardHeral:'herbowe', cardStory:'baśniowe',
        kingsRail:'Poczet królów',
        grandparents:'Dziadkowie',
        grandchildren:'Wnuki', spouse:'Małżonek/-a',
        prevRuler:'Poprzednik', nextRuler:'Następca',
        of:'z' },
  en: { brand:'Tree of Polish Kings', sub:'history told through crowns',
        born:'Born', born_f:'Born', died:'Died', died_f:'Died',
        reigned:'Reign', years:'yrs', age:'age',
        biography:'Life & Deeds', funFact:'Did you know?',
        keyEvents:'Key events of the reign', map:'Poland under their rule',
        parents:'Parents', spouses:'Spouses', children:'Children',
        siblings:'Siblings', noBio:'No biography available.',
        searchPh:'Search a name or dynasty…',
        searchEmpty:'No one found.',
        ruler:'Ruler', queen:'Queen',
        tweaks:'Settings',
        bg:'Background', density:'Tree', cards:'Cards',
        bgPaper:'parchment', bgLinen:'linen', bgPlain:'plain',
        denCompact:'compact', denSpacious:'spacious',
        cardMedal:'medallion', cardHeral:'heraldic', cardStory:'storybook',
        kingsRail:'The Kings',
        grandparents:'Grandparents',
        grandchildren:'Grandchildren', spouse:'Spouse',
        prevRuler:'Previous', nextRuler:'Next',
        of:'of' },
  es: { brand:'Árbol de los reyes de Polonia', sub:'historia contada a través de las coronas',
        born:'Nacido', born_f:'Nacida', died:'Falleció', died_f:'Falleció',
        reigned:'Reinado', years:'años', age:'edad',
        biography:'Vida y obra', funFact:'¿Sabías que?',
        keyEvents:'Eventos del reinado', map:'Polonia bajo su reinado',
        parents:'Padres', spouses:'Cónyuges', children:'Hijos',
        siblings:'Hermanos', noBio:'Sin biografía.',
        searchPh:'Buscar un nombre o dinastía…',
        searchEmpty:'Nadie encontrado.',
        ruler:'Soberano', queen:'Reina',
        tweaks:'Ajustes',
        bg:'Fondo', density:'Árbol', cards:'Tarjetas',
        bgPaper:'pergamino', bgLinen:'lino', bgPlain:'liso',
        denCompact:'compacto', denSpacious:'amplio',
        cardMedal:'medallón', cardHeral:'heráldico', cardStory:'cuento',
        kingsRail:'Galería de reyes',
        grandparents:'Abuelos',
        grandchildren:'Nietos', spouse:'Cónyuge',
        prevRuler:'Anterior', nextRuler:'Siguiente',
        of:'de' },
  fr: { brand:'Arbre des rois de Pologne', sub:"l'histoire racontée par les couronnes",
        born:'Né', born_f:'Née', died:'Décédé', died_f:'Décédée',
        reigned:'Règne', years:'ans', age:'âge',
        biography:'Vie et œuvre', funFact:'Le saviez-vous ?',
        keyEvents:'Événements du règne', map:'La Pologne sous son règne',
        parents:'Parents', spouses:'Conjoints', children:'Enfants',
        siblings:'Fratrie', noBio:'Aucune biographie.',
        searchPh:'Chercher un nom ou une dynastie…',
        searchEmpty:'Personne trouvée.',
        ruler:'Souverain', queen:'Reine',
        tweaks:'Réglages',
        bg:'Fond', density:'Arbre', cards:'Cartes',
        bgPaper:'parchemin', bgLinen:'lin', bgPlain:'uni',
        denCompact:'dense', denSpacious:'aéré',
        cardMedal:'médaillon', cardHeral:'héraldique', cardStory:'conte',
        kingsRail:'Galerie des rois',
        grandparents:'Grands-parents',
        grandchildren:'Petits-enfants', spouse:'Conjoint(e)',
        prevRuler:'Précédent', nextRuler:'Suivant',
        of:'de' },
};
let lang = 'pl';
const t = k => (I18N[lang] || I18N.pl)[k] || k;

// ═══ HELPERS ════════════════════════════════════════════════════════
function birthYear(v){if(!v&&v!==0)return null;const n=parseInt(String(v).replace(/^[^0-9]+/,'').split('-')[0],10);return isNaN(n)?null:n;}
function isRuler(p){ return !!(p && (p.rs || p.re)); }
function reignSpan(p){
  const a = parseInt(String(p.rs||'').slice(0,4),10);
  const b = parseInt(String(p.re||'').slice(0,4),10);
  if (isNaN(a) || isNaN(b)) return null;
  return { start: a, end: b, years: b - a };
}
function ageGroup(p){const by=birthYear(p.b);if(!by)return 'senior';const ref=birthYear(p.d)||new Date().getFullYear();const age=ref-by;return age<25?'young':age<40?'adult':'senior';}
function seededRand(id){let h=0;for(let i=0;i<id.length;i++)h=(Math.imul(31,h)+id.charCodeAt(i))|0;return()=>{h=(Math.imul(1664525,h)+1013904223)|0;return(h>>>0)/0xFFFFFFFF;};}

// ═══ FACE GENERATOR (storybook royal flavor) ═══════════════════════
// Slightly more refined / illustrated look for kings vs commoners.
function buildFaceSVG(person, r) {
  const rand=seededRand(person.id), grp=ageGroup(person);
  const isF=person.g==='F', isChild=grp==='young', isElder=grp==='senior';
  const cx=r, cy=r;
  // Warmer skin palette
  const skinPal = isF
    ? ['#F5DBB8','#F0CDA0','#E8BC85','#D4A574']
    : ['#F0CDA0','#E8BC85','#D4A574','#BE9056','#A07840'];
  const skin = skinPal[Math.floor(rand()*skinPal.length)];

  // Hair palette skews darker, more authentically Slavic medieval portrait
  const hairPal = isElder
    ? ['#C0B89C','#D8D0B8','#A89C84','#E0DDD8']
    : isChild
      ? ['#7B3A00','#A05818','#C07028','#3A1800']
      : ['#3A1800','#5C2800','#8B4513','#2A1810','#7A6040','#A06030'];
  const hair = hairPal[Math.floor(rand()*hairPal.length)];
  const OL='#3C1F0A', SW=Math.max(1.0,r*0.05);
  const hR=r*0.66, hCx=cx, hCy=cy+r*0.10;
  const bg = isF ? '#FBEFE8' : '#EDF1F8';

  const p=[];
  p.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}"/>`);
  // Hair behind head (long hair / coif for women)
  if(isF && !isElder) p.push(`<ellipse cx="${hCx}" cy="${hCy+hR*0.12}" rx="${hR*1.22}" ry="${hR*1.24}" fill="${hair}" stroke="${OL}" stroke-width="${SW*0.7}"/>`);
  // Head
  p.push(`<circle cx="${hCx}" cy="${hCy}" r="${hR}" fill="${skin}" stroke="${OL}" stroke-width="${SW*0.85}"/>`);
  // Ears
  const earR=hR*0.14, earY=hCy+hR*0.02;
  [hCx-hR*0.91, hCx+hR*0.91].forEach(ex=>p.push(`<circle cx="${ex}" cy="${earY}" r="${earR}" fill="${skin}" stroke="${OL}" stroke-width="${SW*0.55}"/>`));
  // Hair top
  if(isElder){
    if(!isF) p.push(`<ellipse cx="${hCx}" cy="${hCy-hR*0.84}" rx="${hR*0.50}" ry="${hR*0.18}" fill="${hair}" stroke="${OL}" stroke-width="${SW*0.5}" opacity="0.85"/>`);
    else { const cy0=hCy-hR*0.62; p.push(`<ellipse cx="${hCx}" cy="${cy0}" rx="${hR*1.06}" ry="${hR*0.42}" fill="${hair}" stroke="${OL}" stroke-width="${SW*0.7}"/>`); }
  } else if(isF) {
    const cy0=hCy-hR*0.70; p.push(`<ellipse cx="${hCx}" cy="${cy0}" rx="${hR*1.12}" ry="${hR*0.40}" fill="${hair}" stroke="${OL}" stroke-width="${SW*0.75}"/>`);
  } else {
    const cy0=hCy-hR*0.74; p.push(`<ellipse cx="${hCx}" cy="${cy0}" rx="${hR*0.96}" ry="${hR*0.34}" fill="${hair}" stroke="${OL}" stroke-width="${SW*0.75}"/>`);
  }
  // Eyes
  const eyeY=hCy-hR*0.10, eyeOff=hR*0.30, eyeRx=hR*0.155, eyeRy=hR*0.118;
  [-eyeOff, eyeOff].forEach(ox=>{
    const ex=hCx+ox;
    p.push(`<ellipse cx="${ex}" cy="${eyeY}" rx="${eyeRx}" ry="${eyeRy}" fill="white" stroke="${OL}" stroke-width="${SW*0.50}"/>`);
    p.push(`<circle cx="${ex}" cy="${eyeY}" r="${hR*0.090}" fill="#3A1A00"/>`);
    p.push(`<circle cx="${ex+hR*0.040}" cy="${eyeY-hR*0.040}" r="${hR*0.026}" fill="white"/>`);
  });
  // Brows
  const browY=eyeY-hR*0.20, brow=isElder?'#9A9080':OL;
  [-eyeOff, eyeOff].forEach(ox=>{ const bx=hCx+ox, tilt=ox<0?0.040:-0.040;
    p.push(`<path d="M${bx-hR*0.135},${browY+hR*tilt} Q${bx},${browY-hR*0.05} ${bx+hR*0.135},${browY+hR*tilt}" fill="none" stroke="${brow}" stroke-width="${SW*0.82}" stroke-linecap="round"/>`);
  });
  // Cheeks
  const cheekY=eyeY+hR*0.28;
  [-eyeOff*1.18, eyeOff*1.18].forEach(ox=>p.push(`<ellipse cx="${hCx+ox}" cy="${cheekY}" rx="${hR*0.18}" ry="${hR*0.105}" fill="#E84838" opacity="0.16"/>`));
  // Nose suggestion
  const noseY=hCy+hR*0.10;
  p.push(`<path d="M${hCx-hR*0.07},${noseY} Q${hCx-hR*0.04},${noseY+hR*0.08} ${hCx+hR*0.00},${noseY+hR*0.08}" fill="none" stroke="#A06840" stroke-width="${SW*0.55}" stroke-linecap="round" opacity="0.55"/>`);
  // Mouth
  const mouthY=hCy+hR*0.35, mouthW=hR*0.22, mouthD=hR*0.10;
  p.push(`<path d="M${hCx-mouthW},${mouthY} Q${hCx},${mouthY+mouthD} ${hCx+mouthW},${mouthY}" fill="none" stroke="#A8302E" stroke-width="${SW*0.85}" stroke-linecap="round"/>`);
  return p.join('');
}

// ═══ LAYOUT CONSTANTS ═══════════════════════════════════════════════
const L_BASE = {
  CW: 116, CH: 154, CG: 16, BU: 36, RH: 206,
  PX: 60, PY: 56,
  PR_N: 30, PRH_N: 36, PC_N: 42,
  PR_F: 38, PRH_F: 44, PC_F: 52,
};
const L = { ...L_BASE };
function applyDensity(factor) {
  L.BU = Math.round(L_BASE.BU * factor);
  L.RH = Math.round(L_BASE.RH * factor);
}
L.UW = L.CW * 2 + L.CG;
L.CO = (L.CW + L.CG) / 2;
L.ML_Y = L.PC_N;

// ═══ HOURGLASS BUILDER ══════════════════════════════════════════════
function buildHourglass(focusId) {
  function curSpouse(id){const p=PMAP[id];if(!p||!p.s.length)return null;return PMAP[p.s[p.s.length-1]]||null;}
  function mkUnit(id,vis){const p=PMAP[id];if(!p)return null;const sp=curSpouse(id);const male=p.g==='M'?p:(sp&&sp.g==='M'?sp:null);const female=p.g==='F'?p:(sp&&sp.g==='F'?sp:null);return{male,female,mainId:id,vis};}
  function getParents(id){
    const p=PMAP[id]; if(!p||!p.p.length) return null;
    if(p.p.length===1){ const par=PMAP[p.p[0]]; if(!par) return null; return par.g==='F'?{dad:null,mom:par}:{dad:par,mom:null}; }
    const dad=PMAP[p.p[0]]||null, mom=PMAP[p.p[1]]||null;
    return (dad||mom)?{dad,mom}:null;
  }
  const parents=getParents(focusId);
  const row0=[mkUnit(focusId,'full')].filter(Boolean);
  const row1=PEOPLE.filter(p=>p.p.includes(focusId))
    .sort((a,b)=>(birthYear(a.b)||0)-(birthYear(b.b)||0))
    .map(c=>mkUnit(c.id,'full')).filter(Boolean);

  const row2=[]; const gcSeen=new Set();
  row1.forEach(u=>{
    const groupKids=[];
    PEOPLE.forEach(gc=>{
      if(gcSeen.has(gc.id)||!gc.p.includes(u.mainId))return;
      gcSeen.add(gc.id);
      const p=PMAP[gc.id]; if(!p) return;
      groupKids.push({male:p.g==='M'?p:null, female:p.g==='F'?p:null, mainId:gc.id, vis:'faded', parentMainId:u.mainId});
    });
    groupKids.sort((a,b)=>(birthYear(PMAP[a.mainId]?.b)||0)-(birthYear(PMAP[b.mainId]?.b)||0));
    row2.push(...groupKids);
  });

  let rowM1=[];
  if(parents){const dad=parents.dad,mom=parents.mom;const male=dad?.g==='M'?dad:(mom?.g==='M'?mom:null);const female=mom?.g==='F'?mom:(dad?.g==='F'?dad:null);rowM1=[{male,female,mainId:dad?.id||mom?.id,vis:'full'}].filter(u=>u&&u.mainId);}
  const rowM2=[];
  if(parents){
    if(parents.dad){const dp=getParents(parents.dad.id);if(dp){const u=mkUnit(dp.dad?.id||dp.mom?.id,'full');if(u)rowM2.push({...u,childId:parents.dad.id});}}
    if(parents.mom){const mp=getParents(parents.mom.id);if(mp){const u=mkUnit(mp.dad?.id||mp.mom?.id,'full');if(u)rowM2.push({...u,childId:parents.mom.id});}}
  }
  const siblings=[],seen=new Set([focusId]);
  if(parents){
    const dadId=parents.dad?.id, momId=parents.mom?.id;
    PEOPLE.forEach(p=>{
      if(seen.has(p.id))return;
      const sharesDad=!!(dadId&&p.p.includes(dadId));
      const sharesMom=!!(momId&&p.p.includes(momId));
      if(!sharesDad&&!sharesMom)return;
      const spId=p.s[p.s.length-1];
      seen.add(p.id);if(spId)seen.add(spId);
      const isHalf=!(sharesDad&&sharesMom);
      const u=mkUnit(p.id,'faded'); if(!u) return;
      siblings.push({...u,isHalf});
    });
  }
  siblings.sort((a,b)=>(birthYear(PMAP[a.mainId]?.b)||0)-(birthYear(PMAP[b.mainId]?.b)||0));

  const formerSpouses=[];
  const fp=PMAP[focusId];
  if(fp&&fp.s.length>1){
    for(let i=0;i<fp.s.length-1;i++){
      const fs=PMAP[fp.s[i]]; if(!fs) continue;
      formerSpouses.push({male:fs.g==='M'?fs:null, female:fs.g==='F'?fs:null, mainId:fs.id, vis:'full', isFormer:true});
    }
  }
  return{row0,rowM1,rowM2,row1,row2,siblings,formerSpouses};
}

// ═══ LAYOUT ═════════════════════════════════════════════════════════
function unitW(u) { return (u.male && u.female) ? L.UW : L.CW; }
function cardCx(unit, personId) {
  if (!unit.male || !unit.female) return unit.cx;
  const p = PMAP[personId];
  return p ? unit.cx + (p.g === 'M' ? -L.CO : L.CO) : unit.cx;
}

function calculateLayout(hg) {
  function rw(us){return us.length?us.reduce((s,u)=>s+unitW(u),0)+(us.length-1)*L.BU:0;}
  function ax(us,cx){let x=cx-rw(us)/2;return us.map(u=>{const uw=unitW(u),ucx=x+uw/2;x+=uw+L.BU;return{...u,cx:ucx};});}
  const r2=ax(hg.rowM2,0),r1=ax(hg.rowM1,0),r0=ax(hg.row0,0),r1p=ax(hg.row1,0);
  const topShift=(r2.length?0:L.RH)+(r1.length?0:L.RH);
  const Y={M2:L.PY,M1:L.PY+L.RH,R0:L.PY+L.RH*2,R1:L.PY+L.RH*3,R2:L.PY+L.RH*4};
  Object.keys(Y).forEach(k=>Y[k]-=topShift);
  const r2p=ax(hg.row2,0);

  const fHW=r0.length?unitW(r0[0])/2:0;
  const fS=hg.siblings.filter(s=>!s.isHalf),hS=hg.siblings.filter(s=>s.isHalf);
  let rx=fHW+L.BU;const rS=fS.map(s=>{const uw=unitW(s),cx=rx+uw/2;rx+=uw+L.BU;return{...s,cx};});
  let lx=-(fHW+L.BU);const lS=hS.map(s=>{const uw=unitW(s),cx=lx-uw/2;lx-=uw+L.BU;return{...s,cx};});
  const fmr=[];
  if(hg.formerSpouses&&hg.formerSpouses.length){
    const focalLE=r0.length?r0[0].cx-unitW(r0[0])/2:0;
    let nextRE=focalLE-L.BU;
    for(let i=hg.formerSpouses.length-1;i>=0;i--){
      const fs=hg.formerSpouses[i], uw=unitW(fs), cx=nextRE-uw/2;
      nextRE=cx-uw/2-L.BU;
      fmr[i]={...fs,cx};
    }
  }
  const mainAll=[...r2,...r1,...r0,...r1p,...r2p,...rS,...lS,...fmr];
  if(!mainAll.length)return{rowM2:[],rowM1:[],row0:[],row1:[],row2:[],siblings:[],formerSpouseUnits:[],svgW:800,svgH:600,focalCx:400,focalRowY:L.PY};
  const le=Math.min(...mainAll.map(u=>u.cx-unitW(u)/2));
  const re=Math.max(...mainAll.map(u=>u.cx+unitW(u)/2));
  const sh=u=>({...u,cx:u.cx+(L.PX-le)});
  let maxY=Y.R0+L.CH;
  if(r1p.length)maxY=Math.max(maxY,Y.R1+L.CH);
  if(r2p.length)maxY=Math.max(maxY,Y.R2+L.CH);
  return{
    rowM2:r2.map(u=>({...sh(u),y:Y.M2})),rowM1:r1.map(u=>({...sh(u),y:Y.M1})),
    row0:r0.map(u=>({...sh(u),y:Y.R0})),row1:r1p.map(u=>({...sh(u),y:Y.R1})),
    row2:r2p.map(u=>({...sh(u),y:Y.R2})),siblings:[...rS,...lS].map(u=>({...sh(u),y:Y.R0})),
    formerSpouseUnits:fmr.map(u=>({...sh(u),y:Y.R0})),
    svgW:Math.ceil(re-le+L.PX*2),svgH:maxY+L.PY,
    focalCx:(r0.length?r0[0].cx:0)+(L.PX-le),
    focalRowY:Y.R0,
  };
}

function buildCardData(pos, focusId) {
  const cards=[];
  function addUnit(unit,isFormer){
    const lx=unit.cx-unitW(unit)/2,op=unit.vis==='faded'?0.88:1;
    if(unit.male&&unit.female){
      cards.push({id:unit.male.id,  x:lx,           y:unit.y,person:unit.male,  isFocal:unit.male.id===focusId,  opacity:op,isFormer:!!isFormer});
      cards.push({id:unit.female.id,x:lx+L.CW+L.CG, y:unit.y,person:unit.female,isFocal:unit.female.id===focusId,opacity:op,isFormer:!!isFormer});
    } else {
      const p=unit.male||unit.female;
      if(p) cards.push({id:p.id,x:lx,y:unit.y,person:p,isFocal:p.id===focusId,opacity:op,isFormer:!!isFormer});
    }
  }
  [...pos.rowM2,...pos.rowM1,...pos.row0,...pos.row1,...pos.row2,...pos.siblings].forEach(u=>addUnit(u,false));
  (pos.formerSpouseUnits||[]).forEach(u=>addUnit(u,true));
  return cards;
}
function buildMarriageData(pos){
  const lines=[];
  function addUnit(unit){if(!unit.male||!unit.female)return;const lx=unit.cx-unitW(unit)/2;
    lines.push({key:unit.male.id+'~'+unit.female.id,x1:lx+L.CW,y1:unit.y+L.ML_Y,x2:lx+L.CW+L.CG,y2:unit.y+L.ML_Y,op:unit.vis==='faded'?0.88:1});}
  [...pos.rowM2,...pos.rowM1,...pos.row0,...pos.row1,...pos.row2,...pos.siblings].forEach(addUnit);
  return lines;
}

// ═══ CARD DRAWING ═══════════════════════════════════════════════════
let CARD_STYLE = 'medallion';   // 'medallion' | 'heraldic' | 'storybook'

function drawCardInto(sel, d) {
  sel.selectAll('*').remove();
  const person = d.person;
  const pr  = d.isFocal ? L.PR_F  : L.PR_N;
  const prh = d.isFocal ? L.PRH_F : L.PRH_N;
  const pc  = d.isFocal ? L.PC_F  : L.PC_N;
  const cxC = L.CW / 2;
  const era = eraOfPerson(person.id);
  const eraColor = era?.color || '#6B4A20';
  const eraSoft  = era?.soft  || '#C0A878';

  // ── Card body — white paper with gold frame ────────────────────
  const paperFill = d.isFocal ? '#FFFFFF' : (d.isFormer ? '#F8F4EF' : '#FFFFFF');

  // soft drop shadow under card
  sel.append('rect').attr('x',2).attr('y',4).attr('width',L.CW).attr('height',L.CH).attr('rx',2)
    .attr('fill','rgba(40,25,8,0.10)');

  // main card paper
  const cardRect = sel.append('rect').attr('x',0).attr('y',0).attr('width',L.CW).attr('height',L.CH).attr('rx',2)
    .attr('fill', paperFill)
    .attr('stroke', d.isFocal ? eraColor : (d.isFormer ? '#C8B0A8' : '#E2C7C0'))
    .attr('stroke-width', d.isFocal ? 1.8 : 1);
  if (d.isFormer) cardRect.attr('stroke-dasharray','5,3').attr('opacity',0.85);

  // Inner gold border (double-line ornament look)
  sel.append('rect').attr('x',4).attr('y',4).attr('width',L.CW-8).attr('height',L.CH-8).attr('rx',1)
    .attr('fill','none')
    .attr('stroke', '#C8253E')
    .attr('stroke-width', 0.6)
    .attr('opacity', d.isFocal ? 0.75 : 0.40);

  // Tiny Greek-key corner brackets for focal cards
  if (d.isFocal) {
    const cb = 8;
    [[5,5,1,1],[L.CW-5,5,-1,1],[5,L.CH-5,1,-1],[L.CW-5,L.CH-5,-1,-1]].forEach(([x,y,sx,sy])=>{
      sel.append('path')
        .attr('d', `M ${x},${y+cb*sy} L ${x},${y} L ${x+cb*sx},${y}`)
        .attr('fill','none').attr('stroke','#9E1D2E').attr('stroke-width',1).attr('opacity',0.9);
    });
  }

  // ── Crown banner for rulers ────────────────────────────────────
  const ruler = isRuler(person);
  if (ruler) {
    const cy0 = -2;
    const crownColor = d.isFocal ? '#D4AE5E' : eraColor;
    sel.append('path')
      .attr('d', `M ${cxC-10},${cy0+8} L ${cxC-10},${cy0+2} L ${cxC-6},${cy0+5} L ${cxC-2},${cy0+0} L ${cxC+2},${cy0+5} L ${cxC+6},${cy0+0} L ${cxC+10},${cy0+5} L ${cxC+10},${cy0+8} Z`)
      .attr('fill', crownColor)
      .attr('stroke', '#5A3A08').attr('stroke-width', 0.6)
      .attr('filter', d.isFocal ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' : '');
    sel.append('circle').attr('cx', cxC-6).attr('cy', cy0+5).attr('r', 1.2).attr('fill', '#9E1D2E');
    sel.append('circle').attr('cx', cxC).attr('cy', cy0).attr('r', 1.2).attr('fill', '#F0E0A0');
    sel.append('circle').attr('cx', cxC+6).attr('cy', cy0+5).attr('r', 1.2).attr('fill', '#9E1D2E');
  }

  // Focal glow ring (gold)
  if (d.isFocal) {
    sel.append('ellipse').attr('cx',cxC).attr('cy',pc).attr('rx',pr+8).attr('ry',prh+8)
      .attr('fill','none').attr('stroke','#D4AE5E').attr('stroke-width',1.2).attr('opacity',0.45);
  }

  // ── Portrait medallion ─────────────────────────────────────────
  const _noPortrait = (window.ELIADORA_DATA || {}).noPortrait;
  const clipId = 'cp-' + person.id + (d.isFocal?'f':'n');
  sel.append('defs').append('clipPath').attr('id', clipId)
    .append('ellipse').attr('cx',cxC).attr('cy',pc).attr('rx',pr).attr('ry',prh);

  // Soft parchment fill as base (replaces cartoon face)
  sel.append('ellipse').attr('cx',cxC).attr('cy',pc).attr('rx',pr).attr('ry',prh)
    .attr('fill', d.isFocal ? '#FAF3E0' : '#F5EED8')
    .attr('clip-path',`url(#${clipId})`);

  // Portrait: try person.image, then age/gender placeholder from portraitFolder
  const _pFolder = _noPortrait ? null : (window.ELIADORA_DATA || {}).portraitFolder;
  const _imgSrc = _noPortrait ? null : (person.image ||
    (_pFolder ? `${_pFolder}/${ageGroup(person)}_${person.g==='F'?'female':'male'}.jpg` : null));
  if (_imgSrc) {
    const probe = new Image();
    probe.onload = () => {
      if (!sel.node() || !document.body.contains(sel.node())) return;
      sel.append('image')
        .attr('href', _imgSrc)
        .attr('x', cxC-pr).attr('y', pc-prh)
        .attr('width', pr*2).attr('height', prh*2)
        .attr('clip-path', `url(#${clipId})`)
        .attr('preserveAspectRatio','xMidYMid slice');
      sel.append('ellipse').attr('cx',cxC).attr('cy',pc).attr('rx',pr).attr('ry',prh)
        .attr('fill','none').attr('stroke', eraColor)
        .attr('stroke-width', d.isFocal ? 2.0 : 1.4);
    };
    probe.onerror = () => {};
    probe.src = _imgSrc;
  }

  // Oval frame stroke
  sel.append('ellipse').attr('cx',cxC).attr('cy',pc).attr('rx',pr).attr('ry',prh)
    .attr('fill','none')
    .attr('stroke', eraColor)
    .attr('stroke-width', d.isFocal ? 2.0 : 1.3);
  sel.append('ellipse').attr('cx',cxC).attr('cy',pc).attr('rx',pr-2.5).attr('ry',prh-2.5)
    .attr('fill','none').attr('stroke','#D4AE5E').attr('stroke-width',0.6).attr('opacity',0.65);

  // ── Name / dates ───────────────────────────────────────────────
  const ruleY = pc + prh + 8;
  sel.append('line')
    .attr('x1', cxC-24).attr('y1', ruleY).attr('x2', cxC+24).attr('y2', ruleY)
    .attr('stroke', '#C8253E').attr('stroke-width', 0.8).attr('opacity', 0.7);
  sel.append('text').attr('x', cxC).attr('y', ruleY+1).attr('text-anchor','middle')
    .attr('fill', '#C8253E').attr('font-size','7px').attr('opacity', 0.9).text('✦');

  // First name — Cinzel
  sel.append('text').attr('x',cxC).attr('y',ruleY+13)
    .attr('text-anchor','middle')
    .attr('font-family','Cinzel, Georgia, serif')
    .attr('font-size', d.isFocal ? '12.5px' : '11.5px')
    .attr('font-weight', d.isFocal ? '600' : '500')
    .attr('letter-spacing', '0.5')
    .attr('fill','#1A1410')
    .text(person.fn);

  // Last name — SAME font, Cinzel
  sel.append('text').attr('x',cxC).attr('y',ruleY+25)
    .attr('text-anchor','middle')
    .attr('font-family','Cinzel, Georgia, serif')
    .attr('font-size', d.isFocal ? '11px' : '10.5px')
    .attr('font-weight', '500')
    .attr('letter-spacing','0.5')
    .attr('fill', eraColor)
    .text(person.ln);

  // Years
  if (person.b || person.rs) {
    let yr;
    if (ruler) {
      const a = String(person.rs||'').slice(0,4);
      const b = String(person.re||'').slice(0,4);
      yr = a && b ? `${a} – ${b}` : (a || b);
    } else {
      const by = String(person.b||'').slice(0,4);
      const dy = person.d ? String(person.d).slice(0,4) : '';
      yr = by && dy ? `${by} – ${dy}` : by;
    }
    sel.append('text').attr('x',cxC).attr('y',ruleY+37)
      .attr('text-anchor','middle')
      .attr('font-family','"Cormorant Garamond", Georgia, serif')
      .attr('font-size','11px').attr('font-style','italic')
      .attr('fill','#7A7062').attr('opacity',0.95)
      .text(yr);
  }
}

// ═══ CONNECTORS ═════════════════════════════════════════════════════
function drawConnectors(g, pos, focusId) {
  const baseCol = '#8C6418';
  const lw = 1.3;
  const PALETTE = ['#9b7820','#7a5a9a','#2a7a5a','#8a3a3a','#2a5a8a','#9a602a'];
  let _col = baseCol;
  function seg(x1,y1,x2,y2,dash,op){const o=op??(dash?0.45:0.7);const el=g.append('line').attr('class','conn').attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2).attr('stroke',_col).attr('stroke-width',dash?lw-0.5:lw).attr('opacity',o).attr('stroke-linecap','round');if(dash)el.attr('stroke-dasharray','5,3');}
  function elbow(sx,sy,tx,ty,dash,op){const o=op??(dash?0.45:0.7),my=(sy+ty)/2;const el=g.append('path').attr('class','conn').attr('d',`M${sx},${sy} V${my} H${tx} V${ty}`).attr('fill','none').attr('stroke',_col).attr('stroke-width',dash?lw-0.5:lw).attr('opacity',o);if(dash)el.attr('stroke-dasharray','5,3');}
  function fan(sx,sy,targets,dash,op){if(!targets.length)return;const tY=targets[0].y,mid=(sy+tY)/2,xs=[sx,...targets.map(t=>t.x)];seg(sx,sy,sx,mid,dash,op);seg(Math.min(...xs),mid,Math.max(...xs),mid,dash,op);targets.forEach(t=>seg(t.x,mid,t.x,t.y,dash,op));}
  function connectDown(pu,cus,dash,op){if(!cus.length)return;const ids=new Set([pu.male?.id,pu.female?.id].filter(Boolean));const cur=[],half=[];cus.forEach(u=>{const c=PMAP[u.mainId],sh=c?c.p.filter(pid=>ids.has(pid)).length:0;(sh>=2?cur:half).push({x:cardCx(u,u.mainId),y:u.y});});if(cur.length)fan(pu.cx,pu.y+L.CH,cur,dash,op);if(half.length){const fx=cardCx(pu,pu.mainId);half.forEach(({x,y})=>elbow(fx,pu.y+L.CH,x,y,true,op));}}
  if(pos.rowM1.length)pos.rowM2.forEach(gp=>{if(gp.childId)elbow(gp.cx,gp.y+L.CH,cardCx(pos.rowM1[0],gp.childId),pos.rowM1[0].y,false);});
  if(pos.rowM1.length&&pos.row0.length){const src=pos.rowM1[0];const fT={x:cardCx(pos.row0[0],focusId),y:pos.row0[0].y};const fST=pos.siblings.filter(s=>!s.isHalf).map(s=>({x:cardCx(s,s.mainId),y:s.y}));fan(src.cx,src.y+L.CH,[fT,...fST],false);pos.siblings.filter(s=>s.isHalf).forEach(hs=>elbow(cardCx(src,src.mainId),src.y+L.CH,cardCx(hs,hs.mainId),hs.y,true));}
  if(pos.row1.length&&pos.row0.length)connectDown(pos.row0[0],pos.row1,false);
  if(pos.row2.length&&pos.row1.length){
    const gcM=new Map();
    pos.row2.forEach(u=>{if(!gcM.has(u.parentMainId))gcM.set(u.parentMainId,[]);gcM.get(u.parentMainId).push(u);});
    pos.row1.forEach((r1u,idx)=>{
      const grp=gcM.get(r1u.mainId); if(!grp?.length)return;
      _col=PALETTE[idx%PALETTE.length];
      connectDown(r1u,grp,false,0.55);
    });
    _col=baseCol;
  }
  if(pos.formerSpouseUnits?.length&&pos.row0.length){
    const focalUnit=pos.row0[0];
    const focalLeftX=focalUnit.cx-unitW(focalUnit)/2;
    const lineY=focalUnit.y+L.ML_Y;
    pos.formerSpouseUnits.forEach(fsu=>{
      const fsRightX=fsu.cx+unitW(fsu)/2;
      g.append('line').attr('class','conn')
        .attr('x1',fsRightX).attr('y1',lineY).attr('x2',focalLeftX).attr('y2',lineY)
        .attr('stroke','#A08850').attr('stroke-width',1)
        .attr('stroke-dasharray','6,4').attr('opacity',0.55);
    });
  }
}

// ═══ SVG SETUP ═══════════════════════════════════════════════════════
const ROOT = d3.select('#tree-svg');
// Persistent paper-pattern defs
const defs = ROOT.append('defs');

// Focal paper — slightly brighter (illuminated effect)
defs.append('radialGradient').attr('id','paper-focal').attr('cx','50%').attr('cy','40%').attr('r','70%')
  .selectAll('stop').data([
    {o:'0%', c:'#FBF1D2'},
    {o:'65%',c:'#F4E1A8'},
    {o:'100%',c:'#EFD89C'},
  ]).enter().append('stop')
  .attr('offset',d=>d.o).attr('stop-color',d=>d.c);

const grainL = ROOT.append('g');
const labelL = ROOT.append('g');
const connL  = ROOT.append('g');
const cardL  = ROOT.append('g');

function updateLabels(pos){
  labelL.selectAll('*').remove();
  const add = (y, txt) => labelL.append('text')
    .attr('x', 22).attr('y', y + L.CH/2 + 4)
    .attr('font-family','Cinzel, serif')
    .attr('font-size','10px').attr('font-weight','700')
    .attr('letter-spacing','3px')
    .attr('fill','#C8253E').attr('opacity', 0.85)
    .text(txt.toUpperCase());
  if (pos.rowM2.length) add(pos.rowM2[0].y, t('grandparents'));
  if (pos.rowM1.length) add(pos.rowM1[0].y, t('parents'));
  if (pos.row1.length)  add(pos.row1[0].y,  t('children'));
  if (pos.row2.length)  add(pos.row2[0].y,  t('grandchildren'));
}

// ═══ TRANSITION ═════════════════════════════════════════════════════
let currentFocusId = null;
let transitioning = false;

function transitionTo(newFocusId, animate) {
  if (transitioning) return;
  if (animate && newFocusId === currentFocusId) {
    // still update sidebar/timeline if user clicks same card
    if (window.kingsUI) window.kingsUI.updateSidebar(newFocusId);
    return;
  }
  if (!PMAP[newFocusId]) return;
  transitioning = true;

  const hg  = buildHourglass(newFocusId);
  const pos = calculateLayout(hg);
  const cards     = buildCardData(pos, newFocusId);
  const marriages = buildMarriageData(pos);

  const FADE = animate ? 160 : 0;
  const MOVE = animate ? 500 : 0;
  const TOTAL = FADE + MOVE + 60;

  ROOT.attr('width', pos.svgW).attr('height', pos.svgH);

  connL.selectAll('.conn').transition().duration(FADE).attr('opacity',0).remove();

  const mSel = connL.selectAll('.ml').data(marriages, d=>d.key);
  mSel.exit().transition().duration(FADE).attr('opacity',0).remove();
  mSel.enter().append('line').attr('class','ml')
    .attr('stroke','#9C7830').attr('stroke-width',1.4)
    .attr('x1',d=>d.x1).attr('y1',d=>d.y1).attr('x2',d=>d.x2).attr('y2',d=>d.y2)
    .attr('opacity',0)
    .transition().duration(220).delay(FADE+MOVE-100).attr('opacity',d=>d.op);
  mSel.transition().duration(MOVE).delay(FADE)
    .attr('x1',d=>d.x1).attr('y1',d=>d.y1).attr('x2',d=>d.x2).attr('y2',d=>d.y2)
    .attr('opacity',d=>d.op);

  const cSel = cardL.selectAll('.card-g').data(cards, d=>d.id);
  cSel.exit().transition().duration(FADE).attr('opacity',0).remove();
  const entered = cSel.enter().append('g').attr('class','card-g')
    .attr('transform', d=>`translate(${d.x},${d.y})`)
    .attr('opacity', 0)
    .on('click',(ev,d)=>transitionTo(d.id, true));
  entered.each(function(d){ drawCardInto(d3.select(this), d); });
  entered.transition().duration(220).delay(FADE+MOVE-80).attr('opacity', d=>d.opacity);

  cSel.on('click',(ev,d)=>transitionTo(d.id, true));
  cSel.each(function(d){ drawCardInto(d3.select(this), d); });
  cSel.transition().duration(MOVE).delay(FADE)
    .attr('transform', d=>`translate(${d.x},${d.y})`)
    .attr('opacity', d=>d.opacity);

  setTimeout(()=>{
    drawConnectors(connL, pos, newFocusId);
    updateLabels(pos);
    if (window.kingsUI) {
      window.kingsUI.updateTimeline(newFocusId);
      if (animate) { window.kingsUI.scrollToFocus(pos); window.kingsUI.openSidebar(newFocusId); }
      else window.kingsUI.updateSidebar(newFocusId);
    }
    currentFocusId = newFocusId;
    transitioning = false;
  }, TOTAL);
}

// Public API for the UI layer
window.kingsEngine = {
  PEOPLE, PMAP, _DATA, ERAS,
  L, eraOfPerson, eraOfIndex, isRuler, reignSpan, ageGroup,
  buildHourglass, calculateLayout, buildFaceSVG,
  transitionTo,
  applyDensity, setCardStyle(s){ CARD_STYLE = s; },
  get currentFocusId(){ return currentFocusId; },
  get FOCUS_ID(){ return FOCUS_ID; },
  setLang(l){ lang = l; },
  t,
};
window._faceFor = buildFaceSVG;
