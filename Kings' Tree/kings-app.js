/* ═══════════════════════════════════════════════════════════════════
   KINGS' TREE — UI layer
   Era-grouped left rail · Royal-decree sidebar · Search · Tweaks
   ─────────────────────────────────────────────────────────────────── */
'use strict';

(function(){
const E = window.kingsEngine;
const PEOPLE_K = E.PEOPLE;
const PMAP_K = E.PMAP;
const ERAS_K = E.ERAS;
const eraOfPerson = E.eraOfPerson;
const eraOfIndex = E.eraOfIndex;
const isRuler = E.isRuler;
const reignSpan = E.reignSpan;
const t = E.t;
const DATA = E._DATA;

/* ═══ DATE FORMATTING ═══════════════════════════════════════════════ */
const MONTHS = {
  pl: ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  es: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
  fr: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
};
let curLang = 'pl';

// Pluralized + gendered helpers
const L18N_LOCAL = {
  pl: {
    yrsThrone: y => `${y} ${y===1?'rok':((y%10>=2&&y%10<=4&&(y%100<10||y%100>=20))?'lata':'lat')} na tronie`,
    lived: (y,isF) => `${isF?'Przeżyła':'Przeżył'} ${y} ${y===1?'rok':((y%10>=2&&y%10<=4&&(y%100<10||y%100>=20))?'lata':'lat')}`,
    aged: (y,isF) => `${isF?'Ma':'Ma'} ${y} ${y===1?'rok':((y%10>=2&&y%10<=4&&(y%100<10||y%100>=20))?'lata':'lat')}`,
    regnal: i => `${i}. monarcha Polski`,
    connectionsTitle: 'Koligacje',
    father: 'Ojciec', mother: 'Matka',
    spouse: (isF) => isF ? 'Mąż' : 'Żona',
    childrenLabel: 'Dzieci',
    note_ph: 'np. siostra cesarza Karola IV…',
    bio_ph: 'Napisz biografię…',
    place_ph: 'miejsce',
    epithet_ph: 'przydomek',
    royalHouse: 'Z KRÓLEWSKIEGO RODU',
    yrsShort: 'lat', onThrone: 'na tronie',
    evBirth: 'Narodziny', evAccession: 'Wstąpienie', evEndReign: 'Koniec rządów', evDeath: 'Śmierć',
  },
  en: {
    yrsThrone: y => `${y} years on the throne`,
    lived: (y) => `Lived ${y} years`,
    aged: (y) => `Aged ${y} years`,
    regnal: i => `${i}${i===1?'st':i===2?'nd':i===3?'rd':'th'} monarch of Poland`,
    connectionsTitle: 'Connections',
    father: 'Father', mother: 'Mother',
    spouse: () => 'Spouse',
    childrenLabel: 'Children',
    note_ph: 'e.g. sister of Emperor Charles IV…',
    bio_ph: 'Write a biography…',
    place_ph: 'place',
    epithet_ph: 'epithet',
    royalHouse: 'OF THE ROYAL HOUSE',
    yrsShort: 'yrs', onThrone: 'on throne',
    evBirth: 'Birth', evAccession: 'Accession', evEndReign: 'End of reign', evDeath: 'Death',
  },
  es: {
    yrsThrone: y => `${y} ${y===1?'año':'años'} en el trono`,
    lived: (y) => `Vivió ${y} años`,
    aged: (y) => `Tiene ${y} años`,
    regnal: i => `${i}º monarca de Polonia`,
    connectionsTitle: 'Conexiones',
    father: 'Padre', mother: 'Madre',
    spouse: (isF) => isF ? 'Esposo' : 'Esposa',
    childrenLabel: 'Hijos',
    note_ph: 'p. ej. hermana del emperador Carlos IV…',
    bio_ph: 'Escribe una biografía…',
    place_ph: 'lugar',
    epithet_ph: 'epíteto',
    royalHouse: 'DE LA CASA REAL',
    yrsShort: 'años', onThrone: 'en el trono',
    evBirth: 'Nacimiento', evAccession: 'Ascensión', evEndReign: 'Fin del reinado', evDeath: 'Fallecimiento',
  },
  fr: {
    yrsThrone: y => `${y} ${y===1?'an':'ans'} sur le trône`,
    lived: (y) => `Vécut ${y} ans`,
    aged: (y) => `Âgé(e) de ${y} ans`,
    regnal: i => `${i}${i===1?'er':'e'} monarque de Pologne`,
    connectionsTitle: 'Alliances',
    father: 'Père', mother: 'Mère',
    spouse: (isF) => isF ? 'Époux' : 'Épouse',
    childrenLabel: 'Enfants',
    note_ph: "p. ex. sœur de l'empereur Charles IV…",
    bio_ph: 'Écrivez une biographie…',
    place_ph: 'lieu',
    epithet_ph: 'épithète',
    royalHouse: 'DE LA MAISON ROYALE',
    yrsShort: 'ans', onThrone: 'sur le trône',
    evBirth: 'Naissance', evAccession: 'Avènement', evEndReign: 'Fin du règne', evDeath: 'Décès',
  },
};
const T2 = (k, ...args) => {
  const fn = (L18N_LOCAL[curLang] || L18N_LOCAL.pl)[k] || (L18N_LOCAL.pl[k] || k);
  return typeof fn === 'function' ? fn(...args) : fn;
};

function formatDate(val) {
  if (!val && val !== 0) return '';
  const s = String(val).trim();
  if (/^\d{4}$/.test(s)) return s;
  if (!/^\d/.test(s) || s.includes(' ')) return s;
  const parts = s.split('-');
  if (parts.length === 2) {
    const m = parseInt(parts[1],10)-1;
    return `${MONTHS[curLang][m]||parts[1]} ${parts[0]}`;
  }
  if (parts.length === 3) {
    const day = parseInt(parts[2],10);
    const m = parseInt(parts[1],10)-1;
    const yr = parts[0];
    const mName = MONTHS[curLang][m] || parts[1];
    if (curLang === 'pl') return `${day} ${mName} ${yr}`;
    if (curLang === 'en') return `${mName} ${day}, ${yr}`;
    if (curLang === 'es') return `${day} de ${mName} de ${yr}`;
    if (curLang === 'fr') return `${day} ${mName} ${yr}`;
  }
  return s;
}

/* ═══ LEFT RAIL — era-grouped centuries ribbon ═════════════════════ */
function renderRail() {
  const railScroll = document.getElementById('rail-scroll');
  const railTitle  = document.getElementById('rail-title');
  railTitle.textContent = t('kingsRail');
  railScroll.innerHTML = '';
  const chain = DATA.succession || [];

  // Figure out which era the current focus belongs to (so it can start expanded)
  const currentFocus = E.currentFocusId || E.FOCUS_ID;
  const currentIdx = chain.indexOf(currentFocus);
  const currentEraId = currentIdx >= 0 ? eraOfIndex(currentIdx).id : ERAS_K[0].id;

  ERAS_K.forEach(era => {
    const eraEl = document.createElement('section');
    eraEl.className = 'era';
    eraEl.dataset.eraId = era.id;
    eraEl.style.setProperty('--era-color', era.color);
    if (era.id === currentEraId) eraEl.classList.add('expanded');

    const hdr = document.createElement('div');
    hdr.className = 'era-header';

    hdr.innerHTML = `
      <span class="era-chev">▸</span>
      <span class="era-name">${era.name[curLang] || era.name.pl}</span>
      <span class="era-years">${era.years[curLang] || era.years.pl}</span>
    `;
    hdr.addEventListener('click', () => {
      eraEl.classList.toggle('expanded');
    });
    eraEl.appendChild(hdr);

    const list = document.createElement('div');
    list.className = 'era-list';

    for (let i = era.range[0]; i <= era.range[1]; i++) {
      const id = chain[i];
      const p = PMAP_K[id];
      if (!p) continue;
      const item = document.createElement('div');
      item.className = 'king-item';
      item.dataset.id = id;
      item.style.setProperty('--era-color', era.color);

      const years = (p.rs || p.re)
        ? [String(p.rs||'').slice(0,4), String(p.re||'').slice(0,4)].filter(Boolean).join('–')
        : '';
      const sp = reignSpan(p);
      const duration = sp ? `${sp.years} ${T2('yrsShort')}` : '';

      item.innerHTML = `
        <div class="king-info">
          <div class="king-name">${escHtml(p.fn || '')}</div>
          ${p.ln ? `<div class="king-surname">${escHtml(p.ln)}</div>` : ''}
          ${years ? `<div class="king-years">${years}</div>` : ''}
          ${duration ? `<div class="king-duration">${escHtml(duration + ' ' + T2('onThrone'))}</div>` : ''}
        </div>
        <svg class="king-crown" viewBox="0 0 24 24" fill="currentColor" style="color:${era.color}">
          <path d="M3 17 L2 7 L7 11 L12 5 L17 11 L22 7 L21 17 L3 17 Z"
                stroke="#3D2810" stroke-width="1.2" stroke-linejoin="round"/>
          <circle cx="7" cy="11" r="1.2" fill="#C8253E"/>
          <circle cx="12" cy="5" r="1.4" fill="#FFE090"/>
          <circle cx="17" cy="11" r="1.2" fill="#C8253E"/>
        </svg>
      `;
      item.addEventListener('click', (ev) => {
        // Elegant ripple feedback
        const r = document.createElement('span');
        r.className = 'ripple';
        const rect = item.getBoundingClientRect();
        r.style.left = (ev.clientX - rect.left) + 'px';
        r.style.top  = (ev.clientY - rect.top) + 'px';
        item.appendChild(r);
        setTimeout(() => r.remove(), 600);
        E.transitionTo(id, true);
      });
      list.appendChild(item);
    }
    eraEl.appendChild(list);
    railScroll.appendChild(eraEl);
  });
}

function updateRail(focusId) {
  document.querySelectorAll('.king-item').forEach(el => {
    el.classList.toggle('current', el.dataset.id === focusId);
  });
  // Auto-expand the era containing the current king (collapse others gracefully)
  const chain = DATA.succession || [];
  const idx = chain.indexOf(focusId);
  if (idx >= 0) {
    const targetEra = eraOfIndex(idx).id;
    document.querySelectorAll('.era').forEach(el => {
      el.classList.toggle('expanded', el.dataset.eraId === targetEra);
    });
  }
  // Auto-scroll current into view
  const cur = document.querySelector('.king-item.current');
  if (cur) {
    const scroll = document.getElementById('rail-scroll');
    setTimeout(() => {
      scroll.scrollTo({
        top: cur.offsetTop - scroll.clientHeight / 2 + cur.offsetHeight / 2,
        behavior: 'smooth'
      });
    }, 380); // wait for expand animation
  }
}

/* ═══ ROYAL DECREE SIDEBAR ═════════════════════════════════════════ */
const sidebarEl = document.getElementById('sidebar');
let sidebarHiddenByUser = false;

function openSidebar(id) {
  if (sidebarHiddenByUser) return;
  updateSidebar(id);
  sidebarEl.classList.add('open');
}
function closeSidebar() {
  sidebarEl.classList.remove('open');
}

document.getElementById('sb-handle').addEventListener('click', () => {
  if (sidebarEl.classList.contains('open')) {
    closeSidebar(); sidebarHiddenByUser = true;
  } else {
    sidebarHiddenByUser = false;
    openSidebar(E.currentFocusId || E.FOCUS_ID);
  }
});

function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* Wax seal SVG — colored by dynasty era */
function waxSealSVG(era) {
  const color = era?.color || '#931C2C';
  return `
    <svg class="wax-seal" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wax-grad-${era?.id||'x'}" cx="35%" cy="30%" r="70%">
          <stop offset="0%"  stop-color="${shade(color, 55)}"/>
          <stop offset="60%" stop-color="${color}"/>
          <stop offset="100%" stop-color="${shade(color, -35)}"/>
        </radialGradient>
      </defs>
      <!-- jagged edge -->
      <path d="
        M 28 4
        L 32 6 L 36 4 L 38 8 L 43 8 L 44 12 L 48 14 L 47 18 L 51 22 L 49 26 L 52 30 L 49 34 L 50 38 L 45 39 L 44 44 L 40 44 L 37 48 L 32 47 L 28 50 L 24 47 L 19 48 L 16 44 L 12 44 L 11 39 L 6 38 L 7 34 L 4 30 L 7 26 L 5 22 L 9 18 L 8 14 L 12 12 L 13 8 L 18 8 L 20 4 L 24 6 Z
      " fill="url(#wax-grad-${era?.id||'x'})" stroke="${shade(color, -50)}" stroke-width="0.8" stroke-linejoin="round"/>
      <!-- inset stars + cross device -->
      <circle cx="28" cy="27" r="13" fill="none" stroke="${shade(color, -30)}" stroke-width="0.7" opacity="0.7"/>
      <path d="M 28 18 L 28 36 M 22 22 L 34 32 M 22 32 L 34 22" stroke="${shade(color, 40)}" stroke-width="1.2" opacity="0.55"/>
      <text x="28" y="30" text-anchor="middle" fill="${shade(color, 55)}"
            font-family="Cinzel, serif" font-size="9" font-weight="700"
            letter-spacing="1.5" opacity="0.85">${era?.id === 'piast' ? 'P' : era?.id === 'anjou' ? 'A' : era?.id === 'jagiel' ? 'J' : 'R'}</text>
    </svg>
  `;
}
function shade(hex, percent){
  const num = parseInt(hex.replace('#',''),16);
  const r = (num>>16)&255, g=(num>>8)&255, b=num&255;
  const adj = (c) => Math.max(0, Math.min(255, Math.round(c + (percent/100)*255)));
  return `#${[adj(r),adj(g),adj(b)].map(n=>n.toString(16).padStart(2,'0')).join('')}`;
}

/* Build a portrait medallion SVG for the sidebar */
function portraitMedallionHTML(person, era) {
  const r = 80, prh = 92, cx = 100, cy = 110;
  const color = era?.color || '#6B4A20';
  return `
    <svg width="200" height="220" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg"
         data-portrait-svg data-id="${person.id}"
         style="cursor:pointer" title="Click to enlarge"
         onclick="window._enlargePortrait && window._enlargePortrait('${person.id}')">
      <defs>
        <clipPath id="sb-clip-${person.id}">
          <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${prh}"/>
        </clipPath>
        <radialGradient id="sb-rim-${person.id}" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stop-color="#FFFCF3"/>
          <stop offset="100%" stop-color="${shade(color, 30)}"/>
        </radialGradient>
      </defs>
      <ellipse cx="${cx}" cy="${cy}" rx="${r+12}" ry="${prh+12}"
        fill="url(#sb-rim-${person.id})" stroke="${shade(color,-20)}" stroke-width="1.5"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r+6}" ry="${prh+6}"
        fill="none" stroke="${color}" stroke-width="2.5"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r+3}" ry="${prh+3}"
        fill="none" stroke="#D4AE5E" stroke-width="0.8" opacity="0.75"/>
      <text x="${cx}" y="14" text-anchor="middle" fill="${color}" font-size="14" font-family="serif">✦</text>
      <text x="${cx}" y="216" text-anchor="middle" fill="${color}" font-size="14" font-family="serif">✦</text>
      <!-- Parchment fill — real image overlaid asynchronously by tryLoadSidebarImage -->
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${prh}"
        fill="#FAF3E0" clip-path="url(#sb-clip-${person.id})"/>
      <g clip-path="url(#sb-clip-${person.id})"></g>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${prh}"
        fill="none" stroke="${shade(color, -10)}" stroke-width="2"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r-3}" ry="${prh-3}"
        fill="none" stroke="#D4AE5E" stroke-width="0.6" opacity="0.55"/>
    </svg>
  `;
}

/* Async: load portrait into sidebar — tries person.image then age/gender placeholder */
function tryLoadSidebarImage(person) {
  if (DATA.noPortrait) return;
  const pFolder = DATA.portraitFolder;
  const ag = E.ageGroup ? E.ageGroup(person) : 'adult';
  const imgSrc = person.image ||
    (pFolder ? `${pFolder}/${ag}_${person.g==='F'?'female':'male'}.jpg` : null);
  if (!imgSrc) return;
  const probe = new Image();
  probe.onload = () => {
    const svg = document.querySelector(`[data-portrait-svg][data-id="${person.id}"]`);
    if (!svg) return;
    const r = 80, prh = 92, cx = 100, cy = 110;
    const ns = 'http://www.w3.org/2000/svg';
    const clipG = svg.querySelector('g[clip-path]');
    if (!clipG) return;
    // Remove parchment fill ellipse if present
    const fills = clipG.previousElementSibling;
    if (fills && fills.tagName === 'ellipse') fills.remove();
    const img = document.createElementNS(ns, 'image');
    img.setAttribute('href', imgSrc);
    img.setAttribute('x', cx - r);
    img.setAttribute('y', cy - prh);
    img.setAttribute('width', r * 2);
    img.setAttribute('height', prh * 2);
    img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    clipG.appendChild(img);
    // Store src for enlargement
    svg.dataset.portraitSrc = imgSrc;
  };
  probe.onerror = () => {};
  probe.src = imgSrc;
}

/* Enlarge portrait overlay */
window._enlargePortrait = function(personId) {
  const svg = document.querySelector(`[data-portrait-svg][data-id="${personId}"]`);
  const src = svg?.dataset?.portraitSrc;
  if (!src) return;
  let ov = document.getElementById('portrait-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'portrait-overlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:200;background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;cursor:zoom-out';
    ov.addEventListener('click', () => ov.remove());
    document.body.appendChild(ov);
  }
  ov.innerHTML = `<img src="${src}" style="max-height:88vh;max-width:88vw;border-radius:50%;object-fit:cover;border:4px solid #D4AE5E;box-shadow:0 8px 48px rgba(0,0,0,0.6)">`;
  ov.style.display = 'flex';
};

/* Compute interesting life events for a ruler */
function deriveEvents(p) {
  const events = [];
  const by = p.b ? String(p.b).match(/\d{4}/)?.[0] : null;
  const dy = p.d ? String(p.d).match(/\d{4}/)?.[0] : null;
  if (by) events.push({ year: parseInt(by,10), label: T2('evBirth') });
  if (p.rs) {
    const y = String(p.rs).match(/\d{4}/)?.[0];
    if (y) events.push({ year: parseInt(y,10), label: T2('evAccession') });
  }
  if (p.re && p.re !== p.rs) {
    const y = String(p.re).match(/\d{4}/)?.[0];
    if (y && y !== dy) events.push({ year: parseInt(y,10), label: T2('evEndReign') });
  }
  if (dy) events.push({ year: parseInt(dy,10), label: T2('evDeath') });
  return events.sort((a,b)=>a.year-b.year);
}

/* Derive a fun fact from the biography (first short sentence or hand-picked) */
const FUN_FACTS_OVERRIDES = {
  pl: {
    mieszko1: 'W 966 roku przyjął chrzest — jedna decyzja zmieniła Polskę na zawsze.',
    boleslaw1: 'W 1025 roku został pierwszym koronowanym królem Polski — i umarł trzy miesiące później.',
    kazimierz3: 'Mówi się: zastał Polskę drewnianą, a zostawił murowaną. Założył kilkadziesiąt miast i Akademię Krakowską.',
    jadwiga: 'Choć była kobietą, koronowano ją na KRÓLA Polski (nie królową!) — bo prawo nie znało królowej-władczyni.',
    wladyslaw2j: 'Pochodził z pogańskiej Litwy — i właśnie po to przyjął chrzest, by ożenić się z królem… znaczy królową Jadwigą.',
    jan3_sobieski: 'W 1683 roku pod Wiedniem rozbił armię turecką i uratował chrześcijańską Europę.',
    stefan_batory: 'Pochodził z Siedmiogrodu, mówił słabo po polsku — ale wygrał wszystkie swoje wojny.',
  },
  en: {
    mieszko1: "In 966 he was baptised — one decision changed Poland forever.",
    boleslaw1: "In 1025 he became Poland's first crowned king — and died three months later.",
    kazimierz3: "It is said: he found Poland built of wood and left it built of stone. He founded dozens of cities and the Kraków Academy.",
    jadwiga: "Although a woman, she was crowned KING of Poland (not queen!) — because the law had no place for a female sovereign.",
    wladyslaw2j: "He came from pagan Lithuania — and was baptised specifically to marry King… well, Queen Jadwiga.",
    jan3_sobieski: "At Vienna in 1683 he routed the Ottoman army and saved Christian Europe.",
    stefan_batory: "He came from Transylvania, barely spoke Polish — but won every war he fought.",
  },
  es: {
    mieszko1: 'En el año 966 fue bautizado — una sola decisión cambió Polonia para siempre.',
    boleslaw1: 'En 1025 fue el primer rey coronado de Polonia — y murió tres meses después.',
    kazimierz3: 'Se dice que encontró una Polonia de madera y dejó una de piedra. Fundó decenas de ciudades y la Academia de Cracovia.',
    jadwiga: 'Aunque era mujer, fue coronada REY de Polonia (¡no reina!) — porque la ley no contemplaba una reina soberana.',
    wladyslaw2j: 'Venía de la Lituania pagana — y se bautizó precisamente para casarse con el rey… bueno, la reina Jadwiga.',
    jan3_sobieski: 'En Viena, en 1683, derrotó al ejército otomano y salvó a la Europa cristiana.',
    stefan_batory: 'Venía de Transilvania, apenas hablaba polaco — pero ganó todas sus guerras.',
  },
  fr: {
    mieszko1: "En 966, il fut baptisé — une seule décision changea la Pologne à jamais.",
    boleslaw1: "En 1025, il fut le premier roi couronné de Pologne — et mourut trois mois plus tard.",
    kazimierz3: "On dit qu'il trouva une Pologne de bois et en laissa une de pierre. Il fonda des dizaines de villes et l'Académie de Cracovie.",
    jadwiga: "Bien qu'elle fût une femme, elle fut couronnée ROI de Pologne (et non reine !) — car la loi ignorait la reine souveraine.",
    wladyslaw2j: "Il venait de la Lituanie païenne — et fut baptisé précisément pour épouser le roi… enfin, la reine Jadwiga.",
    jan3_sobieski: "À Vienne en 1683, il défit l'armée ottomane et sauva l'Europe chrétienne.",
    stefan_batory: "Il venait de Transylvanie, parlait à peine polonais — mais gagna toutes ses guerres.",
  },
};
function deriveFunFact(p) {
  const overrides = FUN_FACTS_OVERRIDES[curLang] || FUN_FACTS_OVERRIDES.pl;
  if (overrides[p.id]) return overrides[p.id];
  const bioText = typeof p.bio === 'object' ? (p.bio[curLang] || p.bio.pl || '') : (p.bio || '');
  if (!bioText) return null;
  // Find shortest interesting sentence after the first paragraph
  const paras = bioText.split(/\n\n+/);
  const search = paras[1] || paras[0] || '';
  const sentences = search.split(/(?<=[.!?])\s+/).filter(s => s.length > 30 && s.length < 200);
  return sentences[0] || null;
}

function bioParagraphs(p) {
  const txt = typeof p.bio === 'object' ? (p.bio[curLang] || p.bio.pl || '') : (p.bio || '');
  if (!txt) return [];
  return txt.split(/\n\n+/).map(s => s.trim()).filter(Boolean);
}

function chip(id) {
  const p = PMAP_K[id]; if (!p) return '';
  const initial = (p.fn || '?').charAt(0);
  const isF = p.g === 'F';
  return `<button class="chip" onclick="window.kingsUI.goto('${id}')">
    <span class="chip-dot${isF ? ' fem' : ''}">${escHtml(initial)}</span>
    ${escHtml(p.fn)} ${escHtml(p.ln)}
  </button>`;
}

/* ═══ EDITABLE OVERRIDES (localStorage) ════════════════════════════ */
const OVERRIDES_KEY = 'kings_overrides';
let OVERRIDES = {};
try { OVERRIDES = JSON.parse(localStorage.getItem(OVERRIDES_KEY) || '{}'); }
catch(e) { OVERRIDES = {}; }

function getPerson(id) {
  const base = PMAP_K[id];
  if (!base) return null;
  const ov = OVERRIDES[id];
  if (!ov) return base;
  // Merge bio (object) separately so language-keyed bios merge properly
  const merged = { ...base, ...ov };
  if (typeof base.bio === 'object' && typeof ov.bio === 'object') {
    merged.bio = { ...base.bio, ...ov.bio };
  }
  return merged;
}
function setOverride(id, field, value) {
  if (!OVERRIDES[id]) OVERRIDES[id] = {};
  if (field.startsWith('bio.')) {
    const lang = field.split('.')[1];
    if (!OVERRIDES[id].bio) OVERRIDES[id].bio = {};
    OVERRIDES[id].bio[lang] = value;
    PMAP_K[id].bio = { ...(typeof PMAP_K[id].bio === 'object' ? PMAP_K[id].bio : {}), [lang]: value };
  } else if (field.startsWith('conn.')) {
    // conn.<otherId> — note about a connection
    const otherId = field.slice(5);
    if (!OVERRIDES[id].conn) OVERRIDES[id].conn = {};
    OVERRIDES[id].conn[otherId] = value;
  } else {
    OVERRIDES[id][field] = value;
    PMAP_K[id][field] = value;
  }
  try { localStorage.setItem(OVERRIDES_KEY, JSON.stringify(OVERRIDES)); } catch(e){}
}
function getConnectionNote(id, otherId) {
  return OVERRIDES[id]?.conn?.[otherId] || '';
}
// Apply overrides into PMAP_K once at boot so engine sees latest
Object.keys(OVERRIDES).forEach(id => {
  const o = OVERRIDES[id];
  Object.keys(o).forEach(k => {
    if (k === 'bio') {
      PMAP_K[id].bio = { ...(typeof PMAP_K[id].bio === 'object' ? PMAP_K[id].bio : {}), ...o.bio };
    } else if (k !== 'conn') {
      if (PMAP_K[id]) PMAP_K[id][k] = o[k];
    }
  });
});

function updateSidebar(personId) {
  const p = getPerson(personId);
  if (!p) return;
  const era = eraOfPerson(personId);
  const sb = document.getElementById('sb-content');

  // Set era color CSS vars on the sidebar for accent coloring
  sb.style.setProperty('--era-color', era?.color || '#6B4A20');
  sb.style.setProperty('--era-color-soft', era?.soft || '#C0A878');

  // Ruler details
  const ruler = isRuler(p);
  const span = ruler ? reignSpan(p) : null;

  // Find regnal number from succession order, if ruler
  const chain = DATA.succession || [];
  const succIdx = chain.indexOf(personId);
  const regnalLabel = succIdx >= 0 ? T2('regnal', succIdx + 1) : '';

  // Born / died lines + lifespan
  const isF = p.g === 'F';
  const bornLabel = isF ? t('born_f') : t('born');
  const diedLabel = isF ? t('died_f') : t('died');
  const dateLines = [];
  if (p.b) {
    let s = `<span class="dl-label">${bornLabel}</span> <strong data-edit data-id="${personId}" data-field="b">${escHtml(formatDate(p.b))}</strong>`;
    if (p.bp || true) s += ` <span class="symbol">·</span> <span data-edit data-id="${personId}" data-field="bp" data-placeholder="${T2('place_ph')}">${escHtml(p.bp || '')}</span>`;
    dateLines.push(s);
  }
  if (p.d) {
    let s = `<span class="dl-label">${diedLabel}</span> <strong data-edit data-id="${personId}" data-field="d">${escHtml(formatDate(p.d))}</strong>`;
    if (p.dp || true) s += ` <span class="symbol">·</span> <span data-edit data-id="${personId}" data-field="dp" data-placeholder="${T2('place_ph')}">${escHtml(p.dp || '')}</span>`;
    dateLines.push(s);
  }

  // Lifespan: years lived (b → d)
  let lifespanBadge = '';
  const by = parseInt(String(p.b||'').match(/\d{4}/)?.[0] || '', 10);
  const dy = parseInt(String(p.d||'').match(/\d{4}/)?.[0] || '', 10);
  if (by) {
    const endY = dy || new Date().getFullYear();
    const lived = endY - by;
    if (lived > 0 && lived < 130) {
      const label = dy ? T2('lived', lived, isF) : T2('aged', lived, isF);
      lifespanBadge = `<div class="lifespan-badge">${escHtml(label)}</div>`;
    }
  }

  // Reign duration line
  let reignLine = '';
  if (ruler && span) {
    const label = `${t('reigned')}: <strong>${span.start} – ${span.end}</strong> <span class="symbol">·</span> ${T2('yrsThrone', span.years)}`;
    reignLine = `<div class="decree-dates" style="margin-top:8px">${label}</div>`;
  }

  // Events strip
  const events = ruler ? deriveEvents(p) : [];

  // Fun fact
  const funFact = deriveFunFact(p);

  // Biography paragraphs
  const paras = bioParagraphs(p);
  const bioText = typeof p.bio === 'object' ? (p.bio[curLang] || '') : (p.bio || '');

  // Connections from tree structure
  const parentIds = (p.p || []).filter(id => PMAP_K[id]);
  const spouseIds = (p.s || []).filter(id => PMAP_K[id]);
  const childIds = PEOPLE_K.filter(c => (c.p || []).includes(personId)).map(c => c.id);
  // Split parents by gender for nicer labels
  const father = parentIds.map(id=>PMAP_K[id]).find(pp=>pp.g==='M');
  const mother = parentIds.map(id=>PMAP_K[id]).find(pp=>pp.g==='F');

  sb.innerHTML = `
    <div class="decree-head">
      <div class="seal-row">
        ${era ? waxSealSVG(era) : ''}
        <div class="seal-meta">
          <div class="regnal-num">${ruler && succIdx >= 0 ? escHtml(regnalLabel) : T2('royalHouse')}</div>
          <div class="dynasty-line">${era ? escHtml(era.name[curLang] || era.name.pl) : ''}</div>
        </div>
      </div>
      <h1 class="decree-name" data-edit data-id="${personId}" data-field="fn">${escHtml(p.fn || '')}</h1>
      <div class="decree-epithet" data-edit data-id="${personId}" data-field="ln" data-placeholder="${T2('epithet_ph')}">${escHtml(p.ln || '')}</div>
      ${dateLines.length ? `<div class="decree-dates">${dateLines.join('<br>')}</div>` : ''}
      ${reignLine}
      ${lifespanBadge}
    </div>

    <div class="portrait-frame">
      ${portraitMedallionHTML(p, era)}
    </div>

    ${funFact ? `
    <div class="fun-fact">
      <div class="fun-fact-label">${escHtml(t('funFact'))}</div>
      <div class="fun-fact-body" data-edit data-id="${personId}" data-field="funFact">${escHtml(funFact)}</div>
    </div>
    ` : ''}

    ${bioText || paras.length ? `
    <div class="decree-section">
      <div class="section-rule">
        <span class="section-rule-title">${escHtml(t('biography'))}</span>
      </div>
      <div class="bio-prose" data-edit data-id="${personId}" data-field="bio.${curLang}" data-placeholder="${T2('bio_ph')}">${
        paras.length
          ? paras.map(para => `<p>${escHtml(para).replace(/\n/g, '<br>')}</p>`).join('')
          : escHtml(bioText)
      }</div>
    </div>
    ` : `<div class="decree-section"><div class="bio-prose" data-edit data-id="${personId}" data-field="bio.${curLang}" data-placeholder="${T2('bio_ph')}"></div></div>`}

    ${events.length >= 2 ? `
    <div class="decree-section events-strip">
      <div class="section-rule">
        <span class="section-rule-title">${escHtml(t('keyEvents'))}</span>
      </div>
      <div class="events-rail" id="events-rail-${personId}"></div>
    </div>
    ` : ''}

    ${p.media ? `
    <div class="decree-section">
      <div class="section-rule">
        <span class="section-rule-title">VIDEO</span>
      </div>
      <div style="text-align:center;padding:4px 0 12px">
        <button class="video-play-btn" onclick="window._playVideo('${escHtml(p.media)}')">
          <span style="font-size:18px">▶</span> ${curLang==='pl'?'Obejrzyj film':curLang==='es'?'Ver vídeo':curLang==='fr'?'Regarder la vidéo':'Watch film'}
        </button>
      </div>
    </div>
    ` : ''}

    ${p.map ? `
    <div class="decree-section">
      <div class="section-rule">
        <span class="section-rule-title">${escHtml(t('map'))}</span>
      </div>
      <div class="map-card">
        <img src="${escHtml(p.map)}" alt="" loading="lazy"
             onerror="this.parentElement.style.display='none'">
        <div class="map-caption">${ruler && span ? `${span.start}–${span.end}` : ''}</div>
      </div>
    </div>
    ` : ''}

    <div class="decree-section">
      <div class="section-rule">
        <span class="section-rule-title">${T2('connectionsTitle')}</span>
      </div>
      <div class="connections-grid">
        ${father ? connectionRow(T2('father'), [father.id], personId) : ''}
        ${mother ? connectionRow(T2('mother'), [mother.id], personId) : ''}
        ${spouseIds.length ? connectionRow(T2('spouse', isF), spouseIds, personId) : ''}
        ${childIds.length ? connectionRow(T2('childrenLabel'), childIds, personId) : ''}
      </div>
    </div>

    <div style="height: 40px"></div>
  `;

  // After DOM is in, position events on the rail
  if (events.length >= 2) {
    const railEl = document.getElementById(`events-rail-${personId}`);
    if (railEl) {
      const minY = events[0].year;
      const maxY = events[events.length - 1].year;
      const range = Math.max(1, maxY - minY);
      events.forEach(ev => {
        const pct = ((ev.year - minY) / range) * 100;
        const pt = document.createElement('div');
        pt.className = 'event-point';
        pt.style.left = pct + '%';
        pt.innerHTML = `<span class="event-year">${ev.year}</span><span class="event-tip">${escHtml(ev.label)}</span>`;
        railEl.appendChild(pt);
      });
    }
  }

  // Wire editable fields
  wireEditableFields(sb);

  // Async-load portrait image if available
  tryLoadSidebarImage(p);

  updateRail(personId);
}

function connectionRow(label, ids, ownerId) {
  return `
    <div class="connection-row">
      <div class="connection-label">${escHtml(label)}</div>
      <div class="connection-people">
        ${ids.map(id => {
          const pp = PMAP_K[id]; if (!pp) return '';
          const era2 = eraOfPerson(id);
          const note = getConnectionNote(ownerId, id);
          return `
            <div class="connection-item">
              <span class="connection-name" onclick="window.kingsUI.goto('${id}')">
                <span>${escHtml(pp.fn)} ${escHtml(pp.ln || '')}</span>
                ${era2 ? `<span class="connection-name-flag" style="color:${era2.color}">${escHtml(era2.name[curLang] || era2.name.pl)}</span>` : ''}
              </span>
              <div class="connection-note"
                contenteditable="true"
                data-edit-conn
                data-owner="${ownerId}" data-other="${id}"
                data-placeholder="${T2('note_ph')}">${escHtml(note)}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/* ═══ EDIT MODE ═════════════════════════════════════════════════════ */
let editMode = false;
function setEditMode(on) {
  editMode = on;
  sidebarEl.classList.toggle('edit-mode', on);
  const btn = document.getElementById('edit-pencil-btn');
  if (btn) {
    btn.title = on ? (curLang==='pl'?'Wyłącz edycję':'Lock editing') : (curLang==='pl'?'Edytuj dane':'Edit data');
    btn.classList.toggle('active', on);
    btn.innerHTML = on ? '🔓' : '✏️';
  }
  const sb = document.getElementById('sb-content');
  if (sb) {
    sb.querySelectorAll('[data-edit]').forEach(el => {
      el.setAttribute('contenteditable', on ? 'true' : 'false');
    });
    sb.querySelectorAll('[data-edit-conn]').forEach(el => {
      el.setAttribute('contenteditable', on ? 'true' : 'false');
    });
  }
}

function wireEditableFields(scope) {
  // Set initial state based on editMode
  scope.querySelectorAll('[data-edit]').forEach(el => {
    el.setAttribute('contenteditable', editMode ? 'true' : 'false');
    el.setAttribute('spellcheck', 'false');
    el.addEventListener('blur', () => {
      const id = el.dataset.id;
      const field = el.dataset.field;
      if (!id || !field) return;
      const value = (field === 'bio.' + curLang)
        ? el.innerText.trim()
        : el.textContent.trim();
      setOverride(id, field, value);
      if (['fn','ln','b','d','rs','re'].includes(field)) {
        if (E.currentFocusId) E.transitionTo(E.currentFocusId, false);
        updateRail(E.currentFocusId);
      }
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && el.tagName !== 'DIV') {
        e.preventDefault(); el.blur();
      }
    });
  });
  scope.querySelectorAll('[data-edit-conn]').forEach(el => {
    el.setAttribute('contenteditable', editMode ? 'true' : 'false');
    el.addEventListener('blur', () => {
      const owner = el.dataset.owner;
      const other = el.dataset.other;
      if (!owner || !other) return;
      setOverride(owner, 'conn.' + other, el.textContent.trim());
    });
  });
}

/* Allow chips to navigate */
window.kingsUI = {
  openSidebar, updateSidebar,
  updateTimeline: updateRail,
  scrollToFocus,
  goto(id) { E.transitionTo(id, true); },
};

/* ═══ SCROLL TO FOCUS ═══════════════════════════════════════════════ */
function scrollToFocus(pos) {
  const c = document.getElementById('tree-wrap');
  const sbVisible = sidebarEl.classList.contains('open') ? (sidebarEl.offsetWidth - 32) : 0;
  const availW = c.clientWidth - sbVisible;
  const scrollLeft = pos.focalCx - availW / 2;
  const scrollTop  = Math.max(0, pos.focalRowY - c.clientHeight * 0.28);
  c.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'smooth' });
}

