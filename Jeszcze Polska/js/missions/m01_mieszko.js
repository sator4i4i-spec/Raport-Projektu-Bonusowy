// m01_mieszko.js — Misja 1: Mieszko I → Bolesław Chrobry (966–1025)
window.JP = window.JP || {};

JP.M01 = (function () {

  // ── Config ─────────────────────────────────────────────────────
  var cfg = {
    id: 'm01',
    title: 'Mieszko I · Bolesław Chrobry',
    frame: 'Przez chrzest weszła Polska do Europy. Przez koronę — stała się królestwem.',
    dates: { start: 966, end: 1025 },
    objective: 'Przyjmij chrzest i zdobądź koronę królewską — przez dyplomację, nie przez wojnę.',

    // Wszystkie NPC (kwestie zgodne z dialogi ludzi.docx + rozszerzenia)
    npcs: {
      dobrawa: {
        id: 'dobrawa', name: 'Dobrawa',
        portrait: 'grafiki/art/portraits/m01_dobrawa.png',
        lines: [
          'Przybyłam z Czech z wiarą w sercu. Przyjmij chrzest, a Polska stanie się częścią chrześcijańskiej Europy.',
          'Pogańskie plemiona nas nie uszanują. Krzyż otworzy nam drzwi, których miecz nie zdoła.',
          'Nasz syn Bolesław wyrośnie już w wierze, której ty dopiero się uczysz.',
          'Poszukaj Biskupa Jordana — to on poprowadzi cię przez obrzęd chrztu.',
        ]
      },
      jordan: {
        id: 'jordan', name: 'Biskup Jordan',
        portrait: 'grafiki/art/portraits/m01_jordan.png',
        lines: [
          'Jestem pierwszym biskupem tej ziemi. Chrzest to dopiero początek — całe pokolenia trzeba będzie nauczać.',
          'Buduję kościoły tam, gdzie stały święte gaje. Stara wiara nie ustąpi w jeden dzień.',
          'Idź do kościoła w Gnieźnie — tam przyjmiesz chrzest i poprowadzisz Polskę do Europy.',
        ]
      },
      wojciech: {
        id: 'wojciech', name: 'Święty Wojciech',
        portrait: 'grafiki/art/portraits/m01_wojciech.png',
        lines: [
          'Niosę Ewangelię pogańskim Prusom. Wiem, że mogę stamtąd nie wrócić.',
          'Jeśli zginę, moje ciało stanie się skarbem — a Gniezno przez nie urośnie.',
        ]
      },
      boleslawa: {
        id: 'boleslawa', name: 'Bolesław Chrobry',
        portrait: 'grafiki/art/portraits/m01_boleslaw.png',
        lines: [
          'Ojcze, przyjąłeś chrzest i zjednoczyłeś piastowskie ziemie. Polska stoi na nogach.',
          'Czas, bym to ja poprowadził ją dalej — jako jej pierwszy król.',
          'Otto III, cesarz Rzymu, pragnie spotkać się ze mną w Gnieźnie. Rok 1000 — to moja szansa na koronę.',
          'Przejmij przeze mnie panowanie, ojcze. Polska potrzebuje teraz króla, nie księcia.',
        ]
      },
      otto: {
        id: 'otto', name: 'Otto III',
        portrait: 'grafiki/art/portraits/m01_otto.png',
        lines: [
          'Rok 1000 — Zjazd Gnieźnieński. Zdejmuję z ciebie trybut, Bolesławie.',
          'Czynię Gniezno arcybiskupstwem i nazywam cię bratem, a nie wasalem.',
          'Marzę o odnowionym cesarstwie, w którym Polska będzie filarem — lecz me dni mogą być krótkie.',
        ]
      },
      hipolit: {
        id: 'hipolit', name: 'Arcybiskup Hipolit',
        portrait: 'grafiki/art/portraits/m01_hipolit.png',
        lines: [
          'Mało kto zapamięta me imię — a jednak to ja włożę pierwszą koronę na głowę króla Polski.',
          'Henryk II już nie żyje. Droga do korony stanęła otworem.',
          'Przygotuj ceremonię koronacji, Bolesławie — Polska czeka na swojego pierwszego króla.',
        ]
      },
      thietmar: {
        id: 'thietmar', name: 'Thietmar z Merseburga',
        portrait: 'grafiki/art/portraits/m01_thietmar.png',
        lines: [
          'Spisuję te dzieje po niemiecku. Bez kronikarzy nikt by nie wiedział, co tu zaszło.',
          'Piszę o Bolesławie jak o rywalu — lecz nawet wróg przyznaje mu wielkość.',
        ]
      },
    },

    hotspots: [
      // hs_dobrawa — zmienia się na Bolesława po zadaniu 3
      { id:'hs_dobrawa',   col:7,  row:5, type:'npc',     label:'Dobrawa',               npcId:'dobrawa' },
      { id:'hs_jordan',    col:9,  row:4, type:'npc',     label:'Biskup Jordan',          npcId:'jordan' },
      { id:'hs_wojciech',  col:12, row:6, type:'npc',     label:'Święty Wojciech',        npcId:'wojciech' },
      { id:'hs_chrzest',   col:7,  row:3, type:'budynek', label:'Kościół w Gnieźnie',    buildType:'chrzest',   cost:0 },
      { id:'hs_otto',      col:11, row:4, type:'npc',     label:'Otto III · Zjazd 1000', npcId:'otto' },
      { id:'hs_thietmar',  col:5,  row:4, type:'npc',     label:'Thietmar z Merseburga', npcId:'thietmar' },
      { id:'hs_henryk',    col:1,  row:5, type:'refusal', label:'Henryk II',             refusalMsg:'Henryk II: „Żadnej korony z mojej ręki." Okaż cierpliwość, a historia pomoże Ci.' },
      { id:'hs_hipolit',   col:9,  row:6, type:'npc',     label:'Arcybiskup Hipolit',    npcId:'hipolit' },
      { id:'hs_koronacja', col:7,  row:7, type:'budynek', label:'Ceremonia koronacji',   buildType:'koronacja', cost:0 },
      { id:'hs_idol',      col:5,  row:7, type:'egg',     label:'Posąg Świętowita',      eggId:'egg_m01_kon' },
    ],

    eggs: [{ id:'egg_m01_kon', desc:'Świętowit — czterogłowy bóg słowiański, pan wojny i urodzaju.' }],

    outcome: {
      badge: 'Królestwo z ducha i krzyża',
      text: 'W 966 roku Polska przyjęła chrzest i weszła do rodziny chrześcijańskiej Europy. Bolesław Chrobry, po Zjeździe Gnieźnieńskim i wytrwałej walce z Henrykiem II, doczekał się koronacji z rąk Arcybiskupa Hipolita w 1025 roku — pierwszy Król Polski. Ród Piastów wypisał imię Polski w historii.',
    },
  };

  // ── System zadań ────────────────────────────────────────────────
  var QUESTS = [
    null,
    { text: 'Zadanie 1: Porozmawiaj z Dobrawą' },
    { text: 'Zadanie 2: Znajdź Biskupa Jordana' },
    { text: 'Zadanie 3: Przyjmij chrzest w kościele w Gnieźnie' },
    { text: 'Zadanie 4: Znajdź Bolesława — czeka przy domu Dobrawy' },
    { text: 'Zadanie 5: Jedź na Zjazd Gnieźnieński (rok 1000) — spotkaj Ottona III' },
    { text: 'Zadanie 6: Porozmawiaj z Arcybiskupem Hipolitem' },
    { text: 'Zadanie 7: Zorganizuj ceremonię koronacji' },
  ];

  // ── Stan misji ──────────────────────────────────────────────────
  var mstate = {
    treasury: 300,
    baptismDone:    false,
    coronationDone: false,
    ottoMet:        false,
    questIdx:       1,
  };

  // ── Pętla gry ───────────────────────────────────────────────────
  var rafId   = null;
  var _resize = null;
  var running = false;
  var lastTS  = 0;
  var imgs    = {};
  var cam     = { x: 0, y: 0 };

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
    cam.x = Math.max(0, Math.min(mapW - canvas.width,  JP.Player.state.x - canvas.width  / 2));
    cam.y = Math.max(0, Math.min(mapH - canvas.height, JP.Player.state.y - canvas.height / 2));
  }

  function _drawLabels(ctx) {
    var T = JP.Tilemap.T;
    var cw = ctx.canvas.width;
    ctx.save();
    ctx.font = 'bold 11px Georgia, serif';
    ctx.textAlign = 'center';
    var labels = [
      { text: 'PRUSY',           col: 9,   row: 1,   color: '#8899bb' },
      { text: 'CESARSTWO NIEM.', col: 0.5, row: 5,   color: '#9988aa' },
      { text: 'RUŚ KIJOWSKA',    col: 16,  row: 5,   color: '#bb9966' },
      { text: 'CZECHY',          col: 1.5, row: 9,   color: '#88aa99' },
      { text: 'WĘGRY',           col: 9,   row: 11,  color: '#aa9977' },
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

  function startLoop() {
    running = true;
    lastTS  = performance.now();
    rafId   = requestAnimationFrame(loop);
  }

  function stopLoop() {
    running = false;
    if (rafId)   { cancelAnimationFrame(rafId); rafId = null; }
    if (_resize) { window.removeEventListener('resize', _resize); _resize = null; }
  }

  // ── Zarządzanie zadaniami ────────────────────────────────────────
  function advanceQuest(to) {
    var completed = mstate.questIdx; // indeks właśnie ukończonego zadania (1–7)
    mstate.questIdx = to;
    updateQuestDisplay();

    // Zaznacz ukończony milestone (0-indexed = completed-1)
    var labels = document.querySelectorAll('.milestone');
    if (labels[completed - 1]) labels[completed - 1].classList.add('achieved');

    // Pasek czasu: ukończone zadania / 7
    var fill = document.getElementById('timeline-fill');
    if (fill) fill.style.height = ((to - 1) / 7 * 100).toFixed(1) + '%';
  }

  // Oznacza ostatni (7.) milestone i dopełnia pasek — wywołane po koronacji
  function completeTimeline() {
    var labels = document.querySelectorAll('.milestone');
    if (labels[6]) labels[6].classList.add('achieved');
    var fill = document.getElementById('timeline-fill');
    if (fill) fill.style.height = '100%';
  }

  function updateQuestDisplay() {
    var el = document.getElementById('quest-text');
    if (!el) return;
    var q = QUESTS[mstate.questIdx];
    el.textContent = q ? q.text : '';
  }

  // ── Interakcja E / Space / Enter ────────────────────────────────
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

    if (h.type === 'npc') {
      // ── Dobrawa / Bolesław (ten sam hotspot, różny NPC zależnie od zadania) ──
      if (h.id === 'hs_dobrawa') {
        if (mstate.questIdx >= 4) {
          // Hotspot przemienił się w Bolesława
          if (mstate.questIdx === 4) {
            JP.Dialogue.open(cfg.npcs.boleslawa, function () {
              // Po dialogu Bolesław przejmuje dowodzenie
              JP.Player.setHeadSymbol('diadem');
              switchMapToChrobry();
              advanceQuest(5);
              setTimeout(function () {
                JP.Dialogue.toast('♛ Bolesław Chrobry przejmuje panowanie. Jedź na Zjazd Gnieźnieński!');
              }, 300);
            });
          } else {
            JP.Dialogue.toast('Bolesław: „Idź do Gniezna — Otto III czeka na Zjeździe."');
          }
          return;
        }
        // Zadanie 1 — Dobrawa
        JP.Dialogue.open(cfg.npcs.dobrawa, function () {
          if (mstate.questIdx === 1) advanceQuest(2);
        });
        return;
      }

      // ── Biskup Jordan ── (dostępny od zadania 2)
      if (h.id === 'hs_jordan') {
        if (mstate.questIdx < 2) {
          JP.Dialogue.toast('Najpierw porozmawiaj z Dobrawą — to ona wskaże drogę do Jordana.');
          return;
        }
        JP.Dialogue.open(cfg.npcs.jordan, function () {
          if (mstate.questIdx === 2) advanceQuest(3);
        });
        return;
      }

      // ── Otto III ── (dostępny od zadania 5)
      if (h.id === 'hs_otto') {
        if (mstate.questIdx < 5) {
          JP.Dialogue.toast('Najpierw znajdź Bolesława i przekaż mu władzę.');
          return;
        }
        if (!mstate.ottoMet) {
          mstate.ottoMet = true;
          mstate.treasury += 200;
          updateTreasury();
          JP.Dialogue.open(cfg.npcs.otto, function () {
            advanceQuest(6);
            setTimeout(function () {
              JP.Dialogue.toast('⚑ Zjazd Gnieźnieński — Otto III zdjął trybut. +200 złotych. Idź do Arcybiskupa Hipolita.');
            }, 200);
          });
        } else {
          JP.Dialogue.toast('Otto III: „Polska jest naszym bratnim królestwem. Idź do Hipolita po koronę."');
        }
        return;
      }

      // ── Arcybiskup Hipolit ── (dostępny od zadania 6)
      if (h.id === 'hs_hipolit') {
        if (mstate.questIdx < 6) {
          JP.Dialogue.toast('Najpierw spotkaj się z Ottonem III na Zjeździe Gnieźnieńskim.');
          return;
        }
        JP.Dialogue.open(cfg.npcs.hipolit, function () {
          if (mstate.questIdx === 6) advanceQuest(7);
        });
        return;
      }

      // ── Pozostałe NPC bez bramkowania ──
      var npc = cfg.npcs[h.npcId];
      if (npc) JP.Dialogue.open(npc);

    } else if (h.type === 'budynek') {
      if (h.built) {
        var doneMsg = h.buildType === 'chrzest'
          ? 'Polska przyjęła już chrzest w 966 roku. ✝'
          : 'Koronacja Bolesława odbyła się. Polska jest królestwem. ♛';
        JP.Dialogue.toast(doneMsg);
        return;
      }

      // ── Kościół / Chrzest ── (dostępny od zadania 3)
      if (h.buildType === 'chrzest') {
        if (mstate.questIdx < 3) {
          JP.Dialogue.toast('Najpierw porozmawiaj z Biskupem Jordanem — on wskaże drogę do chrztu.');
          return;
        }
        JP.Dialogue.confirm(
          'Przyjmij chrzest',
          'Rok 966. Mieszko I staje nad wodą chrzcielną. Polska wkroczy do chrześcijańskiej Europy.',
          function () {
            JP.Hotspots.markBuilt(h.id);
            mstate.baptismDone = true;
            advanceQuest(4);
            // Zmień hotspot Dobrawy na Bolesława
            var hsD = JP.Hotspots.getById('hs_dobrawa');
            if (hsD) { hsD.label = 'Bolesław Chrobry'; }
            setTimeout(function () {
              JP.Dialogue.toast('✝ 966 rok — Polska przyjmuje chrzest. Znajdź Bolesława przy domu Dobrawy!');
            }, 300);
          },
          null, 'Przyjmij ✝', 'chrzest'
        );
        return;
      }

      // ── Koronacja ── (dostępna od zadania 7)
      if (h.buildType === 'koronacja') {
        if (mstate.questIdx < 7) {
          JP.Dialogue.toast('Najpierw porozmawiaj z Arcybiskupem Hipolitem.');
          return;
        }
        JP.Dialogue.confirm(
          'Koronacja Bolesława Chrobrego',
          'Rok 1025. Arcybiskup Hipolit nakłada koronę. Henryk II już nie żyje — droga wolna.',
          function () {
            JP.Hotspots.markBuilt(h.id);
            mstate.coronationDone = true;
            JP.Player.setHeadSymbol('crown');
            completeTimeline();
            checkMilestones();
          },
          null, 'Koronuj ♛', 'koronacja'
        );
        return;
      }

    } else if (h.type === 'egg') {
      if (h.collected) return;
      JP.State.addEgg(h.eggId);
      JP.Hotspots.markCollected(h.id);
      mstate.treasury += 50;
      updateTreasury();
      JP.Dialogue.info(
        '🗿 Świętowit',
        'Świętowit był dla dawnych Słowian kimś w rodzaju superbohatera. Miał cztery głowy, wielki miecz do walki ze złem oraz magiczny róg. Kapłani co roku wlewali do tego rogu miód — jeśli napoju nie ubywało, zapowiadało to mnóstwo jedzenia i świetne plony dla wszystkich!\n\n+50 złotych z dawnych ofiar.',
        'A to ciekawe!',
        null, 'egg'
      );

    } else if (h.type === 'refusal') {
      JP.Dialogue.toast('⚔ ' + (h.refusalMsg || 'Nie tędy droga.'));
    }
  }

  // ── Sprawdzenie wygranej ─────────────────────────────────────────
  function checkMilestones() {
    if (mstate.baptismDone && mstate.coronationDone) {
      setTimeout(function () {
        (function waitDlg() {
          if (JP.Dialogue.isOpen()) { setTimeout(waitDlg, 300); return; }
          setTimeout(showWin, 1200);
        })();
      }, 700);
    }
  }

  // Przełącza mapę boczną na Bolesława Chrobrego (cross-fade 1,8s)
  function switchMapToChrobry() {
    var imgChrobry = document.getElementById('map-chrobry');
    var label      = document.getElementById('map-phase-label');
    if (imgChrobry) imgChrobry.style.opacity = '1';
    if (label)      label.textContent = 'Bolesław Chrobry · 992–1025';
  }

  function updateTreasury() {
    var el = document.getElementById('treasury-val');
    if (el) el.textContent = mstate.treasury;
  }

  // ── Wygrana ─────────────────────────────────────────────────────
  function showWin() {
    stopLoop();
    JP.Player.unbindKeys();
    JP.Player.resetHeadSymbol();
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
    document.getElementById('win-next').addEventListener('click', function () {
      JP.Engine.showScene('mission', { missionId: 'm02' });
    });
  }

  // ── Montaż sceny ─────────────────────────────────────────────────
  function mountMission(container) {
    mstate = { treasury: 300, baptismDone: false, coronationDone: false, ottoMet: false, questIdx: 1 };
    JP.Player.setHeadSymbol('pagan');

    container.innerHTML =
      '<div class="mission-layout">' +

        '<aside class="side-panel" id="side-panel">' +
          '<div class="side-panel__header">' +
            '<span class="side-panel__crown">♛</span>' +
            '<span class="side-panel__label">Polska</span>' +
          '</div>' +

          '<div class="poland-map">' +
            '<div class="poland-thumb-wrap" id="poland-thumb-wrap">' +
              '<div class="map-crossfade" style="position:relative;width:100%;">' +
                '<img id="map-mieszko" class="poland-thumb"' +
                '     src="zintegrowana platforma edu/mieszko - tereny.jpg" alt="Mieszko I — tereny"' +
                '     style="width:100%;display:block;filter:brightness(0.38);" />' +
                '<img id="map-chrobry" class="poland-thumb"' +
                '     src="zintegrowana platforma edu/chrobry - tereny nowe.jpg" alt="Bolesław Chrobry — tereny"' +
                '     style="position:absolute;top:0;left:0;width:100%;opacity:0;transition:opacity 1.8s ease;filter:brightness(0.38);" />' +
              '</div>' +
              '<span class="poland-thumb-hint">🔍 kliknij</span>' +
            '</div>' +
            '<div id="map-phase-label" style="text-align:center;font-size:0.7rem;color:var(--gold);margin-top:4px;font-family:var(--font-serif);">Mieszko I · 966–992</div>' +
          '</div>' +

          '<div class="side-quest">' +
            '<div class="side-quest__label">Zadanie</div>' +
            '<span id="quest-text">' + QUESTS[1].text + '</span>' +
          '</div>' +

          '<div class="timeline">' +
            '<div class="timeline__label">Oś czasu · ' + cfg.dates.start + '–' + cfg.dates.end + '</div>' +
            '<div class="timeline__milestones">' +
              '<div class="milestone"><span class="ms-year">965</span><span class="ms-label">Dobrawa</span></div>' +
              '<div class="milestone"><span class="ms-year">966</span><span class="ms-label">Bp. Jordan</span></div>' +
              '<div class="milestone"><span class="ms-year">966</span><span class="ms-label">✝ Chrzest</span></div>' +
              '<div class="milestone"><span class="ms-year">992</span><span class="ms-label">Bolesław przejmuje</span></div>' +
              '<div class="milestone"><span class="ms-year">1000</span><span class="ms-label">⚑ Zjazd Gnieźn.</span></div>' +
              '<div class="milestone"><span class="ms-year">1025</span><span class="ms-label">Arcybiskup Hipolit</span></div>' +
              '<div class="milestone"><span class="ms-year">1025</span><span class="ms-label">♛ Koronacja</span></div>' +
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
            '<div class="hud-treasury"><span class="treasury-icon">💰</span><span id="treasury-val">' + mstate.treasury + '</span></div>' +
          '</div>' +

          '<div class="mission-intro" id="mission-intro">' +
            '<div class="intro-scroll">' +
              '<div class="intro-ornament">✦ ✦ ✦</div>' +
              '<h2 class="intro-title">' + cfg.title + '</h2>' +
              '<p class="intro-frame">' + cfg.frame + '</p>' +
              '<p class="intro-objective">Polska przyjęła chrzest z Czech, a koronę z Rzymu. Porozmawiaj z Dobrawą i zdobądź królewski tytuł drogą dyplomacji, nie wojny.</p>' +
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
      JP.Player.resetHeadSymbol();
      window.removeEventListener('keydown', handleInteract);
      JP.Engine.showScene('hub');
    });

    document.getElementById('btn-start-mission').addEventListener('click', function () {
      document.getElementById('mission-intro').classList.add('hidden');
      JP.Audio.play('explore');
      JP.Player.resume();
      JP.Player.bindKeys();
      window.addEventListener('keydown', handleInteract);
    });

    // Lightbox — pokazuje aktualnie aktywną mapę
    document.getElementById('poland-thumb-wrap').addEventListener('click', function () {
      var src = mstate.baptismDone
        ? 'zintegrowana platforma edu/chrobry - tereny nowe.jpg'
        : 'zintegrowana platforma edu/mieszko - tereny.jpg';
      var alt = mstate.baptismDone ? 'Bolesław Chrobry — tereny' : 'Mieszko I — tereny';
      var lb = document.createElement('div');
      lb.className = 'map-lightbox';
      lb.innerHTML = '<span class="map-lightbox-close">✕</span><img src="' + src + '" alt="' + alt + '" />';
      document.body.appendChild(lb);
      lb.addEventListener('click', function () { document.body.removeChild(lb); });
    });

    _initBackground();
  }

  function _initBackground() {
    var wrap   = document.getElementById('canvas-wrap');
    var canvas = document.getElementById('game-canvas');

    _resize = function () {
      canvas.width  = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
    };
    _resize();
    window.addEventListener('resize', _resize);

    JP.Hotspots.init(cfg.hotspots);
    JP.Player.init(8, 5);
    JP.Player.pause();
    loadImages(startLoop);
  }

  return {
    config:       cfg,
    mountMission: mountMission,
  };

})();
