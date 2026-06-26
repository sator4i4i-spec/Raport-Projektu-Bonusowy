// tilemap.js — mapa kafelkowa i jej rendering na canvas
window.JP = window.JP || {};

JP.Tilemap = (function () {
  var T = 64; // rozmiar kafla w px

  // Typy kafelków
  var GRASS = 0, PATH = 1, TREE = 2, WATER = 3, MOUNTAIN = 4;

  // Mapa 18×12 — kształt kafli odzwierciedla granice Polski ok. 1333–1370
  // 0=trawa (Polska, chodna)  1=ścieżka (droga)  2=las/ziemia obca (blokuje)
  // 3=woda (Bałtyk, blokuje)  4=góra/Karpaty (blokuje)
  //
  //   Bałtyk (rząd 0)
  //   Krzyżacy / obca ziemia (rząd 1, górne krawędzie)
  //   Polska właściwa (rzędy 2–8): kształt rosnący na wschód ku Rusi
  //   Karpaty (rzędy 9–10 po lewej i centrum)
  //   Granica (rząd 11)
  var MAP = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],  // 0 — Morze Bałtyckie
    [2,2,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2],  // 1 — Państwo Zakonu / wybrzeże
    [2,2,2,2,0,0,0,0,0,2,2,2,2,2,2,2,2,2],  // 2 — Kujawy / Mazowsze N (wąsko)
    [2,2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],  // 3 — Mazowsze / Wielkopolska N
    [2,2,0,0,0,0,0,1,1,0,0,1,1,0,0,0,2,2],  // 4 — Wielkopolska + brama Wawelu
    [2,0,0,0,0,0,0,1,0,0,0,0,1,0,0,2,2,2],  // 5 — Rdzeń kraju (najszerszy pas)
    [2,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,2,2],  // 6 — Małopolska + Ruś zachodnia
    [2,2,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,2],  // 7 — Kraków + wejście w Ruś
    [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],  // 8 — Polska pd. + Ruś Halicka
    [2,2,2,4,4,0,0,0,0,0,0,0,0,0,0,2,2,2],  // 9 — Karpaty zach. + Ruś pd.
    [2,2,2,2,4,4,4,4,4,2,2,2,4,4,4,4,2,2],  // 10 — Łańcuch Karpatów
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],  // 11 — Granica pd. (Węgry)
  ];

  var ROWS = 12, COLS = 18;

  // Zachowaj domyślne wartości do przywrócenia po misji
  var DEFAULT_MAP  = MAP;
  var DEFAULT_DECO = DECO;
  var DEFAULT_ROWS = ROWS;
  var DEFAULT_COLS = COLS;

  // Ozdobne drzewa — WSZYSTKIE proceduralne liściaste (s:0=ciemnozielone, s:1=złote, s:2=oliwkowe)
  var DECO = [
    {c:2, r:3, img:'tree3'},
    {c:14,r:3, img:'tree4'},
    {c:3, r:4, s:2},
    {c:13,r:4, img:'tree3'},
    {c:2, r:6, img:'tree4'},
    {c:13,r:6, s:2},
    {c:3, r:7, img:'tree4'},
    {c:13,r:7, s:1},
    {c:7, r:8, s:2},
    {c:11,r:8, img:'tree3'},
  ];

  var TILE_CLR = {
    0: '#4c8840',  // trawa — terytorium Polski
    1: '#b8986a',  // ścieżka / droga
    2: '#1e3a18',  // las obcy / poza Polską
    3: '#3a6a9a',  // woda (Bałtyk)
    4: '#7a6e62',  // góry (Karpaty)
  };

  function isSolid(col, row) {
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return true;
    var t = MAP[row][col];
    return t === TREE || t === WATER || t === MOUNTAIN;
  }

  function _drawMountain(ctx, sx, sy) {
    // Lewy szczyt (ciemniejszy, dalszy)
    ctx.fillStyle = '#6e6258';
    ctx.beginPath();
    ctx.moveTo(sx + 2,  sy + T - 2);
    ctx.lineTo(sx + 24, sy + 12);
    ctx.lineTo(sx + 46, sy + T - 2);
    ctx.closePath();
    ctx.fill();
    // Prawy szczyt (jaśniejszy, bliższy)
    ctx.fillStyle = '#9a8878';
    ctx.beginPath();
    ctx.moveTo(sx + 18, sy + T - 2);
    ctx.lineTo(sx + 40, sy + 8);
    ctx.lineTo(sx + 62, sy + T - 2);
    ctx.closePath();
    ctx.fill();
    // Śnieg na prawym szczycie
    ctx.fillStyle = '#ece8e4';
    ctx.beginPath();
    ctx.moveTo(sx + 40, sy + 8);
    ctx.lineTo(sx + 32, sy + 24);
    ctx.lineTo(sx + 48, sy + 24);
    ctx.closePath();
    ctx.fill();
    // Ślad śniegu na lewym
    ctx.fillStyle = 'rgba(236,232,228,0.6)';
    ctx.beginPath();
    ctx.moveTo(sx + 24, sy + 12);
    ctx.lineTo(sx + 18, sy + 26);
    ctx.lineTo(sx + 30, sy + 26);
    ctx.closePath();
    ctx.fill();
  }

  // Drzewo liściaste — proceduralne, ściśle w granicach T×T
  // s=0: ciemnozielone, s=1: jesienno-złote, s=2: oliwkowe
  function _drawTree(ctx, sx, sy, s) {
    var palette = [
      { trunk: '#6b4c2a', crown: '#2d6e2a', shadow: '#1e4d1c' },
      { trunk: '#7a5533', crown: '#7a6218', shadow: '#5a4810' },
      { trunk: '#5e4422', crown: '#4a6e28', shadow: '#2e4e18' },
    ];
    var p = palette[s % palette.length];
    var cx = sx + T / 2;

    // Cień pod drzewem
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, sy + T - 6, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pień
    ctx.fillStyle = p.trunk;
    ctx.fillRect(cx - 4, sy + T * 0.55, 8, T * 0.4);

    // Korona (3 koła — głębia)
    ctx.fillStyle = p.shadow;
    ctx.beginPath();
    ctx.arc(cx - 2, sy + T * 0.38, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = p.crown;
    ctx.beginPath();
    ctx.arc(cx + 2, sy + T * 0.32, 18, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.beginPath();
    ctx.arc(cx + 4, sy + T * 0.26, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  function render(ctx, camX, camY, imgs) {
    var cw = ctx.canvas.width, ch = ctx.canvas.height;

    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        var sx = c * T - camX, sy = r * T - camY;
        if (sx + T < 0 || sx > cw || sy + T < 0 || sy > ch) continue;
        var tile = MAP[r][c];

        ctx.fillStyle = TILE_CLR[tile] || '#333';
        ctx.fillRect(sx, sy, T, T);

        if (tile === GRASS) {
          ctx.strokeStyle = 'rgba(0,0,0,0.05)';
          ctx.lineWidth = 1;
          ctx.strokeRect(sx, sy, T, T);
        }
        if (tile === PATH) {
          ctx.strokeStyle = 'rgba(140,100,40,0.35)';
          ctx.lineWidth = 1;
          ctx.strokeRect(sx + 0.5, sy + 0.5, T - 1, T - 1);
        }
        if (tile === WATER) {
          ctx.fillStyle = 'rgba(255,255,255,0.12)';
          ctx.fillRect(sx + 6,  sy + 10, T - 16, 3);
          ctx.fillRect(sx + 18, sy + 28, T - 28, 2);
          ctx.fillRect(sx + 10, sy + 46, T - 24, 2);
        }
        if (tile === MOUNTAIN) {
          _drawMountain(ctx, sx, sy);
        }
      }
    }

    // Ozdobne drzewa
    DECO.forEach(function (d) {
      var sx = d.c * T - camX, sy = d.r * T - camY;
      if (sx + T < 0 || sx > cw || sy + T < 0 || sy > ch) return;
      if (d.img && imgs && imgs[d.img]) {
        var im = imgs[d.img];
        var iw = 72;
        // Sprite sheets are much wider than tall — clip to first frame only
        var srcW = im.naturalWidth > im.naturalHeight * 1.5 ? im.naturalHeight : im.naturalWidth;
        var ih = Math.round(im.naturalHeight * (iw / srcW));
        ctx.drawImage(im, 0, 0, srcW, im.naturalHeight, sx + (T - iw) / 2, sy + T - ih, iw, ih);
      } else {
        _drawTree(ctx, sx, sy, d.s || 0);
      }
    });
  }

  return {
    T: T, MAP: MAP, ROWS: ROWS, COLS: COLS,
    GRASS: GRASS, PATH: PATH, TREE: TREE, WATER: WATER, MOUNTAIN: MOUNTAIN,
    isSolid: isSolid,
    render: render,
    pixelWidth:  function () { return COLS * T; },
    pixelHeight: function () { return ROWS * T; },
    setMap: function (newMap, newDeco) {
      MAP  = newMap;
      ROWS = newMap.length;
      COLS = newMap[0].length;
      if (newDeco !== undefined) DECO = newDeco;
    },
    resetMap: function () {
      MAP  = DEFAULT_MAP;
      ROWS = DEFAULT_ROWS;
      COLS = DEFAULT_COLS;
      DECO = DEFAULT_DECO;
    },
  };
})();
