/* Battle portrait configs — chunky flat pixel style (window.PA v2).
   Adds a few new headwear/accessory pieces, then defines window.BATTLES
   grouped by historical battle. Same 48x48 transparent-bg sprites. */
(function () {
  var HW = PA.HW, ACC = PA.ACC, shade = PA.shade, mix = PA.mix;

  /* ---- new headwear ---- */
  HW.monomakh = function (d, fm, gold) {           // Cap of Monomakh (tsar)
    gold = gold || '#e8c352';
    var fur = '#6a4a2c', fhi = shade(fur, 0.22), fsh = shade(fur, -0.25);
    var hw = fm.hwAt(fm.top) + 1;
    // fur lower band
    for (var x = fm.cx - hw; x <= fm.cx + hw; x++) {
      d.p(x, fm.top, fur); d.p(x, fm.top - 1, ((x + fm.top) % 2 === 0) ? fhi : fsh);
    }
    // gold dome
    for (var y = fm.top - 2; y >= fm.top - 6; y--) {
      var t = (fm.top - 2 - y) / 5; var w = Math.max(1, Math.round(hw * (1 - t * 0.85)));
      d.span(y, fm.cx - w, fm.cx + w, gold);
    }
    // jewels around the band
    d.p(fm.cx, fm.top - 1, '#c0392b'); d.p(fm.cx - 3, fm.top - 1, '#2e6da4'); d.p(fm.cx + 3, fm.top - 1, '#2e9e5b');
    d.p(fm.cx, fm.top - 4, '#c0392b');
    // cross finial
    d.p(fm.cx, fm.top - 7, gold); d.p(fm.cx, fm.top - 8, gold); d.p(fm.cx - 1, fm.top - 7, gold); d.p(fm.cx + 1, fm.top - 7, gold);
  };

  HW.rogatywka = function (d, fm, cloth, opts) {   // Polish square-topped uhlan cap
    cloth = cloth || '#1f3a6a'; var chi = shade(cloth, 0.2), csh = shade(cloth, -0.28);
    var hw = fm.hwAt(fm.top) + 1;
    for (var y = fm.top; y >= fm.top - 5; y--) d.span(y, fm.cx - hw, fm.cx + hw, cloth);
    // flared square top
    d.span(fm.top - 5, fm.cx - hw - 1, fm.cx + hw + 1, cloth);
    d.span(fm.top - 6, fm.cx - hw - 1, fm.cx + hw + 1, chi);
    // band + peak
    d.span(fm.top, fm.cx - hw, fm.cx + hw, csh);
    // cockade / emblem
    var em = (opts && opts.emblem) || '#e8c352';
    d.p(fm.cx, fm.top - 2, em); d.p(fm.cx, fm.top - 3, '#e8e4da');
    if (opts && opts.plume) { d.p(fm.cx + hw + 1, fm.top - 5, opts.plume); d.p(fm.cx + hw + 1, fm.top - 6, opts.plume); d.p(fm.cx + hw, fm.top - 7, opts.plume); }
  };

  HW.highHair = function (d, fm, color) {          // high-piled grey court hair (Catherine II)
    color = color || '#d8d2c4'; var csh = shade(color, -0.12), chi = shade(color, 0.12);
    var hw = fm.hwAt(fm.top) + 1;
    for (var y = fm.top - 1; y >= fm.top - 6; y--) {
      var t = (fm.top - 1 - y) / 6; var w = Math.round((hw + 1) * (1 - t * 0.25));
      for (var x = fm.cx - w; x <= fm.cx + w; x++) d.p(x, y, ((x + y) % 3 === 0) ? chi : color);
    }
    // side curls down the cheeks
    for (var s = fm.top + 1; s <= fm.top + 8; s++) {
      var r = fm.rows[Math.min(s, fm.chin)];
      d.p(r[0] - 2, s, color); d.p(r[0] - 1, s, color); d.p(r[1] + 1, s, color); d.p(r[1] + 2, s, color);
      if (s % 2 === 0) { d.p(r[0] - 2, s, csh); d.p(r[1] + 2, s, csh); }
    }
  };

  /* ---- new accessories ---- */
  ACC.epaulettes = function (d, fm, gold) {        // gold shoulder boards + fringe
    gold = gold || '#e8c352'; var ghi = shade(gold, 0.3);
    var y0 = fm.chin + 4;
    for (var k = 0; k < 3; k++) {
      d.span(y0 + k, 12 - k, 18, gold); d.span(y0 + k, 30, 36 + k, gold);
    }
    for (var x = 11; x <= 17; x++) d.p(x, y0 + 3, ghi);
    for (var x2 = 31; x2 <= 37; x2++) d.p(x2, y0 + 3, ghi);
  };

  ACC.medals = function (d, x, y, n) {             // row of small medals
    n = n || 3;
    for (var i = 0; i < n; i++) {
      var mx = x + i * 4;
      d.p(mx + 1, y, '#9a1f2a'); d.p(mx, y, '#c0392b'); d.p(mx + 2, y, '#c0392b');
      d.rect(mx, y + 1, 3, 2, '#e8c352'); d.p(mx + 1, y + 2, '#bf9a35');
    }
  };

  ACC.eagle = function (d, cx, y, c) {             // white spread eagle on breastplate
    c = c || '#f1eee4'; var sh = shade(c, -0.18);
    d.p(cx, y, c);                                  // head
    d.p(cx - 1, y + 1, c); d.p(cx, y + 1, c); d.p(cx + 1, y + 1, c);
    d.span(y + 2, cx - 4, cx + 4, c);               // wings spread
    d.p(cx - 4, y + 1, c); d.p(cx + 4, y + 1, c);
    d.span(y + 3, cx - 3, cx + 3, c);
    d.p(cx - 4, y + 3, c); d.p(cx + 4, y + 3, c);   // wing tips
    d.p(cx, y + 4, c); d.p(cx - 2, y + 4, c); d.p(cx + 2, y + 4, c); // tail/legs
    d.p(cx, y + 1, sh);
  };

  ACC.standCollar = function (d, fm, cloth, trim) { // standing military collar
    cloth = cloth || '#2a5a3a'; trim = trim || '#e8c352';
    var y0 = fm.chin + 2;
    d.span(y0, fm.cx - 6, fm.cx + 6, cloth);
    d.span(y0 + 1, fm.cx - 7, fm.cx + 7, cloth);
    d.hline(fm.cx - 6, y0, 13, trim);
    d.p(fm.cx - 5, y0 + 1, trim); d.p(fm.cx + 5, y0 + 1, trim);
  };

  /* ============================================================ */
  window.BATTLES = {
    grunwald: {
      title: 'BITWA POD GRUNWALDEM (1410)',
      list: [
        {
          id: 'gw_jagiello', name: 'Władysław II Jagiełło',
          cfg: {
            skin: '#d8a474', faceW: 1.06, mood: 'calm', eyeColor: '#2e2014',
            hair: { color: '#2e2018', style: 'medium' }, beard: { color: '#2e2018', style: 'full' },
            garment: { base: '#3b414c', sh: '#272c34' },
            headwear: function (d, h) { HW.crown(d, h.fm, '#f0cf63'); },
            collar: function (d, h) { ACC.gorget(d, h.fm, '#aeb4be'); },
            extras: function (d, h) { ACC.eagle(d, 24, h.fm.chin + 8, '#f1eee4'); }
          }
        },
        {
          id: 'gw_ulrich', name: 'Ulrich von Jungingen',
          cfg: {
            skin: '#e6bd92', faceW: 0.98, mood: 'stern', eyeColor: '#3a4458',
            hair: { color: '#d8c89a', style: 'short' }, beard: { color: '#d8c89a', style: 'short' },
            garment: { base: '#ece7dc', sh: '#c4bdae' },
            collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#d8d2c4'); },
            extras: function (d, h) {            // Teutonic black cross on white mantle
              var cy = 41; d.rect(22, cy - 5, 4, 12, '#1a1a1e'); d.rect(17, cy - 1, 14, 4, '#1a1a1e');
            }
          }
        }
      ]
    },

    pskow: {
      title: 'OBLĘŻENIE PSKOWA (1581)',
      list: [
        {
          id: 'ps_batory', name: 'Stefan Batory',
          cfg: {
            skin: '#dca878', faceW: 1.06, mood: 'stern', eyeColor: '#2e1c10',
            hair: { color: '#241810', style: 'short' }, beard: { color: '#241810', style: 'full' },
            garment: { base: '#8a2028', sh: '#5e151b' },
            headwear: function (d, h) { HW.furHat(d, h.fm, '#3a261a', { band: '#7a2030', jewel: '#e8c352', feather: '#e6dcc6' }); },
            collar: function (d, h) { var y0 = h.fm.chin + 3, c = '#caa24a'; for (var y = y0; y <= y0 + 3; y++) for (var x = 17; x <= 31; x++) if ((x + y) % 2 === 0) d.p(x, y, c); }
          }
        },
        {
          id: 'ps_zamoyski', name: 'Jan Zamoyski',
          cfg: {
            skin: '#e0ac7e', faceW: 1.02, mood: 'calm', eyeColor: '#3a2614',
            hair: { color: '#4a3322', style: 'receding' }, beard: { color: '#4a3322', style: 'mustachL' },
            garment: { base: '#9aa0aa', sh: '#6c7280' },
            collar: function (d, h) { ACC.gorget(d, h.fm, '#b2b8c2'); },
            extras: function (d, h) { d.p(24, h.fm.chin + 8, '#e8c352'); d.p(24, h.fm.chin + 9, '#e8c352'); d.p(23, h.fm.chin + 9, '#e8c352'); d.p(25, h.fm.chin + 9, '#e8c352'); }
          }
        },
        {
          id: 'ps_iwan', name: 'Iwan IV Groźny',
          cfg: {
            skin: '#d6b288', faceW: 1.0, mood: 'stern', eyeColor: '#2a221c',
            hair: { color: '#bdb4a4', style: 'short' }, beard: { color: '#bdb4a4', style: 'long' },
            garment: { base: '#6a1f3a', sh: '#481427' },
            headwear: function (d, h) { HW.monomakh(d, h.fm, '#e8c352'); },
            collar: function (d, h) { ACC.ermine(d, h.fm); }
          }
        }
      ]
    },

    kluszyn: {
      title: 'BITWA POD KŁUSZYNEM (1610)',
      list: [
        {
          id: 'kl_waza', name: 'Zygmunt III Waza',
          cfg: {
            skin: '#ecc6a2', faceW: 0.9, mood: 'stern', eyeColor: '#3a3a44',
            hair: { color: '#5a4632', style: 'short' }, beard: { color: '#5a4632', style: 'forked' },
            garment: { base: '#8a9098', sh: '#5e646e' },
            headwear: function (d, h) { HW.crown(d, h.fm, '#eccb55'); },
            collar: function (d, h) { ACC.ruff(d, h.fm, '#f4f0e6'); }
          }
        },
        {
          id: 'kl_zolkiewski', name: 'Stanisław Żółkiewski',
          cfg: {
            skin: '#dcb088', faceW: 1.02, mood: 'calm', eyeColor: '#3a3a40',
            hair: { color: '#cfc8b8', style: 'bald' }, beard: { color: '#cfc8b8', style: 'mustachL' },
            garment: { base: '#8a9098', sh: '#5e646e' },
            back: function (d) { ACC.mace(d, 39); },
            collar: function (d, h) { ACC.gorget(d, h.fm, '#b2b8c2'); }
          }
        },
        {
          id: 'kl_szujski', name: 'Wasilij IV Szujski',
          cfg: {
            skin: '#e2b288', faceW: 1.1, mood: 'sad', eyeColor: '#2e2014',
            hair: { color: '#3a2a1c', style: 'short' }, beard: { color: '#574436', style: 'full' },
            garment: { base: '#2f5a3a', sh: '#1f3e28' },
            headwear: function (d, h) { HW.furHat(d, h.fm, '#4a3526', { tall: true, jewel: '#e8c352' }); },
            collar: function (d, h) { var y0 = h.fm.chin + 3, c = '#caa24a'; for (var y = y0; y <= y0 + 3; y++) for (var x = 16; x <= 32; x++) if ((x + y) % 2 === 0) d.p(x, y, ((x + y) % 4 === 0) ? shade(c, 0.25) : c); }
          }
        }
      ]
    },

    zielence: {
      title: 'BITWA POD ZIELEŃCAMI (1792)',
      list: [
        {
          id: 'zi_poniatowski', name: 'Stanisław August Poniatowski',
          cfg: {
            skin: '#ecc09a', faceW: 0.98, mood: 'gentle', eyeColor: '#3a3a48', eyeWhite: true,
            garment: { base: '#2a4a8a', sh: '#1c3360' },
            headwear: function (d, h) { HW.wig(d, h.fm, '#e8e4da'); },
            collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#e8c352'); },
            extras: function (d, h) { ACC.sash(d, '#2e5a9e', true); ACC.epaulettes(d, h.fm, '#e8c352'); }
          }
        },
        {
          id: 'zi_jozef', name: 'Książę Józef Poniatowski',
          cfg: {
            skin: '#e6b88e', faceW: 0.98, mood: 'proud', eyeColor: '#2e1c10',
            hair: { color: '#2a1c12', style: 'short' }, beard: { color: '#2a1c12', style: 'mustache' },
            garment: { base: '#1f3a6a', sh: '#142647' },
            headwear: function (d, h) { HW.rogatywka(d, h.fm, '#1f3a6a', { emblem: '#e8c352', plume: '#e6dcc6' }); },
            collar: function (d, h) { ACC.standCollar(d, h.fm, '#7a1f28', '#e8c352'); },
            extras: function (d, h) { ACC.epaulettes(d, h.fm, '#e8c352'); }
          }
        },
        {
          id: 'zi_kachowski', name: 'Michaił Kachowski',
          cfg: {
            skin: '#e0b48a', faceW: 1.02, mood: 'stern', eyeColor: '#3a3026',
            hair: { color: '#bdb4a4', style: 'short' },
            garment: { base: '#2a5a3a', sh: '#1b3e28' },
            collar: function (d, h) { ACC.standCollar(d, h.fm, '#9a1f2a', '#e8c352'); },
            extras: function (d, h) { ACC.epaulettes(d, h.fm, '#e8c352'); ACC.medals(d, 19, h.fm.chin + 8, 3); }
          }
        }
      ]
    },

    raclawice: {
      title: 'RACŁAWICE I MACIEJOWICE (1794)',
      list: [
        {
          id: 'rc_kosciuszko', name: 'Tadeusz Kościuszko',
          cfg: {
            skin: '#e4b488', faceW: 1.0, mood: 'proud', eyeColor: '#3a2e22',
            hair: { color: '#5a4a36', style: 'short' },
            garment: { base: '#e8e2d2', sh: '#c6bca2' },
            collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#cdb88a'); for (var x = 20; x <= 28; x += 3) d.p(x, y0, '#caa24a'); d.span(y0 - 1, 22, 26, '#3a4150'); }
          }
        },
        {
          id: 'rc_katarzyna', name: 'Katarzyna II Wielka',
          cfg: {
            skin: '#eec59e', faceW: 0.95, mood: 'proud', eyeColor: '#3a4458',
            garment: { base: '#7a1f3a', sh: '#551527' },
            headwear: function (d, h) { HW.highHair(d, h.fm, '#d8d2c4'); HW.diadem(d, h.fm, '#ecc94a'); },
            collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 16, 32, '#e6dcc6'); d.p(22, y0, '#c0392b'); d.p(24, y0, '#2e6da4'); d.p(26, y0, '#2e9e5b'); },
            extras: function (d, h) { ACC.sash(d, '#9a1f2a', true); }
          }
        },
        {
          id: 'rc_tormasow', name: 'Aleksander Tormasow',
          cfg: {
            skin: '#e2b486', faceW: 1.0, mood: 'stern', eyeColor: '#3a2e22',
            hair: { color: '#3a2a1c', style: 'short' }, browColor: '#241810',
            garment: { base: '#2a5a3a', sh: '#1b3e28' },
            collar: function (d, h) { ACC.standCollar(d, h.fm, '#9a1f2a', '#e8c352'); },
            extras: function (d, h) { ACC.epaulettes(d, h.fm, '#e8c352'); ACC.medals(d, 18, h.fm.chin + 8, 4); }
          }
        },
        {
          id: 'rc_fersen', name: 'Iwan Fersen',
          cfg: {
            skin: '#e8bd92', faceW: 1.0, mood: 'proud', eyeColor: '#3a3a48',
            hair: { color: '#6a5238', style: 'short' },
            garment: { base: '#2a5a3a', sh: '#1b3e28' },
            headwear: function (d, h) { HW.wig(d, h.fm, '#e6e2d8'); },
            collar: function (d, h) { ACC.standCollar(d, h.fm, '#9a1f2a', '#e8c352'); },
            extras: function (d, h) { ACC.epaulettes(d, h.fm, '#e8c352'); ACC.medals(d, 20, h.fm.chin + 8, 2); }
          }
        }
      ]
    }
  };
})();
