/* Special building sprites — chunky pixel-art, 48x48 source (export x2 = 96px). */
(function () {
  var S = 48, OL = '#231a12';
  function makeDraw(ctx, px) {
    var filled = new Uint8Array(S * S);
    function p(x, y, c) { if (x < 0 || y < 0 || x >= S || y >= S || !c) return; ctx.fillStyle = c; ctx.fillRect(x * px, y * px, px, px); filled[y * S + x] = 1; }
    function raw(x, y, c) { if (x < 0 || y < 0 || x >= S || y >= S || !c) return; ctx.fillStyle = c; ctx.fillRect(x * px, y * px, px, px); }
    function rect(x, y, w, h, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) p(x + i, y + j, c); }
    function span(y, a, b, c) { for (var x = a; x <= b; x++) p(x, y, c); }
    function hline(x, y, w, c) { for (var i = 0; i < w; i++) p(x + i, y, c); }
    function vline(x, y, h, c) { for (var j = 0; j < h; j++) p(x, y + j, c); }
    function isF(x, y) { return x >= 0 && y >= 0 && x < S && y < S && filled[y * S + x]; }
    function outline(col) {
      col = col || OL; var add = [];
      for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) {
        if (isF(x, y)) continue;
        if (isF(x - 1, y) || isF(x + 1, y) || isF(x, y - 1) || isF(x, y + 1) || isF(x - 1, y - 1) || isF(x + 1, y - 1) || isF(x - 1, y + 1) || isF(x + 1, y + 1)) add.push([x, y]);
      }
      for (var k = 0; k < add.length; k++) raw(add[k][0], add[k][1], col);
    }
    function shadow() { for (var x = 8; x < 40; x++) { var d2 = Math.abs(x - 24); if (d2 < 16) raw(x, 45, 'rgba(0,0,0,0.18)'); if (d2 < 12) raw(x, 46, 'rgba(0,0,0,0.14)'); } }
    return { p: p, raw: raw, rect: rect, span: span, hline: hline, vline: vline, outline: outline, shadow: shadow };
  }

  var stone = '#cdb88a', stoneD = '#a8946a', stoneL = '#e0cfa6';
  var brick = '#a8442e', brickD = '#822f1f';
  var roof = '#7a3326', roofD = '#5a2319', roofL = '#9a4636';
  var glass = '#3a6ea0', glassL = '#6fa0c8';
  var gold = '#e8c352';

  function pointWindow(d, x, y, h) { // gothic pointed arch window
    d.p(x + 1, y, glass); d.rect(x, y + 1, 3, h, glass);
    d.p(x, y + 1, glassL); d.vline(x - 1, y + 1, h, OL); d.vline(x + 3, y + 1, h, OL); d.p(x + 1, y - 1, OL);
  }

  window.BUILDINGS = [
    {
      id: 'building_uniwersytet', name: 'Akademia Krakowska',
      draw: function (d) {
        d.shadow();
        // main hall
        d.rect(8, 18, 26, 26, stone);
        for (var y = 18; y < 44; y++) for (var x = 8; x < 34; x++) if ((Math.floor(y / 4) + Math.floor(x / 5)) % 2 === 0) d.p(x, y, stoneD);
        // gable roof
        for (var r = 0; r < 7; r++) d.span(11 + r, 8 + r, 33 - r, r === 0 ? roofL : roof);
        d.span(11, 20, 21, roofL);
        // turret
        d.rect(33, 10, 8, 34, stoneL);
        for (var ty = 10; ty < 44; ty += 4) d.span(ty, 33, 40, stoneD);
        for (var c = 0; c < 5; c++) d.span(8 - c, 37 - c, 40 - (4 - c), roof); // conical roof
        d.rect(36, 4, 2, 4, gold); d.p(36, 3, gold);
        // rosette + gothic windows
        d.rect(18, 21, 6, 6, glass); d.p(20, 20, OL); d.p(21, 20, OL); d.span(23, 19, 24, OL); d.p(21, 23, stoneL); // rose window
        pointWindow(d, 11, 32, 7); pointWindow(d, 27, 32, 7);
        // arched door
        d.rect(18, 36, 6, 8, '#5a3a22'); d.p(19, 35, '#5a3a22'); d.p(22, 35, '#5a3a22'); d.span(35, 20, 21, '#5a3a22'); d.p(23, 40, gold);
        d.outline();
      }
    },
    {
      id: 'building_unia', name: 'Sala sejmowa w Lublinie',
      draw: function (d) {
        d.shadow();
        // broad facade
        d.rect(6, 18, 36, 26, stone);
        for (var y = 18; y < 44; y++) for (var x = 6; x < 42; x++) if (y % 4 === 0 || (x % 6 === 0)) d.p(x, y, stoneD);
        // hip roof
        for (var r = 0; r < 6; r++) d.span(12 + r, 6 + r * 1, 41 - r, r === 0 ? roofL : roof);
        // banners on the roof
        d.vline(14, 6, 6, '#7a5a2a'); d.rect(15, 6, 5, 4, '#d8d2c4'); d.span(8, 15, 19, '#b03030'); // white-red
        d.vline(33, 6, 6, '#7a5a2a'); d.rect(28, 6, 5, 4, '#b03030'); d.p(30, 7, '#d8d2c4'); // Pogon hint
        // central arched entrance
        d.rect(20, 32, 8, 12, '#4a2f1c'); d.p(21, 31, '#4a2f1c'); d.p(26, 31, '#4a2f1c'); d.span(31, 22, 25, '#4a2f1c');
        d.vline(24, 32, 12, '#2e1d12');
        // two coats of arms (Crown eagle / Lithuania)
        d.rect(11, 24, 6, 7, '#b03030'); d.p(13, 26, '#e8e4d8'); d.p(14, 27, '#e8e4d8'); d.p(13, 28, '#e8e4d8'); // eagle
        d.rect(31, 24, 6, 7, '#b03030'); d.p(33, 26, '#d8d2c4'); d.p(34, 27, '#d8d2c4'); d.p(33, 28, '#d8d2c4'); // knight
        // windows
        d.rect(8, 34, 4, 5, glass); d.rect(36, 34, 4, 5, glass);
        d.outline();
      }
    },
    {
      id: 'building_ken', name: 'KEN — Komisja Edukacji',
      draw: function (d) {
        d.shadow();
        // light classicist block
        d.rect(9, 22, 30, 22, stoneL);
        for (var y = 22; y < 44; y++) for (var x = 9; x < 39; x++) if (x % 6 === 0) d.p(x, y, stoneD);
        // pediment (triangle) on columns
        for (var r = 0; r < 8; r++) d.span(14 + r, 11 + r, 37 - r, stone);
        d.span(22, 12, 36, stoneD);
        // columns
        for (var cx = 13; cx <= 35; cx += 5) d.vline(cx, 24, 16, stoneD);
        // door
        d.rect(21, 34, 6, 10, '#4a3320'); d.p(24, 39, gold);
        // globe of the Enlightenment on a stand
        d.rect(31, 16, 1, 6, '#6a4a2c'); d.rect(29, 12, 5, 5, glass); d.p(31, 13, '#2e9e5b'); d.p(30, 15, '#2e9e5b'); d.p(32, 14, '#2e9e5b');
        // windows
        d.rect(11, 26, 4, 5, glass); d.rect(33, 26, 4, 5, glass);
        d.outline();
      }
    },
    {
      id: 'building_lazienki', name: 'Łazienki — Pałac na Wodzie',
      draw: function (d) {
        // water at base
        for (var y = 38; y < S; y++) for (var x = 2; x < 46; x++) d.p(x, y, ((x + y) % 4 < 2) ? '#3f6f92' : '#4f80a4');
        for (var w = 4; w < 44; w += 6) { d.p(w, 41, '#7fb0cc'); d.p(w + 2, 44, '#7fb0cc'); }
        // white pavilion
        d.rect(10, 18, 28, 22, '#eee6d6');
        for (var yy = 18; yy < 40; yy++) for (var xx = 10; xx < 38; xx++) if (xx % 6 === 0) d.p(xx, yy, '#cfc4ac');
        // low pediment + balustrade
        for (var r = 0; r < 5; r++) d.span(13 + r, 16 + r, 31 - r, '#d8cdb4');
        d.span(24, 14, 33, '#cfc4ac');
        // columns
        for (var cx = 14; cx <= 34; cx += 5) d.vline(cx, 22, 16, '#cfc4ac');
        // central door + arched windows
        d.rect(21, 30, 6, 10, '#4a3a5a'); d.p(24, 35, gold);
        d.rect(12, 26, 3, 6, glass); d.rect(33, 26, 3, 6, glass);
        // reflection
        d.p(18, 40, '#c8d8e2'); d.p(26, 41, '#c8d8e2');
        d.outline();
      }
    },
    {
      id: 'building_inflanty', name: 'Zamek inflancki nad morzem',
      draw: function (d) {
        // sea
        for (var y = 40; y < S; y++) for (var x = 0; x < S; x++) d.p(x, y, ((x + y) % 4 < 2) ? '#2f5f86' : '#3d7098');
        for (var w = 2; w < 46; w += 7) { d.p(w, 43, '#6fa0c0'); d.p(w + 3, 46, '#6fa0c0'); }
        // brick wall
        d.rect(6, 28, 36, 14, brick);
        for (var by = 28; by < 42; by++) for (var bx = 6; bx < 42; bx++) { var off = (Math.floor(by / 3) % 2) ? 0 : 3; if ((bx + off) % 6 === 0 || by % 3 === 0) d.p(bx, by, brickD); }
        for (var m = 6; m < 42; m += 5) d.rect(m, 26, 3, 2, brick); // battlements
        // tall tower
        d.rect(16, 8, 14, 34, brick);
        for (var ty = 8; ty < 42; ty++) for (var tx = 16; tx < 30; tx++) { var o2 = (Math.floor(ty / 3) % 2) ? 0 : 3; if ((tx + o2) % 6 === 0 || ty % 3 === 0) d.p(tx, ty, brickD); }
        for (var tm = 16; tm < 30; tm += 5) d.rect(tm, 6, 3, 2, brick);
        // arrow-slit windows + gate
        d.rect(22, 14, 2, 5, '#241810'); d.rect(22, 24, 2, 5, '#241810');
        d.rect(20, 34, 6, 8, '#241810'); d.p(21, 33, '#241810'); d.p(24, 33, '#241810');
        // pennant
        d.vline(23, 2, 4, '#6a4a2c'); d.rect(24, 2, 4, 3, '#b03030');
        d.outline();
      }
    }
  ];

  window.__bldMakeDraw = makeDraw;
})();
