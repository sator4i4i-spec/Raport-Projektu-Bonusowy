// m02_kazimierz.js — Misja 2: Kazimierz Wielki (1333–1370)
window.JP = window.JP || {};

JP.M02 = (function () {

  // ── Config ─────────────────────────────────────────────────────
  var cfg = {
    id: 'm02',
    title: 'Kazimierz Wielki',
    frame: 'Zastał Polskę drewnianą, a zostawił murowaną.',
    dates: { start: 1333, end: 1370 },
    verbs: ['rozmowa', 'zbieranie', 'budowanie'],
    objective: 'Wznieś 3 kamienne zamki i załóż 1 uniwersytet — bez jednej bitwy.',

    npcs: {
      architekt:          { id:'architekt',         name:'Architekt',           portrait:'grafiki/art/portraits/m02_architekt.png',   lines:['Zastałeś kraj z drewna, panie. Z kamienia ogień już go nie strawi.','Każdy zamek, który wznoszę, przetrwa stulecia dłużej niż ty czy ja.'] },
      kupiec_krakowski:   { id:'kupiec_krakowski',  name:'Krakowski kupiec',    portrait:'grafiki/art/portraits/m02_kupiec.png',      lines:['Sól z Wieliczki to skarb cenniejszy od wojny. Handel napełnia skarb królewski lepiej niż łupy.','Przywileje, które dałeś miastom, ściągają kupców z całej Europy.'] },
      zydowski_osadnik:   { id:'zydowski_osadnik',  name:'Żydowski osadnik',    portrait:'grafiki/art/portraits/m02_osadnik.png',     lines:['Król wziął nas pod swoją opiekę statutem z 1334 roku. Tu znaleźliśmy bezpieczny dom.','Tam, gdzie inni władcy nas wyganiają, Kazimierz nas zaprasza — i kraj na tym zyskuje.'] },
      kiesselhuth_konrad: { id:'kiesselhuth_konrad',name:'Jan Kiesselhuth i Konrad', portrait:'grafiki/art/portraits/m02_kiesselhuth.png', lines:['Król powierzył nam lokację miasta nad Brdą — Bydgoszczy, na prawie magdeburskim, roku 1346.','Kazimierz chciał ją zwać Kunigesburg — lecz mieszkańcy zostali przy starej nazwie.','To miasto ma strzec granicy z Krzyżakami i żyć z handlu na rzece.'] },
      kronikarz_wschod:   { id:'kronikarz_wschod',   name:'Kronikarz',           portrait:'grafiki/art/portraits/m02_kronikarz.png',   lines:['Zamek Trembowla strzegł wschodniej rubieży królestwa. Tu Ruś Czerwona weszła w skład Polski.','Kazimierz Wielki wzniósł i przebudował około pięćdziesięciu zamków — z drewna i ziemi w kamień i wapno.','Żaden inny Piast nie odmienił oblicza kraju tak jak on.'] },
      doradca:            { id:'doradca',            name:'Doradca',             portrait:'grafiki/art/portraits/m02_doradca.png',     lines:['Panie, a co po tobie? Budujesz zamki i prawa — lecz nie masz syna.','Wszystko, co wzniesiesz, przetrwa ciebie. Może to wystarczy.'], isPressure:true },
      ludwik_wg:          { id:'ludwik_wg',          name:'Ludwik Węgierski',    portrait:'grafiki/art/portraits/m02_ludwik.png',      lines:['Jestem siostrzeńcem króla. Gdy umrze bez syna, korona przejdzie do mnie — i ród Piastów się skończy.','Władam Węgrami; Polska będzie dla mnie drugim królestwem, rządzonym z daleka.'] },
      kazimierz_wawel:    { id:'kazimierz_wawel',    name:'Kazimierz Wielki',    portrait:'grafiki/art/portraits/m02_kazimierz.png',   lines:['Wawel był drewnianym grodem moich przodków. Ja zbuduję tu gotycki zamek z kamienia — godny stolicy królestwa.','Rok 1333. Przejmuję tron po ojcu Władysławie Łokietku. Polska jest podzielona, wyniszczona, bez murów. Mam to zmienić.','Widzisz tę wieżę? Przetrwa wieki. Bo kamień nie płonie.'] },
      kazimierz_akademia: { id:'kazimierz_akademia', name:'Kazimierz Wielki',    portrait:'grafiki/art/portraits/m02_kazimierz.png',   lines:['Rok 1364. Zakładam Akademię Krakowską — pierwszą uczelnię wyższą w Polsce.','W Europie Środkowej wyprzedza nas tylko Praga — Karol IV założył swój uniwersytet szesnaście lat wcześniej, w 1348.','Moja Akademia ma trzy wydziały: sztuki wyzwolone, prawo i medycynę. Teologii nie dałem — papież się nie zgodził. Niechże studiują prawo: Polska potrzebuje sędziów, nie mnichów.','Po mojej śmierci uczelnia zamarła. Odrodzi się dopiero w 1400 roku — z rąk Jadwigi i Jagiełły. Lecz fundament — mój.'] },
    },

    // Hotspoty: col/row = tile coords na mapie 18×12
    hotspots: [
      { id:'hs_zamek_krakow',    col:8,  row:9, type:'budynek', label:'Wawel',              buildType:'zamek',       npcId:'kazimierz_wawel',    cost:150 },
      { id:'hs_zamek_bydgoszcz', col:4,  row:3, type:'budynek', label:'Bydgoszcz',          buildType:'zamek',       npcId:'kiesselhuth_konrad', cost:150 },
      { id:'hs_zamek_wschod',    col:13, row:9, type:'budynek', label:'Trembowla',           buildType:'zamek',       npcId:'kronikarz_wschod',   cost:150 },
      { id:'hs_uniwersytet',     col:6,  row:9, type:'budynek', label:'Akademia Krakowska',  buildType:'uniwersytet', npcId:'kazimierz_akademia', cost:200 },
      { id:'hs_architekt',       col:4,  row:5, type:'npc',     label:'Architekt',           npcId:'architekt' },
      { id:'hs_kupiec',          col:10, row:9, type:'npc',     label:'Kupiec z Wieliczki',  npcId:'kupiec_krakowski' },
      { id:'hs_osadnik',         col:9,  row:5, type:'npc',     label:'Żydowski osadnik',   npcId:'zydowski_osadnik' },
      { id:'hs_doradca',         col:9,  row:3, type:'npc',     label:'Doradca',             npcId:'doradca' },
      { id:'hs_najazd',          col:14, row:5, type:'refusal', label:'Najedź sąsiada',      refusalMsg:'Król nie chce wojny, panie. Budujemy, nie najeżdżamy.' },
      { id:'hs_kon',             col:14, row:8, type:'egg',     label:'Koń w lesie wschodnim', eggId:'egg_kon_moneta' },
    ],

    eggs: [{ id:'egg_kon_moneta', desc:'Koń kopnął monetę przy bramie zamku!' }],
    winCondition: { castles: 3, university: 1 },

    borders: {
      // Historyczny kształt terytorium Polski za Kazimierza Wielkiego (1333–1370)
      // viewBox="0 0 120 120" — Kraków≈(52,68), Bydgoszcz≈(38,36) muszą być wewnątrz
      //
      // Uproszczone — mniej punktów, bardziej kątowy kształt (nie okrąg):
      //   Górna krawędź (N): prawie pozioma linia ograniczona Krzyżakami
      //   Prawa krawędź (E): Mazowsze/Ruś
      //   Dolna (S): Karpaty + Małopolska
      //   Lewy bok (W): granica z krajami zachodnimi
      //   Ogon SE (Ruś Halicka) — pojawia się od milestone2
      //
      // START 1333: rdzeń Piastowski bez Rusi — 10 punktów, kształt trapezoidalny
      start:
        'M16,18 L42,11 L68,15 L78,28 L76,46 L68,62 L52,73 L36,74 L20,67 L14,36 Z',
      // MILESTONE1: Wawel — poszerzenie granic, nadal bez Rusi
      milestone1:
        'M14,16 L42,9 L70,13 L82,26 L80,46 L72,64 L56,76 L38,78 L20,70 L12,34 Z',
      // MILESTONE2: Bydgoszcz — pojawia się krótki korytarz ku Rusi SE
      milestone2:
        'M14,16 L42,9 L70,13 L82,26 L80,46 L72,64 L58,74 L68,84 L74,96 L62,104 L50,94 L40,78 L20,70 L12,34 Z',
      // END 1370: pełna Polska — wyraźny ogon Rusi Halickiej (Lwów, Halicz, Trembowla)
      end:
        'M14,16 L42,9 L70,13 L82,26 L80,46 L72,64 L58,74 L70,82 L82,90 L90,102 L78,110 L62,106 L50,94 L40,80 L20,70 L12,34 Z',
    },

    outcome: { badge:'Zastał drewnianą, zostawił murowaną.', text:'Polska z kamienia stanęła na mapie Europy. Gdy Kazimierz umarł bez syna, korona przeszła na Ludwika Węgierskiego — ród Piastów wygasł. Lecz zamki, prawa i miasta zostały.' },
  };

  // ── Stan misji ──────────────────────────────────────────────────
  var mstate = { treasury: 500, castlesBuilt: 0, universityBuilt: false };

  function _startTreasury() {
    var base = 500;
    if (JP.State.getFoundEggs().indexOf('egg_m01_kon') !== -1) base += 50;
    return base;
  }

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
    var keys  = Object.keys(IMAGE_MAP);
    var done  = 0;
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
      { text: '✝ KRZYŻACY',   col: 8,   row: 1,   color: '#cc5555' },
      { text: 'ŚLĄSK',        col: 0.5, row: 6,   color: '#9988aa' },
      { text: 'LITWA',        col: 16,  row: 2,   color: '#77aa66' },
      { text: 'RUŚ HALICKA',  col: 17,  row: 7,   color: '#bb9966' },
      { text: 'WĘGRY',        col: 9,   row: 11,  color: '#aa9977' },
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

  // ── Interakcja z E ──────────────────────────────────────────────
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
      var npc = cfg.npcs[h.npcId];
      if (npc) JP.Dialogue.open(npc);

    } else if (h.type === 'budynek') {
      if (h.built) {
        JP.Dialogue.toast(h.label + ' już stoi murowany. ✓');
        return;
      }
      var cost = h.cost || 150;
      var name = h.buildType === 'zamek' ? 'Zamek' : 'Akademię Krakowską';
      if (mstate.treasury < cost) {
        JP.Dialogue.toast('Za mało złota! Potrzeba ' + cost + ' zł — skarbiec ma tylko ' + mstate.treasury + ' zł.');
        return;
      }
      JP.Dialogue.confirm(
        'Wznieś ' + name,
        'Koszt: ' + cost + ' złotych  |  Skarbiec: ' + mstate.treasury + ' zł',
        function () { // Tak — zbuduj
          mstate.treasury -= cost;
          updateTreasury();
          JP.Hotspots.markBuilt(h.id);
          if (h.buildType === 'zamek')       { mstate.castlesBuilt++; }
          if (h.buildType === 'uniwersytet') { mstate.universityBuilt = true; }
          checkMilestones(h.id);
          // Jeśli hotspot ma przypisanego NPC — pokaż dialog po budowie
          if (h.npcId && cfg.npcs[h.npcId]) {
            setTimeout(function () { JP.Dialogue.open(cfg.npcs[h.npcId]); }, 400);
          }
        },
        null, null, 'budowla'
      );

    } else if (h.type === 'egg') {
      if (h.collected) return;
      JP.State.addEgg(h.eggId);
      JP.Hotspots.markCollected(h.id);
      mstate.treasury += 100;
      updateTreasury();
      JP.Dialogue.info(
        '👑 Korona Kazimierza Wielkiego',
        'Korona Kazimierza Wielkiego była tak piękna i ważna, że po jego śmierci używano jej podczas koronacji niemal każdego kolejnego króla Polski! Niestety, ponad 200 lat temu została skradziona przez wrogą armię i ślad po niej zaginął. Do dziś nikt nie wie, gdzie się ukryła...',
        'A to ciekawe!',
        null, 'egg'
      );

    } else if (h.type === 'refusal') {
      JP.Dialogue.toast('⚔ ' + (h.refusalMsg || 'Nie tędy droga.'));
    }
  }

  // Mapowanie hotspot ID → indeks milestone (kolejność w HTML: Wawel=0, Bydgoszcz=1, Trembowla=2, Akademia=3)
  var MILESTONE_IDX = {
    'hs_zamek_krakow':    0,
    'hs_zamek_bydgoszcz': 1,
    'hs_uniwersytet':     2,   // Akademia 1364 — przed Trembowlą 1366
    'hs_zamek_wschod':    3,
  };

  var QUEST_TEXTS_M02 = {
    'hs_zamek_krakow':    'Wawel wzniesiony! Jedź na północ — Bydgoszcz czeka.',
    'hs_zamek_bydgoszcz': 'Dwa zamki stoją. Teraz Akademia Krakowska — rok 1364.',
    'hs_uniwersytet':     'Akademia otwarta! Zbuduj ostatni zamek — Trembowla na wschodzie.',
    'hs_zamek_wschod':    'Wszystkie budowle gotowe. Polska murowana! ✓',
  };

  function updateQuestText(txt) {
    var el = document.getElementById('quest-text');
    if (el) el.textContent = txt;
  }

  // ── Milestone + granice ─────────────────────────────────────────
  function checkMilestones(builtHsId) {
    var b = mstate.castlesBuilt, u = mstate.universityBuilt;

    // Pasek czasu: 3 zamki (75%) + 1 univ (25%) = 100%
    var pct = (b / 3) * 75 + (u ? 25 : 0);
    var fill = document.getElementById('timeline-fill');
    if (fill) fill.style.height = Math.min(100, pct) + '%';

    // Zaznacz dokładnie ten milestone który odpowiada zbudowanemu hotspotowi
    var labels = document.querySelectorAll('.milestone');
    if (builtHsId !== undefined && MILESTONE_IDX[builtHsId] !== undefined) {
      var idx = MILESTONE_IDX[builtHsId];
      if (labels[idx]) labels[idx].classList.add('achieved');
    }

    if (builtHsId && QUEST_TEXTS_M02[builtHsId]) {
      updateQuestText(QUEST_TEXTS_M02[builtHsId]);
    }

    // Wygrana — czekaj aż WSZYSTKIE dialogi się skończą (NPC otwiera się z 400ms delay)
    if (b >= cfg.winCondition.castles && u) {
      setTimeout(function () {
        (function waitDlg() {
          if (JP.Dialogue.isOpen()) { setTimeout(waitDlg, 300); return; }
          setTimeout(showWin, 1200);
        })();
      }, 700);
    }
  }

  function expandBorder(stateKey) {
    var path = document.getElementById('poland-border');
    var d    = cfg.borders[stateKey];
    if (path && d) path.setAttribute('d', d);
  }

  function updateTreasury() {
    var el = document.getElementById('treasury-val');
    if (el) el.textContent = mstate.treasury;
  }

  // ── Wygrana ────────────────────────────────────────────────────
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
    document.getElementById('win-next').addEventListener('click', function () {
      JP.Engine.showScene('mission', { missionId: 'm03' });
    });
  }

  // ── Montaż sceny ───────────────────────────────────────────────
  function mountMission(container) {
    mstate = { treasury: _startTreasury(), castlesBuilt: 0, universityBuilt: false };

    container.innerHTML =
      '<div class="mission-layout">' +

        '<aside class="side-panel" id="side-panel">' +
          '<div class="side-panel__header">' +
            '<span class="side-panel__crown">♛</span>' +
            '<span class="side-panel__label">Polska</span>' +
          '</div>' +
          '<div class="poland-map">' +
            '<div class="poland-thumb-wrap" id="poland-thumb-wrap">' +
              '<img class="poland-thumb" id="poland-thumb" src="zintegrowana platforma edu/kazimierz - tereny i zamki.jpg" alt="Polska 1370" />' +
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
              '<div class="milestone"><span class="ms-year">1333</span><span class="ms-label">⚑ Wawel</span></div>' +
              '<div class="milestone"><span class="ms-year">1346</span><span class="ms-label">⚑ Bydgoszcz</span></div>' +
              '<div class="milestone"><span class="ms-year">1364</span><span class="ms-label">⚑ Akademia</span></div>' +
              '<div class="milestone"><span class="ms-year">1366</span><span class="ms-label">⚑ Trembowla</span></div>' +
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
            '<div class="hud-treasury"><span class="treasury-icon">💰</span><span id="treasury-val">500</span></div>' +
          '</div>' +

          '<div class="mission-intro" id="mission-intro">' +
            '<div class="intro-scroll">' +
              '<div class="intro-ornament">✦ ✦ ✦</div>' +
              '<h2 class="intro-title">' + cfg.title + '</h2>' +
              '<p class="intro-context">Król Władysław Łokietek opierał politykę na wojnach. Jego syn, Kazimierz Wielki przejął państwo okrojone i zrujnowane konfliktami, stając przed koniecznością jego pokojowej odbudowy.</p>' +
              '<p class="intro-frame">' + cfg.frame + '</p>' +
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
      JP.Engine.showScene('hub');
    });

    document.getElementById('btn-start-mission').addEventListener('click', function () {
      document.getElementById('mission-intro').classList.add('hidden');
      JP.Audio.play('explore');
      JP.Player.resume();
      JP.Player.bindKeys();
      window.addEventListener('keydown', handleInteract);
    });

    // Lightbox mapy historycznej
    document.getElementById('poland-thumb-wrap').addEventListener('click', function () {
      var lb = document.createElement('div');
      lb.className = 'map-lightbox';
      lb.innerHTML = '<span class="map-lightbox-close">✕</span><img src="zintegrowana platforma edu/kazimierz - tereny i zamki.jpg" alt="Polska 1370" />';
      document.body.appendChild(lb);
      lb.addEventListener('click', function () { document.body.removeChild(lb); });
    });

    // Inicjuj grę od razu — renderujemy mapę w tle za intro-overlayem
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
    JP.Player.init(9, 6);
    JP.Player.pause(); // gracz nieruchomy podczas intro

    loadImages(startLoop);
  }

  function startGame() { /* zachowane dla kompatybilności */ }

  return {
    config:       cfg,
    mountMission: mountMission,
  };
})();