/* ═══ SEARCH ════════════════════════════════════════════════════════ */
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

function openSearch() {
  searchOverlay.classList.add('open');
  searchInput.value = '';
  searchInput.placeholder = t('searchPh');
  renderSearchResults('');
  setTimeout(() => searchInput.focus(), 30);
}
function closeSearch() { searchOverlay.classList.remove('open'); }

function renderSearchResults(q) {
  q = q.trim().toLowerCase();
  if (!q) {
    // show only rulers when empty
    const chain = DATA.succession || [];
    searchResults.innerHTML = chain.slice(0, 12).map(id => {
      const p = PMAP_K[id]; if (!p) return '';
      return buildSearchRow(p, '');
    }).join('');
    return;
  }
  const scored = [];
  PEOPLE_K.forEach(p => {
    const full = ((p.fn||'') + ' ' + (p.ln||'')).toLowerCase();
    if (full.includes(q)) {
      const start = full.startsWith(q) ? 2 : (p.fn?.toLowerCase().startsWith(q) ? 2 : 1);
      scored.push({ p, score: start + (isRuler(p) ? 0.5 : 0) });
    }
  });
  scored.sort((a,b) => b.score - a.score || (a.p.fn||'').localeCompare(b.p.fn||''));
  if (!scored.length) {
    searchResults.innerHTML = `<div id="search-empty">${escHtml(t('searchEmpty'))}</div>`;
    return;
  }
  searchResults.innerHTML = scored.slice(0, 30).map(({p}) => buildSearchRow(p, q)).join('');
}

