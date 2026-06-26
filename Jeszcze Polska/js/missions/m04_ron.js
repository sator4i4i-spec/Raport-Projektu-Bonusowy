// m04_ron.js — Misja 4: Rzeczpospolita Obojga Narodów (1569–1612)
window.JP = window.JP || {};

JP.M04 = (function () {

  // ── Mapa RON 18×12 ─────────────────────────────────────────────
  // Oś: Lublin (col8,row6) → port Gdańsk (col4,row1) → Inflanty (col9,row1) → Kreml (col14,row5)
  var MAP_M04 = [
    [3,3,3,3,3,3,3,3,2,0,0,2,2,2,2,2,2,2],  // 0  — Bałtyk rozszerzony do col7, Inflanty col9–10
    [3,3,2,2,0,0,0,0,0,0,0,0,2,2,2,2,2,2],  // 1  — Wybrzeże: port col4, Inflanty col9–10
    [2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2],  // 2  — Żmudź / rejon Pskowa
    [2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2],  // 3  — Litwa / Białoruś płn.
    [2,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,2,2],  // 4  — Droga NW—E (ku Moskwie)
    [2,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,2,2],  // 5  — Oś główna: Lublin–Kreml
    [2,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,2],  // 6  — Korona: Lublin col8
    [2,2,0,0,0,1,1,1,1,0,0,0,0,0,0,2,2,2],  // 7  — Małopolska / Podole
    [2,2,2,0,0,1,0,0,0,0,2,2,2,2,2,2,2,2],  // 8  — Kraków / stepy wschodnie
    [2,2,2,2,4,4,4,0,0,0,2,2,2,2,2,2,2,2],  // 9  — Karpaty
    [2,2,2,2,2,4,4,4,4,2,2,2,2,2,2,2,2,2],  // 10 — Karpaty głębokie
    [2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3],  // 11 — Morze Czarne (SE)
  ];

  // Dekoracje — lasy litewskie, ukraińskie stepy, puszcze
  var DECO_M04 = [
    // Lasy litewskie (centrum-północ)
    {c:3, r:2, img:'tree3'}, {c:6,  r:2, img:'tree4'}, {c:11, r:2, img:'tree4'},
    {c:2, r:3, s:2}, {c:5,  r:3, img:'tree3'}, {c:9,  r:3, img:'tree3'}, {c:11, r:3, s:2},
    {c:1, r:4, s:1}, {c:15, r:4, s:0},
    // Lasy polskie (zachód)
    {c:1, r:5, s:2}, {c:2,  r:6, s:0}, {c:1, r:6, img:'tree4'},
    {c:2, r:7, s:2}, {c:3,  r:7, s:0},
    // Puszcza litewska (pion wschodni)
    {c:13, r:3, s:0}, {c:14, r:3, s:2},
    {c:15, r:4, s:1},
    {c:16, r:5, s:0}, {c:15, r:6, s:2},
    // Stepy ukraińskie (południe)
    {c:3, r:8, s:1}, {c:6, r:8, s:2}, {c:8, r:8, s:0},
  ];

  // ── Config ─────────────────────────────────────────────────────
  var cfg = {
    id:    'm04',
    title: 'Rzeczpospolita Obojga Narodów',
    frame: 'Narodziny potęgi Obojga Narodów, złote czasy i triumfy na Wschodzie.',
    dates: { start: 1569, end: 1612 },
    objective: 'Jako Zygmunt August zawrzyj Unię Lubelską. Jako Batory — uderz na Psków. Jako Zygmunt III — otwórz drogę na Kreml.',
    introContext:
      'Zygmunt II August nie ma potomka. Gdy umrze — Polska i Litwa znowu staną się osobnymi państwami. ' +
      'Jedyne wyjście: unia <em>realna</em>, trwała, niezależna od dynastii. ' +
      'Jedź do Lublina i zmień historię.',

    npcs: {

      henryk_walezy: {
        id:'henryk_walezy', name:'Henryk Walezy — król elekcyjny',
        portrait:'grafiki/art/portraits/m04_henryk.png',
        lines:[
          'Miałem dwadzieścia dwa lata, gdy polska szlachta wybrała mnie — Francuza, królewicza — na swojego króla. Rok 1573. Pierwsza wolna elekcja w historii Polski.',
          'Byłem jednocześnie królem Francji i królem Polski. Gdy umarł mój brat Karol IX, Francja czekała na mnie z koroną. Wymknąłem się nocą z Wawelu.',
          'Rządziłem Polską zaledwie kilka miesięcy. Tron z wyboru to piękna idea — ale zawsze może przyjść lepsza oferta.',
        ],
      },

      szlachcic: {
        id:'szlachcic', name:'Szlachcic — poseł sejmowy',
        portrait:'grafiki/art/portraits/m04_szlachcic.png',
        lines:[
          'Umarł ostatni Jagiellończyk! Teraz to my, szlachta, wybieramy króla — każdy z nas, viritim, głosuje na polu elekcyjnym!',
          'To jest nasza złota wolność. Żaden tyran nas nie zniewoli — król będzie wybierany, nie dziedziczony.',
          'Choć... gdy każdy krzyczy swoje, a nikt nie słucha — czy taka wolność nie stanie się kiedyś naszą zgubą?',
        ],
      },

      anna_jagiellonka: {
        id:'anna_jagiellonka', name:'Anna Jagiellonka — ostatnia z rodu',
        portrait:'grafiki/art/portraits/m04_anna.png',
        lines:[
          'Jestem ostatnią z Jagiellonów. Ojciec, bracia — wszyscy odeszli. Na mnie kończy się ród.',
          'Szlachta wybrała Stefana Batorego — księcia Siedmiogrodu. Lecz tylko dlatego, że pojął mnie za żonę. To moje królewskie imię dało mu legalność.',
          'Przez nasze małżeństwo Batory jest prawowitym królem Polski. Pamiętaj o tym, gdy patrzysz na jego triumfy.',
        ],
      },

      // ── Faza Batorego ──────────────────────────────────────────
      zamoyski: {
        id:'zamoyski', name:'Jan Zamoyski — hetman i kanclerz',
        portrait:'grafiki/art/portraits/m04_zamoyski.png',
        lines:[
          'Trzy wyprawy i trzy zwycięstwa: Połock w 1579, Wielkie Łuki w 1580 — teraz idziemy pod Psków, ostatnią wielką twierdzę cara.',
          'Iwan Groźny widzi, że przegrywa na każdym froncie. Kiedy Psków padnie, car będzie musiał prosić o pokój.',
        ],
      },

      // ── Faza Zygmunta III ──────────────────────────────────────
      zolkiewski: {
        id:'zolkiewski', name:'Hetman Stanisław Żółkiewski',
        portrait:'grafiki/art/portraits/m04_zolkiewski.png',
        lines:[
          'Hetman polny koronny Stanisław Żółkiewski melduje: Kłuszyn zdobyty — 4 lipca 1610 roku.',
          'Mieliśmy co najwyżej sześć tysięcy ludzi. Moskali i Szwedów — ponad dwadzieścia tysięcy. Husaria szarżowała trzykrotnie. Za trzecim razem armia cara rozpadła się jak glina.',
          'Wasyl Szujski obalony. Bojarzy sami przyszli do nas z propozycją: proszą królewicza Władysława na tron carski. Polak — carem Rosji.',
        ],
      },

      bojar: {
        id:'bojar', name:'Bojar moskiewski — Iwan Mścisławski',
        portrait:'grafiki/art/portraits/m04_bojar.png',
        lines:[
          'Wasyl Szujski to tyran. Pod Kłuszynem stracił armię i wiarygodność — my, bojarzy, obaliliśmy go.',
          'Duma Bojarska jednomyślnie ofiarowuje koronę carską królewiczowi Władysławowi Wazie. Niech panuje nad Rusią.',
          'Polacy w Kremlu... Kto by w to uwierzył. Lecz to lepsze niż kolejna Smuta. Złożyłem przysięgę — i inni bojarscy panowie za mną.',
        ],
      },
    },

    hotspots: [

      // ── FAZA AUGUST (1569) ─────────────────────────────────────
      { id:'hs_lublin',   col:8,  row:6, type:'budynek', label:'Sejm w Lublinie — 1569',
        buildType:'unia', cost:0 },
      { id:'hs_port',     col:4,  row:1, type:'budynek', label:'Port w Gdańsku — flota',
        buildType:'port', cost:0 },
      { id:'hs_inflanty', col:9,  row:1, type:'budynek', label:'Inflanty — 1561',
        buildType:'inflanty', cost:0 },

      // ── FAZA BATORY (1576–1586) ────────────────────────────────
      { id:'hs_henryk',   col:3,  row:5, type:'npc',     label:'Henryk Walezy — uciekinier',
        npcId:'henryk_walezy' },
      { id:'hs_szlachcic',col:4,  row:7, type:'npc',     label:'Szlachcic elekcyjny',
        npcId:'szlachcic' },
      { id:'hs_anna',     col:5,  row:8, type:'npc',     label:'Anna Jagiellonka',
        npcId:'anna_jagiellonka' },
      { id:'hs_zamoyski', col:7,  row:3, type:'npc',     label:'Hetman Zamoyski',
        npcId:'zamoyski' },
      { id:'hs_pskow',    col:10, row:2, type:'battle',  label:'Oblężenie Pskowa — 1581' },

      // ── FAZA ZYGMUNT III (1596–1610) ─────────────────────────
      { id:'hs_warszawa',  col:6,  row:5, type:'budynek', label:'Warszawa — nowa stolica',
        buildType:'zamek', cost:0 },
      { id:'hs_zolkiewski',col:12, row:5, type:'npc',   label:'Hetman Żółkiewski',
        npcId:'zolkiewski' },
      { id:'hs_bojar',    col:14, row:5, type:'npc',     label:'Bojar Mścisławski',
        npcId:'bojar' },
      { id:'hs_kreml',    col:14, row:4, type:'battle',  label:'Kreml — 1610' },

      // ── Refusal (Moskwa niedostępna przed bitwą) ───────────────
      { id:'hs_moskwa_blok', col:15, row:5, type:'refusal', label:'Moskwa',
        refusalMsg:'Moskwa jeszcze nie zdobyta. Poprowadź husarię pod Kłuszyn.' },

      // ── Easter egg (husarz przy bramie Kremla) ─────────────────
      { id:'hs_egg',      col:15, row:4, type:'egg',     label:'Husarz skrzydlaty',
        eggId:'egg_m04_husarz' },
    ],

    milestoneLabels: [
      { year: '1569', label: '⚑ Unia Lubelska' },
      { year: '1570', label: '⚓ Port w Gdańsku' },
      { year: '1572', label: '⚑ Inflanty' },
      { year: '1581', label: '⚑ Oblężenie Pskowa' },
      { year: '1596', label: '🏛 Warszawa — stolica' },
      { year: '1610', label: '⚑ Kłuszyn' },
      { year: '1610', label: '💰 Husarz przy Kremlu' },
    ],

    outcome: {
      badge: '990 000 km² — szczyt potęgi.',
      text:  'W 1569 roku Unia Lubelska stworzyła Rzeczpospolitą Obojga Narodów. Stefan Batory odebrał Moskwie Inflanty, hetman Żółkiewski z garstką husarzy rozbił armię carów pod Kłuszynem, a polskie chorągwie zawisły nad Kremlem. W 1619 roku, po podpisaniu rozejmu w Dywilinie, Rzeczpospolita rozciągała się na niemal 990 000 km² — od Zatoki Ryskiej po Morze Czarne. Nigdy — ani wcześniej, ani po rozbiorach — Polska nie była tak ogromna.',
    },
  };

  var MILESTONE_IDX = {
    hs_lublin:    0,
    hs_port:      1,
    hs_inflanty:  2,
    hs_pskow:     3,
    hs_warszawa:  4,
    hs_kreml:     5,
    hs_egg:       6,
  };

  var QUEST_TEXTS_M04 = {
    hs_lublin:   'Unia zawarta! Jedź do Gdańska — zbuduj port i flotę.',
    hs_port:     'Flota gotowa! Jedź na północny wschód — zdobądź Inflanty.',
    hs_inflanty: 'Inflanty przyłączone! Zaraz nastanie czas Batorego — i wolnej elekcji.',
    hs_pskow:    'Psków oblężony! Batory triumfuje.',
    hs_warszawa: 'Warszawa nową stolicą! Porozmawiaj z Żółkiewskim.',
    hs_kreml:    'Kreml zdobyty! Szukaj husarza przy wschodniej bramie. 🦅',
    hs_egg:      'Garnizon w Kremlu — szczyt potęgi Rzeczpospolitej. ✓',
  };

  function updateQuestText(txt) {
    var el = document.getElementById('quest-text');
    if (el) el.textContent = txt;
  }

  // ── Stan misji ──────────────────────────────────────────────────
  var mstate = {};

  function _resetState() {
    mstate = {
      phase:        'august',   // 'august' | 'batory' | 'zygmunt'
      treasury:     400,
      uniaSealed:   false,
      portBuilt:    false,
      inflantyWon:  false,
      batoryActive: false,      // przejście do fazy Batorego
      henrykMet:    false,
      szlachcicMet: false,
      annaMet:      false,
      zamoyskiMet:  false,
      pskow:        false,      // bitwa pskowska (stub)
      zygmuntActive:false,      // przejście do fazy Zygmunta
      warszawaMoved:false,
      zolkiewskiMet:false,
      bojarMet:     false,
      kreml:        false,      // bitwa o Kreml (stub)
      eggCollected: false,
    };
  }

  // ── Pętla gry ───────────────────────────────────────────────────
  var rafId   = null;
  var _resize = null;
  var running = false;
  var lastTS  = 0;
  var imgs    = {};
  var cam     = { x: 0, y: 0 };
  var _mapSrc = '';

  var IMAGE_MAP = {
    tree1:    'grafika TS/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree1.png',
    tree2:    'grafika TS/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree2.png',
    tree3:    'grafika TS/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree3.png',
    tree4:    'grafika TS/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree4.png',
    castle:   'grafika TS/Tiny Swords (Free Pack)/Buildings/Yellow Buildings/Castle.png',
    monastery:'grafika TS/Tiny Swords (Free Pack)/Buildings/Yellow Buildings/Monastery.png',
    house1:   'grafika TS/Tiny Swords (Free Pack)/Buildings/Yellow Buildings/House1.png',
    pawnIdle: 'grafika TS/Tiny Swords (Free Pack)/Units/Yellow Units/Pawn/Pawn_Idle.png',
    pawnRun:  'grafika TS/Tiny Swords (Free Pack)/Units/Yellow Units/Pawn/Pawn_Run.png',
  };

  function loadImages(cb) {
    var keys = Object.keys(IMAGE_MAP), done = 0;
    keys.forEach(function (k) {
      var img = new Image();
      img.onload  = function () { imgs[k] = img; if (++done === keys.length) cb(); };
      img.onerror = function () {            if (++done === keys.length) cb(); };
      img.src = IMAGE_MAP[k];
    });
    if (!keys.length) cb();
  }

  function updateCamera(canvas) {
    var mapW = JP.Tilemap.pixelWidth(), mapH = JP.Tilemap.pixelHeight();
    var cw = canvas.width, ch = canvas.height;
    cam.x = Math.max(0, Math.min(mapW - cw, JP.Player.state.x - cw / 2));
    cam.y = Math.max(0, Math.min(mapH - ch, JP.Player.state.y - ch / 2));
  }

  function _drawLabels(ctx) {
    var T  = JP.Tilemap.T;
    var cw = ctx.canvas.width;
    ctx.save();
    ctx.font = 'bold 11px Georgia, serif';
    ctx.textAlign = 'center';

    var labels = [
      { text: '✝  PRUSY KRZYŻACKIE',  col: 2,  row: 0.4, color: '#cc5555' },
      { text: '⚓  GDAŃSK',            col: 4,  row: 1.4, color: '#4488cc' },
      { text: '⚑  INFLANTY',          col: 9,  row: 0.4, color: '#66aa44' },
      { text: '⚜  LITWA',             col: 9,  row: 3,   color: '#5577cc' },
      { text: '⚔  MOSKWA',            col: 15, row: 5.5, color: '#884444' },
      { text: '▲  KARPATY',           col: 6,  row: 9.5, color: '#888866' },
    ];

    labels.forEach(function (lb) {
      var x = lb.col * T - cam.x;
      var y = lb.row * T - cam.y;
      if (x < -80 || x > cw + 80) return;
      if (y < -20 || y > ctx.canvas.height + 20) return;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.strokeText(lb.text, x, Math.max(14, y));
      ctx.fillStyle = lb.color;
      ctx.fillText(lb.text, x, Math.max(14, y));
    });
    ctx.restore();
  }

  function loop(ts) {
    if (!running) return;
    var dt = Math.min((ts - lastTS) / 1000, 0.05);
    lastTS = ts;
    if (!JP.Dialogue.isOpen()) JP.Player.update(dt);
    JP.Hotspots.update(JP.Player.state.x, JP.Player.state.y);
    var canvas = document.getElementById('game-canvas');
    if (!canvas) { running = false; return; }
    updateCamera(canvas);
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    JP.Tilemap.render(ctx, cam.x, cam.y, imgs);
    _drawLabels(ctx);
    JP.Hotspots.render(ctx, cam.x, cam.y, imgs);
    JP.Player.render(ctx, cam.x, cam.y, imgs);
    rafId = requestAnimationFrame(loop);
  }

  function startLoop() { running = true; lastTS = performance.now(); rafId = requestAnimationFrame(loop); }
  function stopLoop()  { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } if (_resize) { window.removeEventListener('resize', _resize); _resize = null; } }

  // ── Interakcja ─────────────────────────────────────────────────
  var _interactLock = false;
  function handleInteract(e) {
    if (e.code !== 'Space' && e.code !== 'Enter') return;
    e.preventDefault();
    if (_interactLock) return;
    var h = JP.Hotspots.getNearest();
    if (!h) return;
    _interactLock = true;
    setTimeout(function () { _interactLock = false; }, 220);
    triggerHotspot(h);
  }

  // ── Skarbiec ───────────────────────────────────────────────────
  function updateTreasury() {
    var el = document.getElementById('treasury-val');
    if (el) el.textContent = mstate.treasury;
  }

  // ── Główna logika hotspotów ────────────────────────────────────
  function triggerHotspot(h) {

    // ── Refusal ──────────────────────────────────────────────────
    if (h.type === 'refusal') {
      JP.Dialogue.toast('⚔ ' + (h.refusalMsg || 'Nie tędy droga.'));
      return;
    }

    // ── Easter egg — husarz przy Kremlu ──────────────────────────
    if (h.type === 'egg') {
      if (h.collected) return;
      if (!mstate.kreml) {
        JP.Dialogue.toast('Najpierw zdobądź Kreml.');
        return;
      }
      JP.State.addEgg(h.eggId);
      JP.Hotspots.markCollected(h.id);
      mstate.eggCollected = true;
      mstate.treasury += 50;
      updateTreasury();
      JP.Dialogue.info(
        '🦅 Husarz przy Kremlu',
        'Stoimy w Kremlu! Polskie chorągwie nad Moskwą!\n\n' +
        'A nasz królewicz Władysław Waza? Bojarzy ogłosili go carem Rosji! ' +
        'Polski królewicz na tronie Moskwy — kto by w to uwierzył.\n\n' +
        'Garnizon polski utrzyma Kreml do roku 1612. Nigdy wcześniej, nigdy później — ' +
        'Polska nie sięgnęła tak daleko na wschód.',
        'A to ciekawe!',
        function () {
          checkMilestones('hs_egg');
        },
        'egg'
      );
      return;
    }

    // ── Bitwy — stuby (do wypełnienia) ───────────────────────────
    if (h.type === 'battle') {
      if (h.id === 'hs_pskow') {
        if (mstate.phase !== 'batory') {
          JP.Dialogue.toast('Najpierw przejmij dowodzenie jako Stefan Batory.');
          return;
        }
        if (mstate.pskow) { JP.Dialogue.toast('Psków oblężony. ✓'); return; }
        if (!mstate.zamoyskiMet) {
          JP.Dialogue.toast('Najpierw porozmawiaj z hetmanem Zamoyskim.');
          return;
        }
        stopLoop();
        JP.Player.pause();
        window.removeEventListener('keydown', handleInteract);
        JP.Combat.start('pskow', function () {
          startLoop();
          JP.Player.resume();
          window.addEventListener('keydown', handleInteract);
          mstate.pskow = true;
          JP.Hotspots.markBuilt('hs_pskow');
          checkMilestones('hs_pskow');
          setTimeout(function () {
            JP.Dialogue.info(
              '⚑ Rozejm w Jamie Zapolskim — 1582',
              'Iwan Groźny kapituluje. Car oddaje Rzeczpospolitej Inflanty i ziemię połocką — całkowity triumf Batorego.\n\n' +
              'Kolejnych pięć lat to czas burzliwych przygotowań: reformy armii, plany nowych kampanii, ' +
              'napięcia z Habsburgami i Szwecją. Batory marzy o wielkim marszu na Moskwę — lecz los ma inne plany.',
              'Dalej',
              function () {
                setTimeout(_showBatoryDeath, 2000);
              },
              'bitwa'
            );
          }, 800);
        });
        return;
      }

      if (h.id === 'hs_kreml') {
        if (mstate.phase !== 'zygmunt') {
          JP.Dialogue.toast('Najpierw przejdź do fazy Zygmunta III Wazy.');
          return;
        }
        if (!mstate.zolkiewskiMet) {
          JP.Dialogue.toast('Najpierw porozmawiaj z hetmanem Żółkiewskim.');
          return;
        }
        if (mstate.kreml) { JP.Dialogue.toast('Kreml zdobyty. ✓'); return; }
        stopLoop();
        JP.Player.pause();
        window.removeEventListener('keydown', handleInteract);
        JP.Combat.start('kluszynk', function () {
          startLoop();
          JP.Player.resume();
          window.addEventListener('keydown', handleInteract);
          mstate.kreml = true;
          JP.Hotspots.markBuilt('hs_kreml');
          JP.Hotspots.markCollected('hs_kreml');
          JP.Hotspots.markBuilt('hs_moskwa_blok');
          _setMapThumb('zintegrowana platforma edu/RP XVI-XVIIw.jpg');
          setTimeout(function () {
            JP.Dialogue.info(
              '🦅 Kreml zdobyty — 1610',
              'Polskie chorągwie zawisły nad Kremlem.\n\n' +
              'Bojarzy sami przyszli z propozycją — ofiarowali koronę carską królewiczowi Władysławowi Wazie. ' +
              'Garnizon polski utrzyma Kreml przez dwa lata.\n\n' +
              'Psst… przy wschodniej bramie coś błyszczy. Może warto zajrzeć?',
              'Dalej',
              function () { checkMilestones('hs_kreml'); },
              'bitwa'
            );
          }, 800);
        });
        return;
      }

      return;
    }

    // ── FAZA AUGUST ──────────────────────────────────────────────

    if (h.id === 'hs_lublin') {
      if (h.built) { JP.Dialogue.toast('Unia Lubelska zawarta — 1 lipca 1569. ✓'); return; }
      JP.Dialogue.confirm(
        'Unia Lubelska — Lublin, 1 VII 1569',
        'Zygmunt August ogłasza unię realną: Polska i Litwa tworzą jedno ciało — Rzeczpospolitą Obojga Narodów. ' +
        'Wspólny sejm, wspólna polityka zagraniczna, odrębne wojska i skarb.',
        function () {
          mstate.uniaSealed = true;
          JP.Hotspots.markBuilt('hs_lublin');
          checkMilestones('hs_lublin');
          JP.Dialogue.toast('📜 Unia Lubelska zawarta! Jedź teraz na wybrzeże — zbuduj port i stwórz polską flotę.');
        },
        null,
        'Zapieczętuj ✓', 'dokument'
      );
      return;
    }

    if (h.id === 'hs_port') {
      if (!mstate.uniaSealed) {
        JP.Dialogue.toast('Najpierw zawrzyj Unię Lubelską w Lublinie.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('Port w Gdańsku wybudowany. ✓'); return; }
      JP.Dialogue.confirm(
        'Port w Gdańsku — polska flota bałtycka',
        'Rzeczpospolita ma dostęp do Bałtyku przez Gdańsk. Silna flota to kontrola nad handlem morskim ' +
        'i możliwość blokady portów wroga. Zygmunt August rozbudowuje port i zamawia okręty wojenne.',
        function () {
          mstate.portBuilt = true;
          JP.Hotspots.markBuilt('hs_port');
          checkMilestones('hs_port');
          JP.Dialogue.toast('⚓ Flota gotowa! Teraz jedź na północny wschód — zdobądź Inflanty.');
        },
        null,
        'Zbuduj port ⚓', 'budowla'
      );
      return;
    }

    if (h.id === 'hs_inflanty') {
      if (!mstate.portBuilt) {
        JP.Dialogue.toast('Najpierw zbuduj port w Gdańsku — flota otworzy drogę na Inflanty.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('Inflanty przyłączone do Rzeczpospolitej. ✓'); return; }
      JP.Dialogue.confirm(
        'Inflanty — 1561',
        'Potężna armia Moskwy zaatakowała słabe państwo rycerzy inflanckich. ' +
        'Ich przywódca, Gotthard Kettler, ze strachu oddał swoje ziemie i porty bałtyckie ' +
        'królowi Polski — w zamian za ratunek i obronę. ' +
        'Rzeczpospolita zyskuje strategiczne wybrzeże na północy.',
        function () {
          mstate.inflantyWon = true;
          JP.Hotspots.markBuilt('hs_inflanty');
          checkMilestones('hs_inflanty');
          _switchToBatory();
        },
        null,
        'Przyjmij Inflanty ⚑', 'budowla'
      );
      return;
    }

    // ── NPC — Faza Batorego ───────────────────────────────────────

    if (h.id === 'hs_henryk') {
      if (mstate.phase === 'august') {
        JP.Dialogue.toast('Henryk Walezy pojawi się po śmierci Zygmunta Augusta.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.henryk_walezy, function () {
        mstate.henrykMet = true;
      });
      return;
    }

    if (h.id === 'hs_szlachcic') {
      if (mstate.phase === 'august') {
        JP.Dialogue.toast('Wolna elekcja nastąpi po śmierci Zygmunta Augusta.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.szlachcic, function () {
        mstate.szlachcicMet = true;
        if (!mstate.batoryActive) {
          checkMilestones('hs_batory');
          mstate.batoryActive = true;
        }
      });
      return;
    }

    if (h.id === 'hs_anna') {
      if (mstate.phase === 'august') {
        JP.Dialogue.toast('Anna Jagiellonka czeka na następcę brata.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.anna_jagiellonka, function () {
        mstate.annaMet = true;
      });
      return;
    }

    if (h.id === 'hs_zamoyski') {
      if (mstate.phase !== 'batory') {
        JP.Dialogue.toast('Zamoyski służy Batoremu — przejdź najpierw do jego fazy.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.zamoyski, function () {
        mstate.zamoyskiMet = true;
        if (!mstate.pskow) {
          JP.Dialogue.toast('⚔ Zamoyski wskazuje kierunek — jedź pod Psków!');
        }
      });
      return;
    }

    // ── FAZA ZYGMUNT III ─────────────────────────────────────────

    if (h.id === 'hs_warszawa') {
      if (mstate.phase !== 'zygmunt') {
        JP.Dialogue.toast('Przeniesienie stolicy nastąpi za panowania Zygmunta III.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('Warszawa — nowa stolica Rzeczpospolitej. ✓'); return; }
      JP.Dialogue.confirm(
        'Warszawa — nowa stolica — 1596',
        'Zygmunt III Waza przenosi dwór z Krakowa do Warszawy. ' +
        'Miasto leży w centrum Rzeczpospolitej — bliżej Litwy, bliżej wschodnich granic. ' +
        'Kraków pozostanie miejscem koronacji i pochówku królów, lecz władza przenosi się na północ.',
        function () {
          mstate.warszawaMoved = true;
          JP.Hotspots.markBuilt('hs_warszawa');
          checkMilestones('hs_warszawa');
          JP.Dialogue.toast('🏛 Warszawa nową stolicą! Teraz jedź na wschód — porozmawiaj z Żółkiewskim.');
        },
        null,
        'Przenieś stolicę 🏛', 'budowla'
      );
      return;
    }

    if (h.id === 'hs_zolkiewski') {
      if (mstate.phase !== 'zygmunt') {
        JP.Dialogue.toast('Żółkiewski działa w imieniu Zygmunta III — musisz najpierw przejść tę fazę.');
        return;
      }
      if (!mstate.warszawaMoved) {
        JP.Dialogue.toast('Najpierw przenieś stolicę do Warszawy.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.zolkiewski, function () {
        mstate.zolkiewskiMet = true;
        JP.Hotspots.markBuilt('hs_zolkiewski');
        if (!mstate.kreml) {
          JP.Dialogue.toast('Hetman gotowy. Jedź pod Kreml — tam czeka husaria!');
        }
      });
      return;
    }

    if (h.id === 'hs_bojar') {
      if (mstate.phase !== 'zygmunt') {
        JP.Dialogue.toast('Bojar jest dostępny po kampanii wschodniej.');
        return;
      }
      if (!mstate.kreml) {
        JP.Dialogue.toast('Najpierw zdobądź Kreml — bojar jeszcze nie przyszedł z ofertą.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.bojar, function () {
        mstate.bojarMet = true;
      });
      return;
    }

    // Fallback
    var npc = h.npcId && cfg.npcs[h.npcId];
    if (npc) JP.Dialogue.open(npc);
  }

  // ── Śmierć Augusta — pełnoekranowy overlay ──────────────────────
  function _showAugustDeath() {
    stopLoop();
    JP.Player.pause();
    window.removeEventListener('keydown', handleInteract);

    var scene = document.querySelector('.game-scene');
    var ov = document.createElement('div');
    ov.className = 'win-overlay';
    ov.innerHTML =
      '<div class="win-scroll">' +
        '<div class="win-ornament">✦ ✦ ✦</div>' +
        '<h2 class="win-badge">1572 rok.</h2>' +
        '<p class="win-text">' +
          'Zygmunt II August zmarł w wieku 51 lat — bezpotomnie. ' +
          'Wygasła dynastia Jagiellonów, która rządziła Polską przez dwa wieki.<br><br>' +
          'Pierwszym królem z wolnej elekcji został Henryk Walezy — Francuz, królewicz. ' +
          'Rządził zaledwie kilka miesięcy, po czym nocą wymknął się z Wawelu na tron Francji.<br><br>' +
          'Kolejna elekcja. Szlachta wybrała Stefana Batorego — ale tylko dlatego, że pojął za żonę ' +
          'Annę Jagiellonkę, ostatnią z rodu. To jej imię dało mu legalność.' +
        '</p>' +
        '<div class="win-btn-row">' +
          '<button class="btn-primary" id="btn-batory-start">Dalej jako Batory →</button>' +
        '</div>' +
      '</div>';
    scene.appendChild(ov);

    document.getElementById('btn-batory-start').addEventListener('click', function () {
      scene.removeChild(ov);
      // Rozjaśnij mapę boczną
      var mapImg = document.getElementById('map-jagiello');
      if (mapImg) mapImg.style.filter = 'brightness(0.75)';
      _updatePhaseLabel('Stefan Batory · 1576–1586');
      updateQuestText('Faza Batorego. Na południu: Anna Jagiellonka i szlachcic elekcyjny. Na zachodzie: Henryk Walezy. Potem Zamoyski → Psków.');
      startLoop();
      JP.Player.resume();
      window.addEventListener('keydown', handleInteract);
      JP.Dialogue.toast('⚔ Batory na tronie! Zanim ruszysz na Psków — odwiedź Annę Jagiellonkę (południe), szlachcica (zachód od niej) i Henryka Walezego (dalej na zachód).');
    });
  }

  // ── Przejście Augusta → Batory ──────────────────────────────────
  function _switchToBatory() {
    mstate.phase = 'batory';
    JP.Player.setHeadSymbol('crown');
    setTimeout(_showAugustDeath, 400);
  }

  // ── Śmierć Batorego — pełnoekranowy overlay ─────────────────────
  function _showBatoryDeath() {
    stopLoop();
    JP.Player.pause();
    window.removeEventListener('keydown', handleInteract);

    var scene = document.querySelector('.game-scene');
    var ov = document.createElement('div');
    ov.className = 'win-overlay';
    ov.innerHTML =
      '<div class="win-scroll">' +
        '<div class="win-ornament">✦ ✦ ✦</div>' +
        '<h2 class="win-badge">1586 rok.</h2>' +
        '<p class="win-text">' +
          'Stefan Batory umarł nagle w wieku 53 lat. ' +
          'Pokonał Iwana Groźnego — zmusił cara do oddania Inflant i ziemi połockiej. ' +
          'Żaden król Polski nie zapędził Moskwy tak daleko w defensywę.<br><br>' +
          'Szlachta zbiera się na kolejną wolną elekcję. ' +
          'Wybór padnie na Zygmunta III Wazę — siostrzeńca Anny Jagiellonki i króla Szwecji. ' +
          'Na wschodzie zaczyna wrzeć. Nadchodzi czas jeszcze większych triumfów.' +
        '</p>' +
        '<div class="win-btn-row">' +
          '<button class="btn-primary" id="btn-zygmunt-start">Dalej jako Zygmunt III →</button>' +
        '</div>' +
      '</div>';
    scene.appendChild(ov);

    document.getElementById('btn-zygmunt-start').addEventListener('click', function () {
      scene.removeChild(ov);
      mstate.phase = 'zygmunt';
      mstate.zygmuntActive = true;
      JP.Player.setHeadSymbol('crown');
      _updatePhaseLabel('Zygmunt III Waza · 1587–1612');
      updateQuestText('Zygmunt III na tronie. Przenieś stolicę do Warszawy, potem idź na wschód.');
      startLoop();
      JP.Player.resume();
      window.addEventListener('keydown', handleInteract);
      JP.Dialogue.toast('👑 Zygmunt III na tronie! Najpierw przenieś stolicę do Warszawy, potem ruszaj na wschód.');
    });
  }

  function _updatePhaseLabel(txt) {
    var el = document.getElementById('map-phase-label');
    if (el) el.textContent = txt;
  }

  function _setMapThumb(src) {
    _mapSrc = src;
    var img2 = document.getElementById('map-ron');
    if (img2) img2.style.opacity = '1';
    _updatePhaseLabel('Rzeczpospolita u szczytu · 1610');
  }

  // ── Milestones ──────────────────────────────────────────────────
  function checkMilestones(doneId) {
    var flags = [
      mstate.uniaSealed,
      mstate.portBuilt,
      mstate.inflantyWon,
      mstate.pskow,
      mstate.warszawaMoved,
      mstate.kreml,
    ];
    var count = flags.filter(Boolean).length;
    var fill = document.getElementById('timeline-fill');
    if (fill) fill.style.height = Math.round((count / 6) * 100) + '%';

    var idx = MILESTONE_IDX[doneId];
    if (idx !== undefined) {
      var labels = document.querySelectorAll('.milestone');
      if (labels[idx]) labels[idx].classList.add('achieved');
    }

    if (QUEST_TEXTS_M04[doneId]) updateQuestText(QUEST_TEXTS_M04[doneId]);

    if (flags.every(Boolean)) {
      setTimeout(function () {
        (function waitDlg() {
          if (JP.Dialogue.isOpen()) { setTimeout(waitDlg, 300); return; }
          setTimeout(showWin, 2500);
        })();
      }, 300);
    }
  }

  // ── Ekran wygranej ──────────────────────────────────────────────
  function showWin() {
    stopLoop();
    JP.Player.unbindKeys();
    window.removeEventListener('keydown', handleInteract);
    JP.State.completeMission(cfg.id);
    var scene = document.querySelector('.game-scene');
    if (!scene) return;
    var win = document.createElement('div');
    win.className = 'win-overlay';
    win.innerHTML =
      '<div class="win-scroll">' +
        '<div class="win-ornament">✦ ✦ ✦</div>' +
        '<h2 class="win-badge">' + cfg.outcome.badge + '</h2>' +
        '<p class="win-text">' + cfg.outcome.text + '</p>' +
        '<div class="win-btn-row">' +
          '<button class="btn-primary" id="win-next">Następna misja →</button>' +
        '</div>' +
      '</div>';
    scene.appendChild(win);
    document.getElementById('win-next').addEventListener('click', function () { JP.Engine.showScene('mission', { missionId: 'm05' }); });
  }

  // ── Montaż sceny ───────────────────────────────────────────────
  function mountMission(container) {
    _resetState();
    _mapSrc = 'zintegrowana platforma edu/jagiello.jpg';
    JP.Tilemap.setMap(MAP_M04, DECO_M04);

    container.innerHTML =
      '<div class="mission-layout">' +

        '<aside class="side-panel" id="side-panel">' +
          '<div class="side-panel__header">' +
            '<span class="side-panel__crown">⚜</span>' +
            '<span class="side-panel__label">Rzeczpospolita</span>' +
          '</div>' +

          '<div class="poland-map">' +
            '<div class="poland-thumb-wrap" id="poland-thumb-wrap">' +
              '<div class="map-crossfade" style="position:relative;width:100%;">' +
                '<img id="map-jagiello" class="poland-thumb"' +
                '     src="zintegrowana platforma edu/jagiello.jpg"' +
                '     alt="Polska — Zygmunt August"' +
                '     style="width:100%;display:block;filter:brightness(0.42);" />' +
                '<img id="map-ron" class="poland-thumb"' +
                '     src="zintegrowana platforma edu/RP XVI-XVIIw.jpg"' +
                '     alt="Rzeczpospolita u szczytu"' +
                '     style="position:absolute;top:0;left:0;width:100%;opacity:0;transition:opacity 1.8s ease;filter:brightness(0.42);" />' +
              '</div>' +
              '<span class="poland-thumb-hint">🔍 kliknij</span>' +
            '</div>' +
            '<div id="map-phase-label" style="text-align:center;font-size:0.7rem;color:var(--gold);margin-top:4px;font-family:var(--font-serif);">Zygmunt II August · 1569</div>' +
          '</div>' +

          '<div class="side-quest">' +
            '<div class="side-quest__label">Cel misji</div>' +
            '<span id="quest-text">' + cfg.objective + '</span>' +
          '</div>' +

          '<div class="timeline">' +
            '<div class="timeline__label">Oś czasu · ' + cfg.dates.start + '–' + cfg.dates.end + '</div>' +
            '<div class="timeline__milestones">' +
              cfg.milestoneLabels.map(function(m){
                return '<div class="milestone"><span class="ms-year">' + m.year + '</span><span class="ms-label">' + m.label + '</span></div>';
              }).join('') +
            '</div>' +
          '</div>' +

          '<div class="hud-treasury" style="margin-top:12px;text-align:center;">' +
            '<span class="treasury-icon">💰</span>' +
            '<span id="treasury-val">' + mstate.treasury + '</span>' +
          '</div>' +

          '<div class="side-controls">' +
            '<kbd>W A S D</kbd> ruch &nbsp;·&nbsp; <kbd>Spacja</kbd> akcja' +
          '</div>' +
        '</aside>' +

        '<main class="game-scene">' +
          '<div class="scene-hud">' +
            '<button class="btn-back" id="btn-back">← Menu główne</button>' +
            '<div class="hud-mission-title">' + cfg.title + ' · ' + cfg.dates.start + '–' + cfg.dates.end + '</div>' +
          '</div>' +

          '<div class="mission-intro" id="mission-intro">' +
            '<div class="intro-scroll">' +
              '<div class="intro-ornament">✦ ✦ ✦</div>' +
              '<h2 class="intro-title">' + cfg.title + '</h2>' +
              '<p class="intro-frame">' + cfg.frame + '</p>' +
              '<p class="intro-context">' + cfg.introContext + '</p>' +
              '<p class="intro-objective"><strong>Cel:</strong> ' + cfg.objective + '</p>' +
              '<button class="btn-primary" id="btn-start-mission">Rozpocznij misję ▶</button>' +
            '</div>' +
          '</div>' +

          '<div id="canvas-wrap" class="canvas-wrap">' +
            '<canvas id="game-canvas"></canvas>' +
          '</div>' +
        '</main>' +

      '</div>';

    document.getElementById('btn-back').addEventListener('click', function () {
      stopLoop();
      JP.Player.unbindKeys();
      window.removeEventListener('keydown', handleInteract);
      JP.Tilemap.resetMap();
      JP.Engine.showScene('hub');
    });

    document.getElementById('btn-start-mission').addEventListener('click', function () {
      document.getElementById('mission-intro').classList.add('hidden');
      JP.Audio.play('explore');
      JP.Player.resume();
      JP.Player.bindKeys();
      window.addEventListener('keydown', handleInteract);
    });

    document.getElementById('poland-thumb-wrap').addEventListener('click', function () {
      var src = mstate.kreml
        ? 'zintegrowana platforma edu/RP XVI-XVIIw.jpg'
        : 'zintegrowana platforma edu/jagiello.jpg';
      var lb = document.createElement('div');
      lb.className = 'map-lightbox';
      lb.innerHTML = '<span class="map-lightbox-close">✕</span><img src="' + src + '" alt="Mapa Rzeczpospolitej" />';
      document.body.appendChild(lb);
      lb.addEventListener('click', function () { document.body.removeChild(lb); });
    });

    _initBackground();
  }

  function _initBackground() {
    var wrap   = document.getElementById('canvas-wrap');
    var canvas = document.getElementById('game-canvas');
    _resize = function () { canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight; };
    _resize();
    window.addEventListener('resize', _resize);

    JP.Hotspots.init(cfg.hotspots);
    JP.Player.init(8, 6);
    JP.Player.pause();
    JP.Player.setHeadSymbol('crown'); // Zygmunt August — król

    loadImages(startLoop);
  }

  return {
    config:       cfg,
    mountMission: mountMission,
  };

})();
