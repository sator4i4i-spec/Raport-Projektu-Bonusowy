/* Easter-egg sprites — chunky pixel-art, 48x48, transparent bg. */
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
    return { p: p, raw: raw, rect: rect, span: span, hline: hline, vline: vline, outline: outline };
  }

  function grassBase(d, top) {
    for (var y = top; y < S; y++) for (var x = 0; x < S; x++) {
      var g = ((x * 3 + y * 5) % 7 === 0) ? '#3f7a3a' : ((x + y) % 2 === 0 ? '#4f8c44' : '#46823e');
      d.p(x, y, g);
    }
    for (var x2 = 0; x2 < S; x2 += 2) { d.p(x2, top - 1, '#5a9a4c'); d.p(x2 + 1, top, '#5a9a4c'); } // blade tips
  }

  window.EGGS = [
    {
      id: 'egg_m01_idol', name: 'Pogański bożek',
      draw: function (d) {
        grassBase(d, 40);
        var wood = '#6a4a2c', wsh = '#4d351e', whi = '#856237';
        // totem post
        d.rect(20, 12, 8, 30, wood);
        for (var y = 12; y < 42; y++) { d.p(20, y, wsh); d.p(27, y, whi); }
        // carved head
        d.rect(17, 6, 14, 12, wood); d.span(5 + 0, 0, 0, null);
        d.rect(17, 6, 14, 2, whi);
        // grim eyes + mouth (carved)
        d.rect(20, 10, 2, 2, '#2a1c10'); d.rect(26, 10, 2, 2, '#2a1c10');
        d.p(19, 9, '#2a1c10'); d.p(29, 9, '#2a1c10'); // angry brow
        d.span(14, 21, 27, '#2a1c10'); d.p(21, 15, '#2a1c10'); d.p(27, 15, '#2a1c10');
        // carved bands on the post
        d.span(24, 20, 27, wsh); d.span(30, 20, 27, wsh); d.span(36, 20, 27, wsh);
        // scorch mark
        d.p(22, 28, '#2a1c10'); d.p(23, 29, '#241810'); d.p(25, 33, '#2a1c10');
        d.outline();
      }
    },
    {
      id: 'egg_m02_moneta', name: 'Moneta średniowieczna',
      draw: function (d) {
        grassBase(d, 30);
        // castle wall behind
        for (var y = 6; y < 30; y++) for (var x = 0; x < S; x++) { var b = ((Math.floor(y / 3) % 2) ? x + 2 : x); d.p(x, y, (b % 8 < 1 || y % 3 === 0) ? '#7a6f63' : '#928678'); }
        d.span(6, 0, S - 1, '#a89c8c'); for (var c = 1; c < S; c += 8) d.rect(c, 2, 4, 4, '#928678');
        // gold coin lying in grass (slight top view -> ellipse)
        var gold = '#e8c352', ghi = '#fbe79a', gsh = '#b8902f';
        var coin = [[20, 34, 9], [19, 35, 11], [19, 36, 11], [19, 37, 11], [20, 38, 9]];
        coin.forEach(function (r) { for (var x = r[0]; x < r[0] + r[2]; x++) d.p(x, r[1], gold); });
        d.span(35, 21, 27, ghi);
        // eagle hint
        d.p(24, 36, gsh); d.p(22, 36, gsh); d.p(26, 36, gsh); d.span(37, 22, 26, gsh);
        d.outline();
      }
    },
    {
      id: 'egg_m03_miecze', name: 'Dwa miecze Grunwaldu',
      draw: function (d) {
        grassBase(d, 38);
        var steel = '#c4c8d0', shi = '#eef0f4', ssh = '#888e98';
        function sword(x0, lean) {
          for (var y = 8; y < 40; y++) { var x = x0 + Math.round(lean * (y - 8) / 32); d.p(x, y, steel); d.p(x + 1, y, ssh); d.p(x, y, (y % 2 ? steel : shi)); }
          // crossguard
          var gy = 33, gx = x0 + Math.round(lean * (gy - 8) / 32);
          d.span(gy, gx - 3, gx + 4, '#6a4a2c'); d.span(gy + 1, gx - 3, gx + 4, '#4d351e');
          // grip + pommel
          d.rect(gx, gy + 1, 1, 5, '#3a2a1a'); d.p(gx, gy + 6, '#caa24a');
          // tip
          d.p(x0 + Math.round(lean * 0) , 7, steel);
        }
        sword(20, -5);
        sword(27, 5);
        d.outline();
      }
    },
    {
      id: 'egg_m04_husarz', name: 'Husarz przy Kremlu',
      draw: function (d) {
        // dusk sky
        for (var y = 0; y < 34; y++) d.p(0, y, null);
        for (var yy = 4; yy < 34; yy++) for (var x = 0; x < S; x++) d.p(x, yy, yy < 14 ? '#caa07a' : '#9a7e6a');
        // Kremlin wall + tower silhouette
        var br = '#7a2b2b', brd = '#5e2020';
        d.rect(0, 22, S, 12, br);
        for (var m = 0; m < S; m += 5) d.rect(m, 20, 3, 2, br); // merlons
        d.rect(33, 10, 10, 24, br); // tower
        for (var t = 33; t < 43; t += 4) d.rect(t, 8, 2, 2, br);
        d.rect(36, 4, 4, 6, brd); d.p(37, 2, '#2e6da4'); d.p(38, 2, '#2e6da4'); // tower spire + star
        // hussar silhouette (back view) on the ground
        d.rect(14, 30, 8, 14, '#1c1a22'); // torso
        d.rect(15, 24, 6, 6, '#22202a'); // head/helmet
        // wings
        for (var k = 0; k < 9; k++) { d.p(10 - Math.round(2 * Math.sin(k / 3)), 26 + k, '#e8e4d8'); d.p(25 + Math.round(2 * Math.sin(k / 3)), 26 + k, '#e8e4d8'); }
        d.vline(11, 25, 12, '#caa24a'); d.vline(24, 25, 12, '#caa24a');
        d.outline();
      }
    },
    {
      id: 'egg_m05_nuty', name: 'Strzęp nut w ruinach',
      draw: function (d) {
        // ash ground
        for (var y = 34; y < S; y++) for (var x = 0; x < S; x++) d.p(x, y, ((x + y) % 2 === 0) ? '#4a443e' : '#3e3934');
        // rubble blocks
        d.rect(2, 36, 8, 6, '#6a6258'); d.rect(38, 38, 9, 7, '#5e574e'); d.rect(28, 40, 7, 5, '#6a6258');
        // yellowed sheet of music
        var pap = '#e9dcb4', psh = '#c9bb8e';
        var sheet = [[16, 12, 16], [14, 13, 19], [13, 14, 21], [13, 15, 22], [13, 16, 22], [13, 17, 22], [14, 18, 21], [15, 19, 20], [17, 20, 17]];
        sheet.forEach(function (r) { for (var x = r[0]; x < r[0] + r[2]; x++) d.p(x, r[1], pap); });
        d.span(20, 16, 32, psh); // torn lower edge shadow
        // staff lines + notes
        for (var l = 0; l < 4; l++) d.hline(15, 14 + l, 18, '#8a7e58');
        d.p(18, 13, '#2a241a'); d.p(18, 14, '#2a241a'); d.p(19, 13, '#2a241a'); // note
        d.p(24, 15, '#2a241a'); d.p(24, 16, '#2a241a'); d.p(25, 15, '#2a241a');
        d.p(29, 14, '#2a241a'); d.p(29, 15, '#2a241a'); d.p(30, 14, '#2a241a');
        d.vline(19, 11, 3, '#2a241a'); d.vline(25, 13, 3, '#2a241a'); d.vline(30, 12, 3, '#2a241a');
        d.outline();
      }
    }
  ];

  window.__eggMakeDraw = makeDraw; // for exporter/gallery
})();