function buildSearchRow(p, q) {
  const era = eraOfPerson(p.id);
  const isR = isRuler(p);
  const years = isR
    ? [String(p.rs||'').slice(0,4), String(p.re||'').slice(0,4)].filter(Boolean).join('–')
    : [String(p.b||'').slice(0,4), String(p.d||'').slice(0,4)].filter(Boolean).join('–');
  const hl = (s) => {
    if (!q) return escHtml(s||'');
    const i = (s||'').toLowerCase().indexOf(q);
    if (i < 0) return escHtml(s||'');
    return escHtml(s.slice(0,i)) + '<em>' + escHtml(s.slice(i,i+q.length)) + '</em>' + escHtml(s.slice(i+q.length));
  };
  return `<div class="search-result" tabindex="0" data-id="${p.id}"
    onclick="window.kingsUI.goto('${p.id}'); window._closeSearch();"
    onkeydown="if(event.key==='Enter'){window.kingsUI.goto('${p.id}'); window._closeSearch();}">
    <span class="sr-name">
      ${isR ? `<span style="color:${era?.color || '#931C2C'};margin-right:6px">♔</span>` : ''}
      ${hl(p.fn)} ${hl(p.ln)}
    </span>
    <span class="sr-meta">${escHtml(years)}${era ? ' · ' + escHtml(era.name[curLang] || era.name.pl) : ''}</span>
  </div>`;
}

