/* Non-character dialog category icons — chunky pixel-art, 48x48, transparent bg. */
(function () {
  var S = 48, OL = '#15110c';
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
    function disk(cx, cy, r, c) { for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.5) p(cx + x, cy + y, c); }
    return { p: p, raw: raw, rect: rect, span: span, hline: hline, vline: vline, disk: disk, outline: outline };
  }

  var gold = '#e8c352', goldH = '#fbe79a', goldD = '#b8902f';
  var wood = '#6a4a2c', woodD = '#4d351e', woodH = '#856237';
  var steel = '#c4c8d0', steelH = '#eef0f4', steelD = '#888e98';
  var stone = '#cdb88a', stoneD = '#a8946a', stoneH = '#e0cfa6';
  var red = '#9a2a2e', redD = '#6e1c20', redH = '#c0473f';

  window.DLG_ICONS = [
    {
      id: 'dlg_chrzest', name: 'Chrzest / obrzęd',
      draw: function (d) {
        // cross behind
        d.rect(23, 4, 3, 22, gold); d.rect(18, 10, 13, 3, gold);
        d.vline(23, 4, 22, goldH); d.hline(18, 10, 13, goldH);
        // candle (left)
        d.rect(8, 22, 3, 16, '#e6ddc8'); d.p(8, 22, '#cfc4ac');
        d.p(9, 19, '#ffcf5a'); d.p(9, 18, '#ffe79a'); d.p(9, 20, '#ff9a3a'); d.p(9, 21, '#caa24a'); // flame + wick
        // baptismal font: bowl, stem, base
        d.rect(15, 24, 18, 5, stone); d.span(24, 16, 31, stoneH); // bowl rim
        d.span(25, 17, 30, '#4f80a4'); d.span(26, 18, 29, '#3f6f92'); // water
        for (var b = 24; b < 29; b++) { d.p(15, b, stoneD); d.p(32, b, stoneD); }
        d.rect(22, 29, 4, 7, stone); d.p(22, 29, stoneD); // stem
        d.rect(17, 36, 14, 5, stone); d.span(36, 17, 30, stoneH); d.span(40, 17, 30, stoneD); // base
        d.outline();
      }
    },
    {
      id: 'dlg_koronacja', name: 'Koronacja / insygnia',
      draw: function (d) {
        // cushion
        d.rect(8, 32, 32, 9, red); d.span(32, 10, 37, redH); d.span(40, 10, 37, redD);
        d.p(8, 33, redD); d.p(39, 33, redD);
        for (var t = 0; t < 4; t++) { var tx = [9, 38, 9, 38][t], ty = [33, 33, 39, 39][t]; d.p(tx, ty, gold); } // corner tassels
        d.p(7, 36, gold); d.p(40, 36, gold);
        // crown band
        d.rect(15, 24, 18, 6, gold); d.span(24, 15, 32, goldH); d.span(29, 15, 32, goldD);
        // points
        var pts = [15, 19, 24, 29, 33];
        for (var i = 0; i < pts.length; i++) { d.vline(pts[i], 19, 5, gold); d.p(pts[i], 18, goldH); d.p(pts[i], 19, '#c0392b'); }
        // gems on band
        d.p(20, 26, '#c0392b'); d.p(24, 26, '#2e6da4'); d.p(28, 26, '#2e9e5b');
        d.outline();
      }
    },
    {
      id: 'dlg_budowla', name: 'Budowla / inwestycja',
      draw: function (d) {
        // scaffold pole behind
        d.rect(34, 8, 3, 34, wood); d.rect(20, 12, 18, 3, wood); d.p(34, 8, woodD); d.hline(20, 12, 18, woodH);
        // cornerstone block
        d.rect(8, 24, 22, 16, stone);
        for (var y = 24; y < 40; y++) for (var x = 8; x < 30; x++) { var off = (Math.floor(y / 4) % 2) ? 0 : 4; if ((x + off) % 8 === 0 || y % 4 === 0) d.p(x, y, stoneD); }
        d.span(24, 8, 29, stoneH);
        // mason's hammer (diagonal)
        for (var k = 0; k < 12; k++) { d.p(20 + k, 22 - k, wood); d.p(21 + k, 22 - k, woodH); } // handle
        d.rect(30, 7, 7, 5, steel); d.span(7, 30, 36, steelH); d.p(30, 9, steelD);
        d.outline();
      }
    },
    {
      id: 'dlg_dokument', name: 'Dokument / traktat',
      draw: function (d) {
        var pap = '#ece0b8', papD = '#ccbd8c', papH = '#f6eecb';
        // rolled parchment
        d.rect(9, 18, 30, 16, pap); d.span(18, 10, 38, papH); d.span(33, 10, 38, papD);
        // rolled ends
        d.rect(7, 16, 4, 20, papD); d.rect(38, 16, 4, 20, papD); d.vline(8, 16, 20, pap); d.vline(40, 16, 20, pap);
        // text lines
        for (var l = 0; l < 4; l++) d.hline(13, 21 + l * 3, 22, papD);
        // quill (diagonal)
        for (var k = 0; k < 12; k++) { d.p(30 + k, 14 - k, '#efe7d6'); d.p(31 + k, 14 - k, '#cfc6b2'); }
        d.p(30, 14, '#caa24a'); // nib
        // wax seal
        d.disk(16, 36, 4, red); d.disk(16, 36, 2, redH); d.p(15, 39, redD);
        d.outline();
      }
    },
    {
      id: 'dlg_bitwa', name: 'Wynik bitwy / raport',
      draw: function (d) {
        // ground mound
        for (var x = 6; x < 42; x++) { var h = Math.round(3 * Math.cos((x - 24) / 12)); for (var y = 38 - h; y < 44; y++) d.p(x, y, ((x + y) % 2 === 0) ? '#7a5a32' : '#6a4d28'); }
        // round shield (left, leaning)
        d.disk(14, 30, 7, '#3a5a8a'); d.disk(14, 30, 5, '#4f74a8'); d.disk(14, 30, 2, gold);
        d.p(10, 26, '#6f95c8'); d.vline(14, 23, 14, '#26405e'); d.hline(8, 30, 13, '#26405e');
        // sword thrust into the ground (right of center)
        d.rect(27, 8, 3, 28, steel); d.vline(27, 8, 28, steelH); d.vline(29, 8, 28, steelD);
        d.p(28, 6, steel); d.p(28, 7, steelH); // tip up
        d.span(34, 23, 33, wood); d.span(35, 23, 33, woodD); // crossguard
        d.rect(27, 36, 3, 4, '#3a2a1a'); d.disk(28, 41, 2, gold); // grip + pommel
        d.outline();
      }
    },
    {
      id: 'dlg_easteregg', name: 'Easter egg / ciekawostka',
      draw: function (d) {
        // chest body
        d.rect(9, 26, 30, 16, wood);
        for (var y = 26; y < 42; y++) for (var x = 9; x < 39; x++) if (y % 4 === 0) d.p(x, y, woodD);
        d.vline(15, 26, 16, woodD); d.vline(32, 26, 16, woodD);
        // open curved lid
        for (var r = 0; r < 6; r++) d.span(20 - r, 9 + r, 39 - r, '#7a5634');
        d.span(20, 9, 39, woodH); d.rect(9, 20, 30, 3, woodD);
        // gold spilling
        d.span(25, 14, 34, gold); d.p(16, 25, gold); d.p(19, 24, goldH); d.p(23, 25, gold); d.p(28, 24, goldH); d.p(31, 25, gold);
        d.disk(24, 34, 2, gold); d.disk(30, 35, 2, goldH); d.disk(18, 35, 2, gold);
        // lock
        d.rect(22, 31, 4, 4, gold); d.p(23, 33, woodD);
        // sparkles
        d.p(40, 12, goldH); d.p(41, 11, gold); d.p(40, 10, goldH); d.p(7, 16, goldH); d.p(6, 15, gold);
        d.outline();
      }
    },
    {
      id: 'dlg_wskazowka', name: 'Wskazówka nawigacyjna',
      draw: function (d) {
        var cloth = '#e6dcc0', clothD = '#c2b48c', clothH = '#f4eed6';
        // pole
        d.rect(13, 6, 3, 36, wood); d.p(13, 6, woodD); d.vline(15, 6, 36, woodH);
        d.disk(14, 5, 2, gold); // finial
        // hanging pennant (guides the eye, neutral)
        for (var y = 9; y < 27; y++) { var w = Math.round((27 - y) * 1.3) + 4; for (var x = 16; x < 16 + w; x++) d.p(x, y, ((x + y) % 7 === 0) ? clothD : cloth); }
        d.vline(16, 9, 18, clothH);
        // subtle chevron/arrow marking direction
        for (var k = 0; k < 5; k++) { d.p(22 + k, 14 + k, '#9a8a5a'); d.p(22 + k, 22 - k, '#9a8a5a'); }
        d.outline();
      }
    }
  ];

  window.__dlgMakeDraw = makeDraw;
})();
