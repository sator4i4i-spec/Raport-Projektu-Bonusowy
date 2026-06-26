// m03_jagiello.js — Misja 3: Jadwiga → Jagiełło → Grunwald (1384–1410)
window.JP = window.JP || {};

JP.M03 = (function () {

  // ── Mapa RON 18×12 ─────────────────────────────────────────────
  // H-kształt ścieżek: dwa piony col5 i col12, dwa poziomy row4 i row7
  var MAP_M03 = [
    [3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2],  // 0  — Bałtyk + Zakon (N)
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],  // 1  — Zakon Krzyżacki (wrogi)
    [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],  // 2  — Mazowsze N + Litwa
    [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],  // 3  — Mazowsze / Polska środk.
    [2,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,2],  // 4  — Droga W-E (Polska–Litwa)
    [2,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,2],  // 5  — start col5,row5
    [2,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,2],  // 6  — środek H
    [2,2,0,0,0,1,1,1,1,1,1,1,1,0,0,0,2,2],  // 7  — Droga W-E (Małopolska)
    [2,2,2,0,0,1,0,0,0,0,0,0,0,0,2,2,2,2],  // 8  — Wawel przy col5
    [2,2,2,2,4,4,4,0,0,0,0,2,2,2,2,2,2,2],  // 9  — Karpaty zachodnie
    [2,2,2,2,2,4,4,4,4,2,2,2,2,2,2,2,2,2],  // 10 — Łańcuch Karpatów
    [2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3],  // 11 — Morze Czarne (S, 5 kafli)
  ];

  // Gęste lasy litewskie (prawy pion) + mazowieckie (środek)
  var DECO_M03 = [
    // lasy polskie (lewy pion i centrum)
    {c:3, r:2, img:'tree3'}, {c:9,  r:2, img:'tree3'}, {c:10, r:2, s:1}, {c:14, r:2, s:0},
    {c:2, r:3, s:2}, {c:8,  r:3, img:'tree4'}, {c:11, r:3, s:1}, {c:15, r:3, s:2},
    {c:1, r:4, s:1}, {c:14, r:4, img:'tree4'},
    {c:1, r:5, s:0}, {c:7,  r:5, s:2}, {c:9,  r:5, s:0}, {c:15, r:5, img:'tree3'},
    {c:2, r:6, s:2}, {c:7,  r:6, s:1}, {c:9,  r:6, s:2}, {c:15, r:6, s:0},
    {c:2, r:7, s:0},
    // lasy litewskie — gęste (prawy pion)
    {c:13, r:3, s:0}, {c:14, r:3, s:1},
    {c:13, r:5, s:2}, {c:14, r:5, s:0}, {c:15, r:5, s:2},
    {c:13, r:6, s:1}, {c:14, r:6, s:0},
    // stepy / południe
    {c:3, r:8, s:1}, {c:7, r:8, s:2}, {c:10, r:8, s:0},
  ];

  // ── Config ─────────────────────────────────────────────────────
  var cfg = {
    id:    'm03',
    title: 'Jadwiga · Jagiełło · Grunwald',
    frame: 'Unia z Litwą i złamanie potęgi Krzyżaków',
    dates: { start: 1384, end: 1410 },
    objective: 'Najpierw poprowadź Jadwigę — od koronacji po ślub z Jagiełłą. Potem stań na polach Grunwaldu.',
    introContext:
      'Ludwik Węgierski umarł bez syna. Koronę przejęła jego córka Jadwiga — koronowana <em>królem</em>, nie królową. ' +
      'Pojawił się kandydat na męża: Jagiełło, pogański książę Litwy.',

    npcs: {
      arcybiskup: {
        id:'arcybiskup', name:'Arcybiskup Bodzanta',
        portrait:'grafiki/art/portraits/m03_bodzanta.png',
        lines:[
          'Na mocy praw dziedzictwa — ogłaszam cię królem Polski. Nie królową, lecz królem. Tak głosi tradycja i tak nakazuje prawo.',
          'Przyjmij koronę, Jadwigo. To ciężar, nie ozdoba.',
          'Polska czeka na swojego króla.',
        ],
      },
      jagiello_narzeczony: {
        id:'jagiello_narzeczony', name:'Jagiełło',
        portrait:'grafiki/art/portraits/m03_jagiello.png',
        lines:[
          'Przyjmuję chrzest i imię Władysław. Wyrzekam się bogów przodków — przyjmuję Chrystusa.',
          'Przysięgam tobie, Jadwigo — bronić tej ziemi jak własnej, na zawsze.',
        ],
      },
      jagiello_krewo: {
        id:'jagiello_krewo', name:'Jagiełło — Wielki Książę Litwy',
        portrait:'grafiki/art/portraits/m03_jagiello.png',
        lines:[
          'Jestem Jagiełło, wielki książę Litwy. Przyjmuję warunki, królu Polski.',
          'Przyjmę chrzest i imię chrześcijańskie. Poślubię cię i złączę Litwę z Polską na wieki.',
          'To sojusz, którego Zakon Krzyżacki się nie spodziewa.',
        ],
      },
      rektor: {
        id:'rektor', name:'Rektor Akademii',
        portrait:'grafiki/art/portraits/m03_rektor.png',
        lines:[
          'Dzięki hojności Najjaśniejszego Pana, Kraków znów stanie się sercem nauki w Europie.',
          'Testament Jadwigi spełniony — jej kosztowności fundują tę uczelnię po wiek wieków.',
        ],
      },
      witold: {
        id:'witold', name:'Witold — Wielki Książę Litwy',
        portrait:'grafiki/art/portraits/m03_witold.png',
        lines:[
          'Zbudujemy most pontonowy na Wiśle, zaskoczymy Krzyżaków i uderzymy prosto na Malbork!',
          'Cofniemy się pozornie prawym skrzydłem — gdy ruszą za nami w pogoń, okrążymy ich.',
          '15 lipca. Grunwald. Miej wojsko gotowe o świcie.',
        ],
      },
      herold_ulricha: {
        id:'herold_ulricha', name:'Herold Ulricha von Jungingen',
        portrait:'grafiki/art/portraits/m03_ulrich.png',
        lines:[
          'Ulrich von Jungingen przesyła te dwa miecze, by dodać wam odwagi do walki!',
          'Czekamy na was na polach Grunwaldu. Niech Bóg rozsądzi, kto ma rację.',
        ],
      },
    },

    hotspots: [
      // Jadwiga — jeden zamek Wawel, dwa zdarzenia (koronacja → ślub)
      { id:'hs_wawel',    col:5,  row:8, type:'budynek', label:'Wawel — Kraków',              buildType:'zamek', cost:0 },
      { id:'hs_unia',     col:12, row:3, type:'npc',     label:'Unia krewska — Krewo 1385',   npcId:'jagiello_krewo'      },
      // Jagiełło
      { id:'hs_akademia', col:4,  row:7, type:'budynek', label:'Akademia Krakowska 1400',      buildType:'akademia', cost:0 },
      { id:'hs_witold',   col:12, row:7, type:'npc',     label:'Narada z Witoldem — Brześć',  npcId:'witold'              },
      { id:'hs_grunwald', col:7,  row:2, type:'battle',  label:'Grunwald — 15 VII 1410'                                   },
      // Stałe
      { id:'hs_zakon',    col:8,  row:1, type:'refusal', label:'Zamek Malborski',
        refusalMsg:'To terytorium Zakonu Krzyżackiego. Zbierz najpierw sojuszników.' },
      { id:'hs_egg',      col:8,  row:5, type:'egg',     label:'Skarb Jadwigi', eggId:'egg_m03_skarb', hidden: true },
    ],

    milestoneLabels: [
      { year: '1384', label: '⚑ Koronacja Jadwigi' },
      { year: '1385', label: '⚑ Unia krewska' },
      { year: '1386', label: '⚑ Chrzest i ślub' },
      { year: '1400', label: '⚑ Akademia Krakowska' },
      { year: '1409', label: '⚑ Narada — Brześć' },
      { year: '1410', label: '⚑ Grunwald' },
    ],

    outcome: {
      badge: 'Grunwald — tu złamano potęgę Zakonu.',
      text:  '15 lipca 1410 roku, na polach Grunwaldu, połączone wojska polsko-litewskie rozgromiły Zakon Krzyżacki. Wielki mistrz Ulrich von Jungingen zginął w boju. Zakon nigdy nie odzyska dawnej potęgi — a ziemie, które zagrabił Polsce, z czasem do niej wrócą. Wiek Jagiellonów właśnie się zaczął.',
    },
  };

  var MILESTONE_IDX = {
    hs_wawel_koronacja: 0,
    hs_unia:            1,
    hs_wawel_slub:      2,
    hs_akademia:        3,
    hs_witold:          4,
    hs_grunwald:        5,
  };

  var QUEST_TEXTS_M03 = {
    hs_wawel_koronacja: 'Jadwiga koronowana! Jedź do Krewo — zawrzyj unię z Jagiełłą.',
    hs_unia:            'Unia krewska zawarta! Wróć na Wawel — czas na chrzest i ślub.',
    hs_wawel_slub:      'Teraz grasz jako Jagiełło. Odnów Akademię Krakowską (1400).',
    hs_akademia:        'Akademia odnowiona! Naradzaj się z Witoldem w Brześciu.',
    hs_witold:          'Plan gotowy. Ruszaj pod Grunwald — 15 VII 1410!',
    hs_grunwald:        'Grunwald — zwycięstwo! Zakon złamany. ✓',
  };

  function updateQuestText(txt) {
    var el = document.getElementById('quest-text');
    if (el) el.textContent = txt;
  }

  // ── Stan misji ──────────────────────────────────────────────────
  var mstate = {};

  function _resetState() {
    mstate = {
      phase:          'jadwiga', // 'jadwiga' | 'jagiello'
      jadwigaCoroned: false,
      jadwigaMarried: false,
      uniaAccepted:   false,
      akademiaRenewed:false,
      witoldMet:      false,
      grunwaldWon:    false,
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
    var T = JP.Tilemap.T;
    var cw = ctx.canvas.width;
    ctx.save();
    ctx.font = 'bold 11px Georgia, serif';
    ctx.textAlign = 'center';
    var labels = [
      { text: '✝  ZAKON KRZYŻACKI', col: 9,   row: 0.5, color: '#cc5555' },
      { text: 'CZECHY',             col: 1,   row: 7,   color: '#88aa99' },
      { text: 'RUŚ',                col: 17,  row: 5,   color: '#bb9966' },
      { text: 'WĘGRY',              col: 5,   row: 11,  color: '#aa9977' },
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

  function triggerHotspot(h) {

    // ── Refusal / egg ────────────────────────────────────────────
    if (h.type === 'refusal') {
      JP.Dialogue.toast('⚔ ' + (h.refusalMsg || 'Nie tędy droga.'));
      return;
    }
    if (h.type === 'egg') {
      if (h.collected) return;
      JP.State.addEgg(h.eggId);
      JP.Hotspots.markCollected(h.id);
      JP.Dialogue.info(
        '💍 Klejnoty Jadwigi',
        'Za wawelską skrzynią kryje się złoty pierścień z rubinem — z królewskiej komnaty Jadwigi.\n\n' +
        'Gdy Jadwiga umierała w roku 1399, mając zaledwie dwadzieścia pięć lat, napisała testament. ' +
        'Wszystkie swoje klejnoty, złoto i kosztowności przekazała na Akademię Krakowską — uczelnię, ' +
        'którą odrodziła razem z Jagiełłą.\n\n' +
        'To dzięki jej biżuterii polscy żacy mogli studiować przez kolejne stulecia. ' +
        'Mówią, że jeden pierścień zatrzymał się gdzieś na Wawelu i nie dotarł do skarbnika...',
        'A to ciekawe!',
        null, 'grafiki/art/portraits/m03_jadwiga.png'
      );
      return;
    }

    // ── FAZA JADWIGI ─────────────────────────────────────────────
    if (h.id === 'hs_wawel') {
      if (!mstate.jadwigaCoroned) {
        // Pierwsze wejście — koronacja
        JP.Dialogue.open(cfg.npcs.arcybiskup, function () {
          mstate.jadwigaCoroned = true;
          JP.Player.setHeadSymbol('floralCrown');
          JP.Hotspots.markBuilt('hs_wawel');
          checkMilestones('hs_wawel_koronacja');
          JP.Dialogue.toast('👑 Jadwiga koronowana na Wawelu! Jedź do Krewo — tam czeka Jagiełło.');
        });
        return;
      }
      if (!mstate.uniaAccepted) {
        JP.Dialogue.toast('Najpierw jedź do Krewo i zawrzyj unię z Jagiełłą.');
        return;
      }
      if (mstate.jadwigaMarried) { JP.Dialogue.toast('Ślub już za tobą. ✓'); return; }
      // Drugie wejście — chrzest i ślub
      JP.Dialogue.open(cfg.npcs.jagiello_narzeczony, function () {
        JP.Dialogue.confirm(
          'Chrzest i ślub — Wawel, luty 1386',
          'Jagiełło przyjął chrzest i imię Władysław. Małżeństwo na Wawelu złączy Polskę z Litwą na wieki.',
          function () {
            mstate.jadwigaMarried = true;
            checkMilestones('hs_wawel_slub');
            var eggH = JP.Hotspots.getById('hs_egg');
            if (eggH) eggH.hidden = false;
            _switchToJagiello();
          },
          null,
          'Zaślub go ✓', 'chrzest'
        );
      });
      return;
    }

    if (h.id === 'hs_unia') {
      if (!mstate.jadwigaCoroned) {
        JP.Dialogue.toast('Najpierw przyjmij koronację na Wawelu.');
        return;
      }
      if (mstate.uniaAccepted) { JP.Dialogue.toast('Unia krewska zawarta. ✓'); return; }
      JP.Dialogue.open(cfg.npcs.jagiello_krewo, function () {
        JP.Dialogue.confirm(
          'Unia krewska — Krewo, 1385',
          'Jagiełło przyjmie chrzest, poślubi Jadwigę i wieczyście przyłączy Litwę do Królestwa Polskiego.',
          function () {
            mstate.uniaAccepted = true;
            JP.Hotspots.markBuilt('hs_unia');
            checkMilestones('hs_unia');
            JP.Dialogue.toast('📜 Unia zawarta! Wróć na Wawel — czas na chrzest i ślub.');
          },
          null,
          'Zgoda ✓', 'dokument'
        );
      });
      return;
    }

    // ── Akademia — dostępna zawsze ────────────────────────────────
    if (h.id === 'hs_akademia') {
      if (mstate.akademiaRenewed) { JP.Dialogue.toast('Akademia odnowiona. ✓'); return; }
      JP.Dialogue.open(cfg.npcs.rektor, function () {
        mstate.akademiaRenewed = true;
        JP.Hotspots.markBuilt('hs_akademia');
        checkMilestones('hs_akademia');
        JP.Dialogue.toast('🎓 Akademia Krakowska odnowiona — rok 1400.');
      });
      return;
    }

    // ── Blokada: Jagiełło jeszcze nie aktywny ────────────────────
    if (mstate.phase === 'jadwiga') {
      JP.Dialogue.toast('Najpierw ukończ zadania Jadwigi.');
      return;
    }

    // ── FAZA JAGIEŁŁY ────────────────────────────────────────────

    if (h.id === 'hs_witold') {
      if (mstate.witoldMet) { JP.Dialogue.toast('Narada z Witoldem odbyta. ✓'); return; }
      if (!mstate.akademiaRenewed) { JP.Dialogue.toast('Najpierw odnów Akademię Krakowską — wiedza to podstawa zwycięstwa.'); return; }
      JP.Dialogue.open(cfg.npcs.witold, function () {
        mstate.witoldMet = true;
        JP.Hotspots.markBuilt('hs_witold');
        checkMilestones('hs_witold');
        JP.Dialogue.toast('⚔ Plan bitwy gotowy. Wyrusz na Grunwald!');
      });
      return;
    }

    if (h.id === 'hs_grunwald') {
      if (!mstate.witoldMet) {
        JP.Dialogue.toast('Musisz najpierw naradzić się z Witoldem w Brześciu.');
        return;
      }
      if (mstate.grunwaldWon) { JP.Dialogue.toast('Bitwa stoczona. ✓'); return; }
      JP.Dialogue.open(cfg.npcs.herold_ulricha, function () {
        stopLoop(); JP.Player.pause(); window.removeEventListener('keydown', handleInteract);
        JP.Combat.start('grunwald', function () {
          startLoop(); JP.Player.resume(); window.addEventListener('keydown', handleInteract);
          mstate.grunwaldWon = true;
          JP.Hotspots.markBuilt('hs_grunwald');
          checkMilestones('hs_grunwald');
        });
      });
      return;
    }

    // Fallback — zwykły NPC bez logiki
    var npc = h.npcId && cfg.npcs[h.npcId];
    if (npc) JP.Dialogue.open(npc);
  }

  // ── Bitwa pod Grunwaldem — styl Pokémon ────────────────────────
  function _startGrunwaldBattle(onWin) {
    stopLoop();
    JP.Player.pause();
    window.removeEventListener('keydown', handleInteract);
    JP.Audio.play('battle');

    var MAX_PL = 100, MAX_EN = 90;
    var plHP = MAX_PL, enHP = MAX_EN;
    var swordsUsed = false, busy = false;

    var MOVES = [
      { id:'ch', name:'CHORĄGWIE',      dmgMin:12, dmgMax:22,
        lore:'Trzydzieści polskich chorągwi naciera! Zakon chwieje się przed żelazną falą!' },
      { id:'wi', name:'MANEWR WITOLDA', dmgMin:20, dmgMax:34, selfDmg:7,
        lore:'Litwa pozornie ucieka — Teutonowie gonią i wpadają w zasadzkę Witolda!' },
      { id:'dw', name:'DWA MIECZE ✦',  dmgMin:30, dmgMax:42, oneTime:true,
        lore:'Jagiełło odsyła drwiące miecze Ulricha — i uderza z całą siłą Korony!' },
      { id:'mo', name:'MODLITWA',       heal:28,
        lore:'"Per Deum vivum!" — Jagiełło klęka. Wojsko nabiera sił, widząc spokój króla.' },
    ];

    var ENEMY_MOVES = [
      { name:'SZTURM KAWALERII', dmgMin:13, dmgMax:20,
        lore:'Ciężka kawaleria Zakonu uderza z impetem kopii!' },
      { name:'KUSZA KRZYŻACKA',  dmgMin: 8, dmgMax:15,
        lore:'Grad bełtów z stu kusz — polskie tarcze drżą!' },
      { name:'WAGENBURG',        heal:12,
        lore:'Ulrich kryje się za wozami — Zakon okopuje się i odpoczywa.' },
      { name:'KOPIJNICY',        dmgMin:17, dmgMax:26,
        lore:'Najcięższe kopie Zakonu ruszają na polskie banery!' },
    ];

    function rnd(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

    // ── Buduj overlay ─────────────────────────────────────────────
    var ov = document.createElement('div');
    ov.id = 'grunwald-battle';
    ov.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;z-index:200;' +
      'font-family:"Courier New",monospace;display:flex;flex-direction:column;overflow:hidden;';

    var btnHtml = MOVES.map(function (m, i) {
      return '<button id="bt-btn-' + i + '" style="background:none;border:1px solid rgba(24,40,80,0.2);' +
        'font-family:\'Courier New\',monospace;font-size:13px;font-weight:bold;color:#182850;' +
        'cursor:pointer;padding:4px 10px;text-align:left;">' +
        (i === 0 ? '▶ ' : '  ') + m.name + '</button>';
    }).join('');

    ov.innerHTML =
      // ── Pole walki ──────────────────────────────────────────────
      '<div style="flex:1;position:relative;background:#2d5a1a;">' +
        '<canvas id="grunwald-bg" width="320" height="200" ' +
          'style="position:absolute;top:0;left:0;width:100%;height:100%;image-rendering:pixelated;display:block;"></canvas>' +

        // Info wroga (lewy-górny)
        '<div style="position:absolute;top:12px;left:12px;background:#e8e0b0;' +
          'border:3px solid #182850;padding:7px 12px;min-width:210px;box-shadow:3px 3px 0 #182850;">' +
          '<div style="font-size:12px;font-weight:bold;color:#182850;letter-spacing:1px;">ULRICH VON JUNGINGEN</div>' +
          '<div style="font-size:10px;color:#604820;margin-bottom:4px;">Wielki Mistrz Zakonu · Lv.25</div>' +
          '<div style="font-size:10px;color:#182850;">HP</div>' +
          '<div style="background:#505050;height:9px;border:2px solid #182850;">' +
            '<div id="en-hp-bar" style="height:100%;background:#38b838;width:100%;transition:width 0.5s;"></div>' +
          '</div>' +
        '</div>' +

        // Sprite wroga (prawy-górny) — krzyż Zakonu
        '<div style="position:absolute;right:14%;top:4%;text-align:center;">' +
          '<div style="font-size:100px;line-height:1;filter:drop-shadow(3px 5px 3px rgba(0,0,0,0.5));">✝</div>' +
          '<div style="background:rgba(0,0,0,0.18);height:14px;width:110px;border-radius:50%;margin:-8px auto 0;"></div>' +
        '</div>' +

        // Sprite gracza (lewy-dolny) — korona
        '<div style="position:absolute;left:11%;bottom:9%;text-align:center;">' +
          '<div style="background:rgba(0,0,0,0.18);height:12px;width:90px;border-radius:50%;margin:0 auto;"></div>' +
          '<div style="font-size:80px;line-height:1;filter:drop-shadow(3px 5px 3px rgba(0,0,0,0.5));">♛</div>' +
        '</div>' +

        // Info gracza (prawy-dolny)
        '<div style="position:absolute;bottom:10px;right:12px;background:#e8e0b0;' +
          'border:3px solid #182850;padding:7px 12px;min-width:220px;box-shadow:3px 3px 0 #182850;">' +
          '<div style="font-size:12px;font-weight:bold;color:#182850;letter-spacing:1px;">WŁADYSŁAW JAGIEŁŁO</div>' +
          '<div style="font-size:10px;color:#604820;margin-bottom:4px;">Król Polski i Litwy · Lv.28</div>' +
          '<div style="font-size:10px;color:#182850;">HP</div>' +
          '<div style="background:#505050;height:9px;border:2px solid #182850;">' +
            '<div id="pl-hp-bar" style="height:100%;background:#38b838;width:100%;transition:width 0.5s;"></div>' +
          '</div>' +
          '<div id="pl-hp-text" style="font-size:11px;text-align:right;color:#182850;margin-top:2px;">100/100</div>' +
        '</div>' +
      '</div>' +

      // ── Panel dolny (tekst + przyciski) ────────────────────────
      '<div style="height:148px;background:#f0e8d0;border-top:4px solid #182850;display:flex;">' +
        '<div style="flex:1;padding:14px 18px;border-right:3px solid #182850;">' +
          '<div id="bt-text" style="font-size:16px;color:#182850;line-height:1.5;">Co zrobi Jagiełło?</div>' +
        '</div>' +
        '<div style="width:290px;display:grid;grid-template-columns:1fr 1fr;">' +
          btnHtml +
        '</div>' +
      '</div>';

    document.querySelector('.game-scene').appendChild(ov);

    // ── Pomocniki ─────────────────────────────────────────────────
    function setText(msg) {
      var el = document.getElementById('bt-text');
      if (el) el.textContent = msg;
    }

    function updateBars() {
      var ep = Math.max(0, enHP / MAX_EN * 100);
      var pp = Math.max(0, plHP / MAX_PL * 100);
      var eb = document.getElementById('en-hp-bar');
      var pb = document.getElementById('pl-hp-bar');
      var pt = document.getElementById('pl-hp-text');
      if (eb) { eb.style.width = ep + '%'; eb.style.background = ep > 50 ? '#38b838' : ep > 25 ? '#e0b800' : '#d02020'; }
      if (pb) { pb.style.width = pp + '%'; pb.style.background = pp > 50 ? '#38b838' : pp > 25 ? '#e0b800' : '#d02020'; }
      if (pt) pt.textContent = Math.max(0, plHP) + '/100';
    }

    function setButtons(on) {
      MOVES.forEach(function (m, i) {
        var b = document.getElementById('bt-btn-' + i);
        if (!b) return;
        var grayed = on && m.oneTime && swordsUsed;
        b.disabled = !on || grayed;
        b.style.opacity = grayed ? '0.35' : '1';
        b.style.cursor  = (!on || grayed) ? 'default' : 'pointer';
        // Hover reset
        b.onmouseover = (!on || grayed) ? null : function () { this.style.background = '#d8c060'; };
        b.onmouseout  = (!on || grayed) ? null : function () { this.style.background = 'none'; };
      });
      if (on) setText('Co zrobi Jagiełło?');
    }

    function endBattle(won) {
      setButtons(false);
      setTimeout(function () {
        if (ov.parentNode) ov.parentNode.removeChild(ov);
        JP.Audio.play('explore');
        startLoop();
        JP.Player.resume();
        window.addEventListener('keydown', handleInteract);
        if (won) onWin();
      }, 2600);
    }

    function enemyTurn() {
      var avail = ENEMY_MOVES.filter(function (m) { return !(m.heal && enHP > MAX_EN * 0.75); });
      var move;
      if (plHP < 30) {
        var atk = avail.filter(function (m) { return m.dmgMin; });
        move = atk.length ? atk[rnd(0, atk.length - 1)] : avail[rnd(0, avail.length - 1)];
      } else {
        move = avail[rnd(0, avail.length - 1)];
      }
      setTimeout(function () {
        if (move.heal) {
          enHP = Math.min(MAX_EN, enHP + move.heal);
          updateBars();
          setText('Ulrich: ' + move.name + '! ' + move.lore);
        } else {
          var dmg = rnd(move.dmgMin, move.dmgMax);
          if (plHP - dmg <= 0) dmg = plHP - 1; // gracz zawsze przeżyje
          plHP = Math.max(1, plHP - dmg);
          updateBars();
          setText('Ulrich: ' + move.name + '! ' + move.lore + ' (−' + dmg + ' HP)');
        }
        setTimeout(function () { busy = false; setButtons(true); }, 1400);
      }, 950);
    }

    // ── Podpięcie przycisków ──────────────────────────────────────
    MOVES.forEach(function (m, i) {
      var btn = document.getElementById('bt-btn-' + i);
      if (!btn) return;
      btn.addEventListener('click', function () {
        if (busy || (m.oneTime && swordsUsed)) return;
        busy = true;
        setButtons(false);
        if (m.id === 'dw') swordsUsed = true;

        if (m.heal) {
          var gained = Math.min(m.heal, MAX_PL - plHP);
          plHP = Math.min(MAX_PL, plHP + m.heal);
          updateBars();
          setText(m.lore + (gained > 0 ? ' (+' + gained + ' HP)' : ''));
        } else {
          var dmg = rnd(m.dmgMin, m.dmgMax);
          if (enHP <= 20 && enHP - dmg <= 0) dmg = enHP; // dobij
          enHP = Math.max(0, enHP - dmg);
          updateBars();
          var sd = m.selfDmg || 0;
          if (sd) { plHP = Math.max(1, plHP - sd); updateBars(); }
          setText(m.lore + ' (−' + dmg + ' HP Ulricha' + (sd ? ', −' + sd + ' HP Jagiełły' : '') + ')');
        }

        setTimeout(function () {
          if (enHP <= 0) {
            setText('⚔ GRUNWALD! Ulrich von Jungingen pada na polu bitwy! 15 VII 1410 — Zakon złamany!');
            endBattle(true);
            return;
          }
          setText('Ulrich szykuje odpowiedź...');
          enemyTurn();
        }, 1150);
      });
    });

    updateBars();
    setButtons(true);
  }

  // ── Przejście na Jagiełłę ───────────────────────────────────────
  function _switchToJagiello() {
    mstate.phase = 'jagiello';
    JP.Player.setHeadSymbol('crown');
    _setMapThumb('zintegrowana platforma edu/jagiello.jpg');
    JP.Dialogue.toast('⚜ Teraz grasz jako Jagiełło. Mapa Rzeczpospolitej się rozszerza.');
  }

  function _setMapThumb(src) {
    _mapSrc = src;
    var el = document.getElementById('poland-thumb');
    if (el) el.src = src;
  }

  // ── Milestones + oś czasu ───────────────────────────────────────
  function checkMilestones(doneId) {
    var flags = [
      mstate.jadwigaCoroned, mstate.jadwigaMarried,
      mstate.uniaAccepted,   mstate.akademiaRenewed,
      mstate.witoldMet,      mstate.grunwaldWon,
    ];
    var count = flags.filter(Boolean).length;
    var fill = document.getElementById('timeline-fill');
    if (fill) fill.style.height = Math.round((count / 6) * 100) + '%';

    var idx = MILESTONE_IDX[doneId];
    if (idx !== undefined) {
      var labels = document.querySelectorAll('.milestone');
      if (labels[idx]) labels[idx].classList.add('achieved');
    }

    if (QUEST_TEXTS_M03[doneId]) updateQuestText(QUEST_TEXTS_M03[doneId]);

    if (flags.every(Boolean)) {
      setTimeout(function () {
        (function waitDlg() {
          if (JP.Dialogue.isOpen()) { setTimeout(waitDlg, 300); return; }
          setTimeout(showWin, 1200);
        })();
      }, 700);
    }
  }

  // ── Ekran wygranej ──────────────────────────────────────────────
  function showWin() {
    stopLoop();
    JP.Player.unbindKeys();
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
    document.getElementById('win-next').addEventListener('click', function () { JP.Engine.showScene('mission', { missionId: 'm04' }); });
  }

  // ── Montaż sceny ───────────────────────────────────────────────
  function mountMission(container) {
    _resetState();
    _mapSrc = 'zintegrowana platforma edu/jagiello.jpg';
    JP.Tilemap.setMap(MAP_M03, DECO_M03);

    container.innerHTML =
      '<div class="mission-layout">' +

        '<aside class="side-panel" id="side-panel">' +
          '<div class="side-panel__header">' +
            '<span class="side-panel__crown">♛</span>' +
            '<span class="side-panel__label">Rzeczpospolita</span>' +
          '</div>' +
          '<div class="poland-map">' +
            '<div class="poland-thumb-wrap" id="poland-thumb-wrap">' +
              '<img class="poland-thumb" id="poland-thumb" src="' + _mapSrc + '" alt="Mapa historyczna" />' +
              '<span class="poland-thumb-hint">🔍 kliknij</span>' +
            '</div>' +
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
      var lb = document.createElement('div');
      lb.className = 'map-lightbox';
      lb.innerHTML = '<span class="map-lightbox-close">✕</span><img src="' + _mapSrc + '" alt="Mapa historyczna" />';
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
    JP.Player.init(5, 5);
    JP.Player.pause();
    JP.Player.setHeadSymbol('flower'); // Jadwiga startuje z kwiatem

    loadImages(startLoop);
  }

  return {
    config:       cfg,
    mountMission: mountMission,
    testBattle:   _startGrunwaldBattle,
  };
})();