window._closeSearch = closeSearch;

document.getElementById('search-btn').addEventListener('click', openSearch);
searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if (e.key === 'Enter') {
    const first = document.querySelector('.search-result');
    if (first) first.click();
  }
});
searchOverlay.addEventListener('click', e => {
  if (e.target === searchOverlay) closeSearch();
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/^(INPUT|TEXTAREA)$/i.test(document.activeElement?.tagName||'')) {
    e.preventDefault(); openSearch();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault(); openSearch();
  }
});

/* ═══ LANGUAGE SWITCH ══════════════════════════════════════════════ */
const TWEAK_LABELS = {
  bg:     { pl:'TŁO', en:'BACKGROUND', es:'FONDO', fr:'FOND' },
  tree:   { pl:'DRZEWO', en:'TREE', es:'ÁRBOL', fr:'ARBRE' },
  cards:  { pl:'KARTY', en:'CARDS', es:'TARJETAS', fr:'CARTES' },
  paper:  { pl:'pergamin', en:'parchment', es:'pergamino', fr:'parchemin' },
  linen:  { pl:'len', en:'linen', es:'lino', fr:'lin' },
  plain:  { pl:'gładki', en:'plain', es:'liso', fr:'uni' },
  compact:{ pl:'gęste', en:'compact', es:'compacto', fr:'compact' },
  spacious:{ pl:'luźne', en:'spacious', es:'espacioso', fr:'espacé' },
  medallion:{ pl:'medalion', en:'medallion', es:'medallón', fr:'médaillon' },
  heraldic: { pl:'herbowe', en:'heraldic', es:'heráldico', fr:'héraldique' },
  storybook:{ pl:'baśniowe', en:'storybook', es:'ilustrado', fr:'illustré' },
  handle:   { pl:'KARTA · BIO', en:'RECORD · BIO', es:'FICHA · BIO', fr:'FICHE · BIO' },
  settings: { pl:'USTAWIENIA · TWEAKS', en:'SETTINGS · TWEAKS', es:'AJUSTES', fr:'RÉGLAGES' },
};
function tl(k) { return (TWEAK_LABELS[k] || {})[curLang] || (TWEAK_LABELS[k] || {}).en || k; }

