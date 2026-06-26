// m05_rozbiory.js — Misja 5: Rozbiory (1764–1795)
window.JP = window.JP || {};

JP.M05 = (function () {

  // ── Mapa 18×12 — Polska i sąsiedzi ────────────────────────────
  // 0=łąka  1=ścieżka  2=las/granica  3=woda  4=góry
  var MAP_M05 = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],  // 0  — Bałtyk (cały wiersz)
    [3,3,3,3,0,0,0,0,0,0,0,0,3,3,3,3,3,3],  // 1  — Wybrzeże gdańskie
    [2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],  // 2  — Północ (Mazowsze N / Podlasie)
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],  // 3  — Wielkopolska / Mazowsze
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],  // 4  — Centrum
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],  // 5  — Centrum (Warszawa)
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],  // 6  — Centrum-południe
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],  // 7  — Lublin / Wołyń
    [2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],  // 8  — Sandomierz / Podole
    [2,2,2,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],  // 9  — Małopolska (Kraków)
    [2,2,2,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2],  // 10 — Karpaty
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],  // 11
  ];

  var DECO_M05 = [
    // Lasy pruskie (zachód)
    {c:1, r:3, img:'tree3'}, {c:1, r:4, img:'tree3'}, {c:1, r:5, s:2}, {c:1, r:6, img:'tree4'}, {c:1, r:7, s:1},
    // Lasy rosyjskie (wschód)
    {c:14, r:2, s:2}, {c:16, r:3, s:0}, {c:16, r:4, img:'tree4'},
    {c:15, r:5, s:2}, {c:15, r:6, s:0}, {c:14, r:7, s:1},
    // Rozrzucone lasy w centrum
    {c:3,  r:2, s:1}, {c:12, r:2, s:2},
    {c:4,  r:3, img:'tree3'}, {c:10, r:3, s:1},
    {c:2,  r:4, s:2}, {c:3,  r:6, s:0},
    {c:2,  r:7, s:1}, {c:13, r:7, s:2},
    {c:2,  r:8, s:0}, {c:13, r:8, s:1},
    // Puszcze litewskie (NE)
    {c:12, r:4, s:2}, {c:13, r:5, s:0},
  ];

  // ── Config ─────────────────────────────────────────────────────
  var cfg = {
    id:    'm05',
    title: 'Rozbiory',
    frame: 'Oświecone odrodzenie i upadek Królestwa',
    dates: { start: 1764, end: 1795 },
    objective: 'Jako Stanisław August Poniatowski spróbuj ocalić Polskę. Reforma, opór, zdrada — i nieuchronny koniec.',
    introContext:
      'Rok 1763. Umarł August III Sas. Tron znów pusty. ' +
      'Rosja, Prusy i Austria uważnie obserwują słabą Rzeczpospolitą — jej liberum veto, ' +
      'skłócona szlachta i brak silnej armii to zaproszenie do rozbioru. ' +
      'Caryca Katarzyna II popiera wybór Poniatowskiego na króla — ale za cenę posłuszeństwa. ' +
      'Czy Stanisław August zdoła naprawić kraj, zanim będzie za późno?',

    npcs: {

      lubienski: {
        id:'lubienski', name:'Prymas Władysław Łubieński',
        portrait:'grafiki/art/portraits/m05_lubienski.png',
        lines:[
          'Umarł król August III Sas. Jako prymas sprawuję władzę w bezkrólewiu — tzw. interrex.',
          'Tron czeka. A sąsiedzi — Rosja, Prusy, Austria — już krążą wokół granic jak sępy.',
          'Lękam się, czyją marionetką będzie nowy król. Polska potrzebuje władcy silnego duchem — nie ciałem obcego monarchy.',
        ],
      },

      repnin: {
        id:'repnin', name:'Ambasador Nikołaj Repnin',
        portrait:'grafiki/art/portraits/m05_repnin.png',
        lines:[
          'Jestem ambasadorem Jej Imperatorskiej Mości, carycy Katarzyny II. To ja decyduję, które prawa Sejm uchwali — a które odrzuci.',
          'Liberum veto musi pozostać. Słaba, sparaliżowana Polska to Polska posłuszna. Tak chce Petersburg.',
          'Kilku senatorów odważyło się protestować. Kazałem ich pojmać i zesłać do Kaługi. Oto jak wygląda "wolność" pod moją ręką.',
        ],
      },

      konfederat: {
        id:'konfederat', name:'Kazimierz Pułaski — konfederat barski',
        portrait:'grafiki/art/portraits/m05_pulaski.png',
        lines:[
          'Jestem Kazimierz Pułaski. Zawiązaliśmy konfederację w Barze — roku 1768 — przeciw Rosji i jej marionetkowemu królowi.',
          'Szlachta polska nie da się zakuć w rosyjskie łańcuchy! Walczymy za wiarę i wolność, choć jesteśmy nieliczni.',
          'Konfederacja upadnie — to wiem. Ale jej krew zasieje ziarno oporu, który nie zginie.',
        ],
      },

      katarzyna: {
        id:'katarzyna', name:'Katarzyna II — caryca Rosji',
        portrait:'grafiki/art/portraits/m05_katarzyna.png',
        lines:[
          'Nie potrzebuję podbijać Polski siłą. Wystarczy, że nie pozwolę jej się naprawić.',
          'Liberum veto to mój najlepszy sprzymierzeniec — jeden poseł może zablokować każdą reformę.',
          'Każdy rozbiór odcina kolejny płat terytorium. Prusy i Austria chętnie dzielą się łupem. To bardzo… wygodne.',
        ],
      },

      kollataj: {
        id:'kollataj', name:'Hugo Kołłątaj — reformator',
        portrait:'grafiki/art/portraits/m05_kollataj.png',
        lines:[
          'Jestem Hugo Kołłątaj. Razem z Ignacym Potockim i Małachowskim przez lata pisaliśmy projekt nowej konstytucji.',
          'Konstytucja 3 Maja to nie tylko papier — to akt odrodzenia. Znosimy liberum veto, wzmacniamy władzę wykonawczą, dajemy miastom prawa.',
          'Jeśli Polska ma przeżyć, musi stać się nowoczesnym państwem. Mamy może kilka lat, zanim sąsiedzi zareagują.',
        ],
      },

      targowiczanin: {
        id:'targowiczanin', name:'Szczęsny Potocki — targowiczanin',
        portrait:'grafiki/art/portraits/m05_potocki.png',
        lines:[
          'Konfederacja Targowicka broni złotej wolności szlachty! Wasza Konstytucja odbiera nam przywileje.',
          'Wezwałem rosyjskie wojsko, by przywróciło dawny porządek. Nazwą mnie zdrajcą — ale ja bronię praw szlacheckich.',
          'Historia mnie osądzi. Lecz tej Konstytucji nie wolno dopuścić do życia.',
        ],
      },

      kosciuszko: {
        id:'kosciuszko', name:'Tadeusz Kościuszko — Naczelnik',
        portrait:'grafiki/art/portraits/m05_kosciuszko.png',
        lines:[
          'Mam na imię Tadeusz Kościuszko. Przysięgam na krakowskim rynku walczyć za całość granic, wolność i niepodległość.',
          'Chłopi przyszli do mnie z kosami — nie mają mundurów, nie mają muszkietów. Ale mają odwagę. Pod Racławicami to wystarczyło.',
          'Powstanie przegrane. Ale naród, który się bije — nie jest narodem martwym.',
        ],
      },

      kosynier: {
        id:'kosynier', name:'Bartosz Głowacki — kosynier',
        portrait:'grafiki/art/portraits/m05_glowacki.png',
        lines:[
          'Jestem chłop. Mam na imię Wojciech Głowacki, lecz wszyscy wołają na mnie Bartosz.',
          'Nie mam munduru — mam kosę postawioną na sztorc. Pod Racławicami zdobyłem rosyjskie armaty gołymi rękami. Kościuszko nadał mi szlachectwo.',
          'Walczę za Polskę, choć pańszczyzna nigdy nie była dla mnie łaskawa. Kościuszko obiecał nam wolność.',
        ],
      },

    },

    hotspots: [

      // ── KLASTER 1: Koronacja (1764) ───────────────────────────
      // Prymas tuż na NW od pola elekcyjnego — gracz widzi oba naraz
      { id:'hs_lubienski',  col:6,  row:4, type:'npc',     label:'Prymas Łubieński',
        npcId:'lubienski' },
      { id:'hs_elekcja',    col:8,  row:5, type:'budynek', label:'Pole elekcyjne — Warszawa 1764',
        buildType:'zamek', cost:0 },

      // ── KLASTER 2: I Rozbiór (1767–1772) ─────────────────────
      // Repnin na NE od Warszawy, Bar na SW — I Rozbiór w górze między nimi
      { id:'hs_repnin',     col:11, row:4, type:'npc',     label:'Ambasador Repnin',
        npcId:'repnin' },
      { id:'hs_bar',        col:4,  row:7, type:'npc',     label:'Pułaski — Bar 1768',
        npcId:'konfederat' },
      { id:'hs_rozbiór1',   col:8,  row:3, type:'budynek', label:'I Rozbiór — 1772',
        buildType:'monastery', cost:0 },
      // Katarzyna daleko na E — dalekie imperium
      { id:'hs_katarzyna',  col:15, row:3, type:'npc',     label:'Katarzyna II — Petersburg',
        npcId:'katarzyna' },

      // ── KLASTER 3: Odbudowa (1773–1780) ──────────────────────
      // KEN i Kołłątaj blisko siebie w centrum, Łazienki odrobinę na SE
      { id:'hs_ken',        col:6,  row:6, type:'budynek', label:'KEN — Komisja Edukacji 1773',
        buildType:'szkola', cost:0 },
      { id:'hs_obiady',     col:8,  row:7, type:'npc',     label:'Kołłątaj — Obiady Czwartkowe',
        npcId:'kollataj' },
      { id:'hs_lazienki',   col:10, row:7, type:'budynek', label:'Łazienki — park królewski',
        buildType:'lazienki', cost:0 },

      // ── KLASTER 4: Konstytucja (1791) ────────────────────────
      // Zamek Królewski — odrobinę E od Koronacji, ale w tej samej osi Warszawy
      { id:'hs_konstytucja',col:10, row:5, type:'budynek', label:'Konstytucja 3 Maja 1791',
        buildType:'zamek', cost:0 },

      // ── KLASTER 5: Targowica i II Rozbiór (1792–1793) ────────
      // Potocki i Zieleńce blisko na E, II Rozbiór na N — trójkąt
      { id:'hs_targowica',  col:13, row:6, type:'npc',     label:'Potocki — Targowica',
        npcId:'targowiczanin' },
      { id:'hs_zielence',   col:14, row:5, type:'battle',  label:'⚔ Zieleńce — 1792' },
      { id:'hs_rozbiór2',   col:12, row:3, type:'budynek', label:'II Rozbiór — 1793',
        buildType:'monastery', cost:0 },

      // ── KLASTER 6: Kościuszko i abdykacja (1794–1795) ────────
      // Kosynier + Kościuszko razem na S (Kraków), Racławice obok, Abdykacja daleko NE
      { id:'hs_kosynier',   col:4,  row:9, type:'npc',     label:'Bartosz Głowacki — kosynier',
        npcId:'kosynier' },
      { id:'hs_kosciuszko', col:6,  row:9, type:'npc',     label:'Kościuszko — Kraków 1794',
        npcId:'kosciuszko' },
      { id:'hs_raclawicka', col:8,  row:9, type:'battle',  label:'⚔ Racławice — 1794' },
      { id:'hs_abdykacja',  col:14, row:4, type:'budynek', label:'Abdykacja — Grodno 1795',
        buildType:'monastery', cost:0 },

      // ── Easter egg ────────────────────────────────────────────
      { id:'hs_egg',        col:9,  row:7, type:'egg',     label:'Strzęp nut w ruinach Warszawy',
        eggId:'egg_m05_mazurek', hidden: true },
    ],

    milestoneLabels: [
      { year: '1764', label: '👑 Koronacja' },
      { year: '1772', label: '📜 I Rozbiór' },
      { year: '1773', label: '🏫 KEN' },
      { year: '1775', label: '🌿 Łazienki' },
      { year: '1791', label: '📜 Konstytucja 3 Maja' },
      { year: '1792', label: '⚔ Zieleńce' },
      { year: '1793', label: '📜 II Rozbiór' },
      { year: '1794', label: '⚔ Racławice' },
      { year: '1795', label: '📜 Abdykacja' },
    ],

    outcome: {
      badge: '1795 — Polska znika z mapy.',
      text:
        'Stanisław August Poniatowski podpisał abdykację w Grodnie 25 listopada 1795 roku. ' +
        'Trzeci rozbiór wymazał Polskę z mapy Europy na 123 lata. ' +
        'Rosja, Prusy i Austria podzieliły między siebie całe terytorium Rzeczpospolitej. ' +
        'Ale Konstytucja 3 Maja, krew kosynierów spod Racławic i pieśń Mazurka Dąbrowskiego ' +
        'ocalały w pamięci narodu. Polska nie zginęła — czekała.',
    },
  };

  var MILESTONE_IDX = {
    hs_elekcja:    0,
    hs_rozbiór1:   1,
    hs_ken:        2,
    hs_lazienki:   3,
    hs_konstytucja:4,
    hs_zielence:   5,
    hs_rozbiór2:   6,
    hs_raclawicka: 7,
    hs_abdykacja:  8,
  };

  var QUEST_TEXTS_M05 = {
    hs_elekcja:    'Jesteś królem! Porozmawiaj z Repninem — i z konfederatami w Barze.',
    hs_rozbiór1:   'I Rozbiór za nami. Czas odbudowy — powołaj KEN.',
    hs_ken:        'KEN założona! Wybuduj Łazienki królewskie.',
    hs_lazienki:   'Łazienki otwarte! Porozmawiaj z Kołłątajem na Obiadach Czwartkowych.',
    hs_konstytucja:'Konstytucja 3 Maja uchwalona! Targowica zbiera sojuszników…',
    hs_zielence:   'Bitwa pod Zieleńcami stoczona. Polska kapituluje — podpisz II Rozbiór.',
    hs_rozbiór2:   'II Rozbiór. Kościuszko przysięga w Krakowie — idź do niego.',
    hs_raclawicka: 'Powstanie upadło. Jedź do Grodna podpisać abdykację.',
    hs_abdykacja:  'W gruzach Warszawy leży strzęp nut — znajdź je.',
    hs_egg:        'Polska nie zginęła — czekała 123 lata. ✓',
  };

  function updateQuestText(txt) {
    var el = document.getElementById('quest-text');
    if (el) el.textContent = txt;
  }

  // ── Stan misji ──────────────────────────────────────────────────
  var mstate = {};

  function _resetState() {
    mstate = {
      phase:           'koronacja',  // 'koronacja'|'konfederacja'|'odbudowa'|'konstytucja'|'targowica'|'kosciuszko'
      lubienskiMet:    false,
      koronowany:      false,
      repninMet:       false,
      katarzynaMet:    false,
      barMet:          false,
      rozbiór1:        false,
      kenBuilt:        false,
      lazienkiBuilt:   false,
      obiady:          false,
      konstytucja:     false,
      targowicaMet:    false,
      zielence:        false,        // bitwa — stub
      rozbiór2:        false,
      kosciuszkoMet:   false,
      kosynierMet:     false,
      raclawicka:      false,        // bitwa — stub
      abdykacja:       false,
      eggCollected:    false,
    };
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
      { text: '⚡  PRUSY',    col: 0.5,row: 3,   color: '#8899cc' },
      { text: '🐻  ROSJA',    col: 17, row: 5,   color: '#cc5555' },
      { text: '🦅  AUSTRIA',  col: 6,  row: 10.6,color: '#ccaa33' },
      { text: '⚜  WARSZAWA', col: 9,  row: 4.5, color: '#ffd700' },
      { text: '✝  KRAKÓW',    col: 6,  row: 9.5, color: '#dddddd' },
      { text: '⚑  LITWA',     col: 13, row: 3,   color: '#77aa66' },
      { text: '▲  KARPATY',   col: 7,  row: 10.3,color: '#998866' },
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

  function _updatePhaseLabel(txt) {
    var el = document.getElementById('map-phase-label');
    if (el) el.textContent = txt;
  }

  var MAP_SRCS = {
    start:   'zintegrowana platforma edu/za jagiellonow.jpg',
    rozb1:   'zintegrowana platforma edu/I rozbior.jpg',
    rozb2:   'zintegrowana platforma edu/II rozbior.jpg',
    rozb3:   'zintegrowana platforma edu/III rozbior.jpg',
  };

  function _setMapThumb(key) {
    var src = MAP_SRCS[key];
    if (!src) return;
    var img = document.getElementById('map-rozbiory');
    if (!img) return;
    img.style.opacity = '0';
    setTimeout(function () {
      img.src = src;
      img.style.opacity = '1';
    }, 400);
  }

  // ── Główna logika hotspotów ────────────────────────────────────
  function triggerHotspot(h) {

    // ── Easter egg ───────────────────────────────────────────────
    if (h.type === 'egg') {
      if (h.collected) return;
      JP.State.addEgg(h.eggId);
      JP.Hotspots.markCollected(h.id);
      mstate.eggCollected = true;
      JP.Audio.playOnce('hymn');
      JP.Dialogue.info(
        '🎵 Jeszcze Polska nie zginęła',
        'W gruzach spalonej Warszawy leży strzęp nut.\n\n' +
        'To Mazurek Dąbrowskiego — pieśń napisana przez Józefa Wybickiego w 1797 roku, ' +
        'dwa lata po rozbiorach, dla Legionów Polskich we Włoszech.\n\n' +
        '"Jeszcze Polska nie zginęła, kiedy my żyjemy…"\n\n' +
        'Polska zniknęła z mapy — ale nie z serc. Po 123 latach — w 1918 roku — wróci.',
        'Jeszcze Polska nie zginęła ✦',
        function () {
          setTimeout(showWin, 3000);
        },
        'grafiki/art/portraits/egg_m05_nuty.png'
      );
      return;
    }

    // ── Bitwy — stuby ────────────────────────────────────────────
    if (h.type === 'battle') {

      if (h.id === 'hs_zielence') {
        if (mstate.phase !== 'targowica') {
          JP.Dialogue.toast('Bitwa pod Zieleńcami nastąpi po zawiązaniu Targowicy.');
          return;
        }
        if (mstate.zielence) { JP.Dialogue.toast('Bitwa pod Zieleńcami stoczona. ✓'); return; }
        stopLoop();
        JP.Player.pause();
        window.removeEventListener('keydown', handleInteract);
        JP.Combat.start('zielence', function () {
          startLoop();
          JP.Player.resume();
          window.addEventListener('keydown', handleInteract);
          mstate.zielence = true;
          JP.Hotspots.markBuilt('hs_zielence');
          checkMilestones('hs_zielence');
          setTimeout(function () {
            JP.Dialogue.info(
              '⚔ Bitwa pod Zieleńcami — 18 VI 1792',
              'Książę Józef Poniatowski i generał Tadeusz Kościuszko pobili Rosjan pod Zieleńcami. ' +
              'Król Stanisław August ustanowił Order Virtuti Militari — pierwsze polskie odznaczenie wojskowe.\n\n' +
              'Mimo zwycięstwa bitewnego, przewaga Rosji była druzgocąca. ' +
              'Targowiczanie wzywali kolejne pułki. Król — wbrew żołnierzom — zdecydował się kapitulować.',
              'Dalej',
              function () { _switchToRozbiór2(); },
              'grafiki/art/portraits/m05_poniatowski.png'
            );
          }, 600);
        });
        return;
      }

      if (h.id === 'hs_raclawicka') {
        if (mstate.phase !== 'kosciuszko') {
          JP.Dialogue.toast('Kościuszko jeszcze nie ogłosił insurekcji.');
          return;
        }
        if (!mstate.kosciuszkoMet) {
          JP.Dialogue.toast('Najpierw porozmawiaj z Kościuszką na rynku krakowskim.');
          return;
        }
        if (mstate.raclawicka) { JP.Dialogue.toast('Bitwa pod Racławicami stoczona. ✓'); return; }
        stopLoop();
        JP.Player.pause();
        window.removeEventListener('keydown', handleInteract);
        // Racławice (wygrana) → od razu Maciejowice (klęska) — dwie bitwy pod rząd
        JP.Combat.start('raclawice', function () {
          JP.Combat.start('maciejowice', function () {
            startLoop();
            JP.Player.resume();
            window.addEventListener('keydown', handleInteract);
            mstate.raclawicka = true;
            mstate.abdykacja  = true;
            JP.Hotspots.markBuilt('hs_raclawicka');
            JP.Hotspots.markBuilt('hs_abdykacja');
            checkMilestones('hs_raclawicka');
            checkMilestones('hs_abdykacja');
            _setMapThumb('rozb3');
            _updatePhaseLabel('Koniec Rzeczpospolitej · 1795');
            setTimeout(function () {
              JP.Dialogue.info(
                '⚔ Polska upada — październik 1794',
                'Ranny Kościuszko dostał się do rosyjskiej niewoli. Powstanie dogasa.\n\n' +
                'Rosja, Prusy i Austria dokonują III rozbioru. Polska znika z mapy Europy — na 123 lata.\n\n' +
                'W gruzach spalonej Warszawy coś leży. Znajdź to, zanim opuścisz miasto.',
                'Szukam... ✦',
                function () {
                  var eggH = JP.Hotspots.getById('hs_egg');
                  if (eggH) eggH.hidden = false;
                  updateQuestText(QUEST_TEXTS_M05.hs_abdykacja);
                  JP.Dialogue.toast('W gruzach Warszawy coś błyszczy...');
                },
                'grafiki/art/portraits/m05_kosciuszko.png'
              );
            }, 800);
          });
        });
        return;
      }

      return;
    }

    // ════════════════════════════════════════════════════════════
    // ── FAZA: KORONACJA ─────────────────────────────────────────

    if (h.id === 'hs_lubienski') {
      JP.Dialogue.open(cfg.npcs.lubienski, function () {
        mstate.lubienskiMet = true;
        if (!mstate.koronowany) {
          JP.Dialogue.toast('Prymas wskazuje drogę — jedź na pole elekcyjne w Warszawie.');
        }
      });
      return;
    }

    if (h.id === 'hs_elekcja') {
      if (!mstate.lubienskiMet) {
        JP.Dialogue.toast('Najpierw porozmawiaj z Prymasem Łubieńskim.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('Koronacja odbyła się — Stanisław August królem Polski. ✓'); return; }
      JP.Dialogue.confirm(
        '👑 Koronacja — Warszawa, 1764',
        'Na polu elekcyjnym pod Warszawą szlachta obwołuje Stanisława Augusta królem. ' +
        'Wybór popiera ambasador Repnin — bo za nim stoi Rosja Katarzyny II. ' +
        'Korona zdobyta — lecz Poniatowski zapłaci za nią cenę przez całe panowanie.',
        function () {
          mstate.koronowany = true;
          JP.Hotspots.markBuilt('hs_elekcja');
          checkMilestones('hs_elekcja');
          _updatePhaseLabel('Stanisław August · 1764');
          setTimeout(function () { mstate.phase = 'konfederacja'; }, 500);
          setTimeout(function () {
            JP.Dialogue.info(
              '👑 Stanisław August królem!',
              'Jesteś królem Polski. Lecz za twoim tronem stoi Rosja.\n\nPorozmawiaj z ambasadorem Repninem — czeka na wschodzie.',
              'Rozumiem',
              null, 'grafiki/art/portraits/m05_repnin.png'
            );
          }, 600);
        },
        null,
        'Przyjmij koronę 👑', 'grafiki/art/portraits/m05_lubienski.png'
      );
      return;
    }

    // ════════════════════════════════════════════════════════════
    // ── FAZA: KONFEDERACJA BARSKA i I ROZBIÓR ───────────────────

    if (h.id === 'hs_repnin') {
      if (!mstate.koronowany) {
        JP.Dialogue.toast('Repnin zjawi się po koronacji Stanisława Augusta.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.repnin, function () {
        mstate.repninMet = true;
        if (!mstate.barMet) {
          JP.Dialogue.toast('Repnin rządzi Sejmem. Na zachodzie szlachta się buntuje — jedź do Baru.');
        }
      });
      return;
    }

    if (h.id === 'hs_katarzyna') {
      if (!mstate.koronowany) {
        JP.Dialogue.toast('Katarzyna II pojawi się po koronacji Stanisława Augusta.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.katarzyna, function () {
        mstate.katarzynaMet = true;
      });
      return;
    }

    if (h.id === 'hs_bar') {
      if (!mstate.repninMet) {
        JP.Dialogue.toast('Najpierw porozmawiaj z ambasadorem Repninem.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.konfederat, function () {
        mstate.barMet = true;
        if (!mstate.rozbiór1) {
          JP.Dialogue.toast('Konfederacja barska upadnie. Sąsiedzi żądają terytoriów — jedź podpisać I rozbiór.');
        }
      });
      return;
    }

    if (h.id === 'hs_rozbiór1') {
      if (!mstate.barMet) {
        JP.Dialogue.toast('Najpierw odwiedź konfederatów w Barze.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('I Rozbiór podpisany — 1772. ✓'); return; }
      JP.Dialogue.confirm(
        '📜 I Rozbiór — 1772',
        'Rosja, Prusy i Austria wymuszają podpisanie traktatu rozbiorowego. ' +
        'Polska traci około 30% terytorium i 35% ludności.\n\n' +
        'Prusy biorą Prusy Królewskie (bez Gdańska i Torunia) oraz część Wielkopolski. ' +
        'Rosja bierze wschodnią Białoruś i Inflanty Polskie. ' +
        'Austria zajmuje Galicję — ziemie na południe od Sanu i Wisły, z Lwowem i Krakowem w zasięgu wpływów.',
        function () {
          mstate.rozbiór1 = true;
          JP.Hotspots.markBuilt('hs_rozbiór1');
          checkMilestones('hs_rozbiór1');
          _setMapThumb('rozb1');
          _updatePhaseLabel('Polska po I rozbiorze · 1772');
          JP.Dialogue.toast('Polska skurczyła się. Czas zacząć odbudowę — jedź do Warszawy.');
          setTimeout(function () { mstate.phase = 'odbudowa'; }, 500);
        },
        null,
        'Podpisz traktat 📜', 'grafiki/art/portraits/m05_katarzyna.png'
      );
      return;
    }

    // ════════════════════════════════════════════════════════════
    // ── FAZA: ODBUDOWA ──────────────────────────────────────────

    if (h.id === 'hs_ken') {
      if (mstate.phase !== 'odbudowa' && mstate.phase !== 'konstytucja') {
        JP.Dialogue.toast('KEN powstanie po I rozbiorze, w fazie odbudowy.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('Komisja Edukacji Narodowej działa. ✓'); return; }
      JP.Dialogue.confirm(
        '🏫 Komisja Edukacji Narodowej — 1773',
        'Stanisław August powołuje KEN — pierwsze na świecie państwowe ministerstwo oświaty. ' +
        'Nowe programy szkolne, podręczniki po polsku, szkoły dla mieszczan i szlachty. ' +
        'Polska nie może wygrać wojną — może wygrać wykształceniem.',
        function () {
          mstate.kenBuilt = true;
          JP.Hotspots.markBuilt('hs_ken');
          checkMilestones('hs_ken');
          JP.Dialogue.toast('🏫 KEN założona! Wybuduj teraz Łazienki.');
        },
        null,
        'Powołaj KEN 🏫', 'grafiki/art/portraits/m05_kollataj.png'
      );
      return;
    }

    if (h.id === 'hs_lazienki') {
      if (!mstate.kenBuilt) {
        JP.Dialogue.toast('Najpierw powołaj Komisję Edukacji Narodowej.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('Park Łazienkowski wybudowany. ✓'); return; }
      JP.Dialogue.confirm(
        '🌿 Łazienki — park królewski — Warszawa',
        'Stanisław August przekształca dawny zwierzyniec w piękną rezydencję z parkiem. ' +
        'Pałac na Wodzie, Świątynia Sybilli, amfiteatr — centrum kultury i sztuki. ' +
        'Król gromadzi dzieła sztuki, mecenasuje artystom. ' +
        'W kraju tracącym granice — ocalić przynajmniej ducha narodu.',
        function () {
          mstate.lazienkiBuilt = true;
          JP.Hotspots.markBuilt('hs_lazienki');
          checkMilestones('hs_lazienki');
          JP.Dialogue.toast('🌿 Łazienki otwarte! Porozmawiaj z Kołłątajem o Czwartkach.');
        },
        null,
        'Wybuduj Łazienki 🌿', 'grafiki/art/portraits/m05_lubienski.png'
      );
      return;
    }

    if (h.id === 'hs_obiady') {
      if (!mstate.lazienkiBuilt) {
        JP.Dialogue.toast('Najpierw wybuduj Łazienki — to one staną się centrum kultury.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.kollataj, function () {
        mstate.obiady = true;
        if (!mstate.konstytucja) {
          JP.Dialogue.toast('Obiady Czwartkowe zebrały najlepsze umysły. Czas na Konstytucję — jedź na Zamek Królewski!');
          mstate.phase = 'konstytucja';
          _updatePhaseLabel('Wielki Sejm · 1788–1791');
          updateQuestText('Obiady Czwartkowe — czas na Konstytucję! Jedź na Zamek Królewski.');
        }
      });
      return;
    }

    // ════════════════════════════════════════════════════════════
    // ── FAZA: KONSTYTUCJA ───────────────────────────────────────

    if (h.id === 'hs_konstytucja') {
      if (mstate.phase !== 'konstytucja') {
        JP.Dialogue.toast('Konstytucja będzie możliwa po fazie odbudowy — porozmawiaj najpierw z Kołłątajem.');
        return;
      }
      if (!mstate.obiady) {
        JP.Dialogue.toast('Najpierw spotkaj się z Kołłątajem na Obiadach Czwartkowych.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('Konstytucja 3 Maja uchwalona. ✓'); return; }
      JP.Dialogue.confirm(
        '📜 Konstytucja 3 Maja 1791',
        'Na Zamku Królewskim w Warszawie Sejm Czteroletni uchwala Konstytucję — ' +
        'drugą na świecie po amerykańskiej. ' +
        'Liberum veto zniesione. Władza wykonawcza wzmocniona. ' +
        'Mieszczanie otrzymują prawa. Chłopi — opiekę prawa. ' +
        'To ostatnia szansa na uratowanie Polski.',
        function () {
          mstate.konstytucja = true;
          JP.Hotspots.markBuilt('hs_konstytucja');
          checkMilestones('hs_konstytucja');
          _updatePhaseLabel('Konstytucja 3 Maja · 1791');
          JP.Dialogue.toast('📜 Konstytucja uchwalona! Ale Targowica już zbiera sojuszników…');
          setTimeout(function () { mstate.phase = 'targowica'; }, 500);
        },
        null,
        'Uchwał Konstytucję 📜', 'grafiki/art/portraits/m05_kollataj.png'
      );
      return;
    }

    // ════════════════════════════════════════════════════════════
    // ── FAZA: TARGOWICA i II ROZBIÓR ────────────────────────────

    if (h.id === 'hs_targowica') {
      if (mstate.phase !== 'targowica') {
        JP.Dialogue.toast('Targowica pojawi się po uchwaleniu Konstytucji.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.targowiczanin, function () {
        mstate.targowicaMet = true;
        if (!mstate.zielence) {
          JP.Dialogue.toast('Targowiczanie wezwali Rosjan. Wojsko polskie stoi pod Zieleńcami!');
        }
      });
      return;
    }

    if (h.id === 'hs_rozbiór2') {
      if (!mstate.zielence) {
        JP.Dialogue.toast('Najpierw stoczyć bitwę pod Zieleńcami.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('II Rozbiór podpisany — 1793. ✓'); return; }
      JP.Dialogue.confirm(
        '📜 II Rozbiór — 1793',
        'Mimo zwycięstwa pod Zieleńcami, Polska kapituluje wobec przewagi Rosji i Prus. ' +
        'Kraj traci kolejne 300 000 km² — Gdańsk, Toruń, Poznań przechodzą do Prus, ' +
        'ogromne obszary Ukrainy i Białorusi — do Rosji. ' +
        'Pozostaje ledwie rdzenne terytorium.',
        function () {
          mstate.rozbiór2 = true;
          JP.Hotspots.markBuilt('hs_rozbiór2');
          checkMilestones('hs_rozbiór2');
          _setMapThumb('rozb2');
          _updatePhaseLabel('Polska po II rozbiorze · 1793');
          JP.Dialogue.toast('Polska skurczyła się do resztek. Kościuszko przysięga na rynku krakowskim — idź do niego.');
          setTimeout(function () {
            mstate.phase = 'kosciuszko';
            _updatePhaseLabel('Insurekcja Kościuszkowska · 1794');
          }, 500);
        },
        null,
        'Podpisz traktat 📜', 'grafiki/art/portraits/m05_repnin.png'
      );
      return;
    }

    // ════════════════════════════════════════════════════════════
    // ── FAZA: KOŚCIUSZKO i III ROZBIÓR ──────────────────────────

    if (h.id === 'hs_kosciuszko') {
      if (mstate.phase !== 'kosciuszko') {
        JP.Dialogue.toast('Kościuszko ogłosi insurekcję po II rozbiorze.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.kosciuszko, function () {
        mstate.kosciuszkoMet = true;
        if (!mstate.kosynierMet) {
          JP.Dialogue.toast('Kościuszko gotów. Porozmawiaj też z kosynierem Głowackim.');
        } else {
          JP.Dialogue.toast('Kosynierzy gotowi! Jedź pod Racławice!');
        }
      });
      return;
    }

    if (h.id === 'hs_kosynier') {
      if (mstate.phase !== 'kosciuszko') {
        JP.Dialogue.toast('Kosynierzy dołączą do insurekcji — wróć w fazie Kościuszki.');
        return;
      }
      JP.Dialogue.open(cfg.npcs.kosynier, function () {
        mstate.kosynierMet = true;
        if (mstate.kosciuszkoMet && !mstate.raclawicka) {
          JP.Dialogue.toast('Kosynierzy gotowi! Jedź pod Racławice!');
        } else if (!mstate.kosciuszkoMet) {
          JP.Dialogue.toast('Porozmawiaj jeszcze z Kościuszką na rynku krakowskim.');
        }
      });
      return;
    }

    if (h.id === 'hs_abdykacja') {
      if (!mstate.raclawicka) {
        JP.Dialogue.toast('Abdykacja nastąpi po upadku powstania kościuszkowskiego.');
        return;
      }
      if (h.built) { JP.Dialogue.toast('Abdykacja podpisana — Polska zniknęła z mapy. ✓'); return; }
      JP.Dialogue.confirm(
        '📜 Abdykacja — Grodno, 25 XI 1795',
        'Stanisław August Poniatowski podpisuje akt abdykacji w Grodnie. ' +
        'Trzy mocarstwa — Rosja, Prusy, Austria — dzielą między siebie resztki Rzeczpospolitej. ' +
        'Polska znika z mapy Europy.\n\n' +
        'Na 123 lata.',
        function () {
          mstate.abdykacja = true;
          JP.Hotspots.markBuilt('hs_abdykacja');
          checkMilestones('hs_abdykacja');
          var eggH = JP.Hotspots.getById('hs_egg');
          if (eggH) eggH.hidden = false;
          _setMapThumb('rozb3');
          _updatePhaseLabel('Koniec Rzeczpospolitej · 1795');
          JP.Dialogue.info(
            '📜 Koniec — lecz nie zgon',
            'Polska zniknęła z mapy Europy.\n\n' +
            'Ale w gruzach Warszawy coś leży — strzęp starych nut.\n' +
            'Znajdź je, zanim opuścisz to miasto.',
            'Idę szukać ✦',
            null, 'dokument'
          );
        },
        null,
        'Podpisz abdykację 📜', 'grafiki/art/portraits/m05_katarzyna.png'
      );
      return;
    }

    // Fallback
    var npc = h.npcId && cfg.npcs[h.npcId];
    if (npc) JP.Dialogue.open(npc);
  }

  // ── Przejście po Zieleńcach → II rozbiór ───────────────────────
  function _switchToRozbiór2() {
    JP.Dialogue.toast('Kapitulacja. Jedź podpisać II Rozbiór na północ.');
    _updatePhaseLabel('II Rozbiór · 1793');
  }

  // ── Przejście po Racławicach → Abdykacja ────────────────────────
  function _switchToAbdykacja() {
    JP.Dialogue.toast('Powstanie upadło. Jedź do Grodna podpisać abdykację.');
    _updatePhaseLabel('Abdykacja · 1795');
  }

  // ── Milestones ──────────────────────────────────────────────────
  function checkMilestones(doneId) {
    var flags = [
      mstate.koronowany,
      mstate.rozbiór1,
      mstate.kenBuilt,
      mstate.lazienkiBuilt,
      mstate.konstytucja,
      mstate.zielence,
      mstate.rozbiór2,
      mstate.raclawicka,
      mstate.abdykacja,
    ];
    var count = flags.filter(Boolean).length;
    var fill = document.getElementById('timeline-fill');
    if (fill) fill.style.height = Math.round((count / 9) * 100) + '%';

    var idx = MILESTONE_IDX[doneId];
    if (idx !== undefined) {
      var labels = document.querySelectorAll('.milestone');
      if (labels[idx]) labels[idx].classList.add('achieved');
    }

    if (QUEST_TEXTS_M05[doneId]) updateQuestText(QUEST_TEXTS_M05[doneId]);

    if (flags.every(Boolean) && mstate.eggCollected) {
      setTimeout(function () {
        (function waitDlg() {
          if (JP.Dialogue.isOpen()) { setTimeout(waitDlg, 300); return; }
          setTimeout(showWin, 1200);
        })();
      }, 700);
    }
  }

  // ── Ekran końcowy ───────────────────────────────────────────────
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
        '<p class="win-text" style="margin-top:1.2em;font-style:italic;opacity:0.85;">' +
          'Dziękujemy za wspólną podróż przez tysiąc lat historii Polski.' +
        '</p>' +
        '<div class="win-btn-row">' +
          '<button class="btn-primary" id="win-back">← Strona główna</button>' +
        '</div>' +
      '</div>';
    scene.appendChild(win);
    document.getElementById('win-back').addEventListener('click', function () {
      JP.Audio.play('hub');
      JP.Engine.showScene('hub');
    });
  }

  // ── Montaż sceny ────────────────────────────────────────────────
  function mountMission(container) {
    _resetState();
    JP.Tilemap.setMap(MAP_M05, DECO_M05);

    container.innerHTML =
      '<div class="mission-layout">' +

        '<aside class="side-panel" id="side-panel">' +
          '<div class="side-panel__header">' +
            '<span class="side-panel__crown">⚜</span>' +
            '<span class="side-panel__label">Rozbiory</span>' +
          '</div>' +

          '<div class="poland-map">' +
            '<div class="poland-thumb-wrap" id="poland-thumb-wrap">' +
              '<img id="map-rozbiory" class="poland-thumb"' +
              '     src="zintegrowana platforma edu/za jagiellonow.jpg"' +
              '     alt="Polska — 1764"' +
              '     style="width:100%;display:block;filter:brightness(0.42);transition:opacity 0.6s ease;" />' +
              '<span class="poland-thumb-hint">🔍 kliknij</span>' +
            '</div>' +
            '<div id="map-phase-label" style="text-align:center;font-size:0.7rem;color:var(--gold);margin-top:4px;font-family:var(--font-serif);">Stanisław August · 1764</div>' +
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
      var img = document.getElementById('map-rozbiory');
      var src = img ? img.src : MAP_SRCS.start;
      var lb = document.createElement('div');
      lb.className = 'map-lightbox';
      lb.innerHTML = '<span class="map-lightbox-close">✕</span><img src="' + src + '" alt="Mapa Polski" />';
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
    JP.Player.init(9, 6);
    JP.Player.pause();
    JP.Player.setHeadSymbol('crown');

    loadImages(startLoop);
  }

  return {
    config:       cfg,
    mountMission: mountMission,
  };

})();