function setLanguage(l) {
  curLang = l;
  E.setLang(l);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  document.getElementById('brand-title').textContent = t('brand');
  document.getElementById('brand-sub').textContent = t('sub');
  // Update tweaks panel labels
  const twLabel = document.querySelector('#tw-bg .tweak-label');
  const trLabel = document.querySelector('#tw-density .tweak-label');
  const caLabel = document.querySelector('#tw-cards .tweak-label');
  if (twLabel) twLabel.textContent = tl('bg');
  if (trLabel) trLabel.textContent = tl('tree');
  if (caLabel) caLabel.textContent = tl('cards');
  document.querySelectorAll('#tw-bg .tweak-btn').forEach(b => { b.textContent = tl(b.dataset.val) || b.textContent; });
  document.querySelectorAll('#tw-density .tweak-btn').forEach(b => { b.textContent = tl(b.dataset.val) || b.textContent; });
  document.querySelectorAll('#tw-cards .tweak-btn').forEach(b => { b.textContent = tl(b.dataset.val) || b.textContent; });
  // Update CSS-driven sidebar handle text via a data attribute
  const sbHandle = document.getElementById('sb-handle');
  if (sbHandle) sbHandle.dataset.label = tl('handle');
  const tweaksHead = document.querySelector('.tweaks-head span');
  if (tweaksHead) tweaksHead.textContent = tl('settings');
  renderRail();
  if (E.currentFocusId) {
    updateSidebar(E.currentFocusId);
    updateRail(E.currentFocusId);
  }
}
document.querySelectorAll('.lang-btn').forEach(b => {
  b.addEventListener('click', () => setLanguage(b.dataset.lang));
});

/* ═══ TWEAKS PANEL ═════════════════════════════════════════════════ */
const tweaksPanel = document.getElementById('tweaks-panel');
let tweakOpen = false;

window.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === '__activate_edit_mode') showTweaks();
  if (e.data.type === '__deactivate_edit_mode') hideTweaks();
});

function showTweaks() { tweaksPanel.classList.add('open'); tweakOpen = true; }
function hideTweaks() {
  tweaksPanel.classList.remove('open'); tweakOpen = false;
  try { window.parent.postMessage({type:'__edit_mode_dismissed'}, '*'); } catch(e){}
}
document.getElementById('tweaks-close').addEventListener('click', hideTweaks);

// Tweaks: background texture
function setBackground(kind) {
  document.body.classList.remove('bg-paper','bg-linen','bg-plain');
  document.body.classList.add('bg-' + kind);
  document.querySelectorAll('#tw-bg .tweak-btn').forEach(b => b.classList.toggle('active', b.dataset.val === kind));
  persist({ bg: kind });
}
// Tweaks: tree density
function setDensity(kind) {
  const factor = kind === 'compact' ? 0.85 : 1.15;
  E.applyDensity(factor);
  document.querySelectorAll('#tw-density .tweak-btn').forEach(b => b.classList.toggle('active', b.dataset.val === kind));
  if (E.currentFocusId) E.transitionTo(E.currentFocusId, false);
  persist({ density: kind });
}
// Tweaks: card style
function setCardStyle(kind) {
  E.setCardStyle(kind);
  document.querySelectorAll('#tw-cards .tweak-btn').forEach(b => b.classList.toggle('active', b.dataset.val === kind));
  if (E.currentFocusId) E.transitionTo(E.currentFocusId, false);
  persist({ cardStyle: kind });
}

document.querySelectorAll('#tw-bg .tweak-btn').forEach(b => b.addEventListener('click', () => setBackground(b.dataset.val)));
document.querySelectorAll('#tw-density .tweak-btn').forEach(b => b.addEventListener('click', () => setDensity(b.dataset.val)));
document.querySelectorAll('#tw-cards .tweak-btn').forEach(b => b.addEventListener('click', () => setCardStyle(b.dataset.val)));

function persist(diff) {
  try { window.parent.postMessage({type:'__edit_mode_set_keys', edits: diff}, '*'); } catch(e){}
}

// Tell host we're tweakable, AFTER listeners exist
setTimeout(() => {
  try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e){}
}, 100);

/* ═══ INIT ═════════════════════════════════════════════════════════ */
function init() {
  // Apply defaults from TWEAK_DEFAULTS
  const D = window.TWEAK_DEFAULTS || {};
  setBackground(D.bg || 'paper');
  setDensity(D.density || 'spacious');
  setCardStyle(D.cardStyle || 'medallion');

  renderRail();
  E.transitionTo(E.FOCUS_ID, false);
  setTimeout(() => {
    if (E.currentFocusId) {
      updateSidebar(E.currentFocusId);
      sidebarEl.classList.add('open');
      const pos = E.calculateLayout(E.buildHourglass(E.currentFocusId));
      scrollToFocus(pos);
    }
  }, 60);
}

/* ═══ PENCIL EDIT BUTTON ═══════════════════════════════════════════ */
const editBtn = document.getElementById('edit-pencil-btn');
if (editBtn) editBtn.addEventListener('click', () => setEditMode(!editMode));

/* ═══ VIDEO PLAYER ══════════════════════════════════════════════════ */
window._playVideo = function(src) {
  // Pause background music
  if (window._musicPause) window._musicPause();
  let ov = document.getElementById('video-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'video-overlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;cursor:zoom-out';
    document.body.appendChild(ov);
  }
  ov.innerHTML = `
    <div style="position:relative;max-width:90vw;max-height:90vh" onclick="event.stopPropagation()">
      <video src="${src}" controls autoplay
        style="max-width:100%;max-height:85vh;border:3px solid #D4AE5E;box-shadow:0 8px 48px rgba(0,0,0,0.7);display:block"
        onended="document.getElementById('video-overlay').remove(); if(window._musicResume)window._musicResume()">
      </video>
      <button onclick="this.closest('#video-overlay').remove(); if(window._musicResume)window._musicResume()"
        style="position:absolute;top:-14px;right:-14px;width:28px;height:28px;border-radius:50%;background:#D4AE5E;border:none;cursor:pointer;font-size:16px;line-height:28px;text-align:center;color:#1A1410;box-shadow:0 2px 8px rgba(0,0,0,0.5)">×</button>
    </div>
  `;
  ov.style.display = 'flex';
  ov.addEventListener('click', () => {
    ov.remove();
    if (window._musicResume) window._musicResume();
  }, { once: true });
};

/* ═══ INIT ═════════════════════════════════════════════════════════ */
function init() {
  const D = window.TWEAK_DEFAULTS || {};
  setBackground(D.bg || 'paper');
  setDensity(D.density || 'spacious');
  setCardStyle(D.cardStyle || 'medallion');

  renderRail();
  E.transitionTo(E.FOCUS_ID, false);
  setTimeout(() => {
    if (E.currentFocusId) {
      updateSidebar(E.currentFocusId);
      sidebarEl.classList.add('open');
      const pos = E.calculateLayout(E.buildHourglass(E.currentFocusId));
      scrollToFocus(pos);
    }
  }, 60);
}

document.addEventListener('DOMContentLoaded', init);
if (document.readyState !== 'loading') init();

})();
