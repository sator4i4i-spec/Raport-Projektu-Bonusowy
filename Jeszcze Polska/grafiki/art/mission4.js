/* Mission 4 portrait configs — chunky flat style (window.PA v2). */
(function () {
  var HW = PA.HW, ACC = PA.ACC, shade = PA.shade, mix = PA.mix;

  window.MISSIONS = window.MISSIONS || {};
  window.MISSIONS.m4 = [
    {
      id: 'm04_henryk', name: 'Henryk Walezy',
      cfg: {
        skin: '#ecc09a', faceW: 0.92, mood: 'sly', eyeColor: '#3a3044',
        hair: { color: '#3a2a1c', style: 'medium' },
        beard: { color: '#3a2a1c', style: 'mustache' },
        garment: { base: '#5a2a5a', sh: '#3e1c3e' },
        headwear: function (d, h) { HW.frenchCap(d, h.fm, '#2a2030', '#e8c352'); },
        collar: function (d, h) { ACC.ruff(d, h.fm, '#f4f0e6'); }
      }
    },
    {
      id: 'm04_szlachcic', name: 'Szlachcic',
      cfg: {
        skin: '#e2b084', faceW: 1.06, mood: 'proud', eyeColor: '#3a2614',
        hair: { color: '#3a2a1c', style: 'bald' },
        beard: { color: '#3a2a1c', style: 'mustachL' },
        garment: { base: '#1f6a4a', sh: '#134331' },
        back: function (d) { ACC.sabreHilt(d, 9); },
        headwear: function (d, h) { HW.furHat(d, h.fm, '#5a3a22', { band: '#7a2030', jewel: '#e8c352', feather: '#caa24a' }); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#caa24a'); }
      }
    },
    {
      id: 'm04_anna', name: 'Anna Jagiellonka',
      cfg: {
        skin: '#eec39c', faceW: 0.95, mood: 'proud', eyeColor: '#4a3a2a',
        hair: { color: '#7a5430', style: 'long' },
        garment: { base: '#6a1f3a', sh: '#481427' },
        headwear: function (d, h) { HW.queenCrown(d, h.fm, '#ecc94a'); },
        collar: function (d, h) { ACC.ruff(d, h.fm, '#f4f0e6'); }
      }
    },
    {
      id: 'm04_zamoyski', name: 'Jan Zamoyski',
      cfg: {
        skin: '#e0ac7e', faceW: 1.04, mood: 'stern', eyeColor: '#3a2614',
        hair: { color: '#4a3322', style: 'short' },
        beard: { color: '#4a3322', style: 'mustachL' },
        garment: { base: '#9aa0aa', sh: '#6c7280' },
        back: function (d) { ACC.mace(d, 39); },
        collar: function (d, h) { ACC.gorget(d, h.fm, '#aeb4be'); }
      }
    },
    {
      id: 'm04_zolkiewski', name: 'Hetman Żółkiewski',
      cfg: {
        skin: '#dcb088', faceW: 1.02, mood: 'calm', eyeColor: '#3a3a40',
        hair: { color: '#cfc8b8', style: 'bald' },
        beard: { color: '#cfc8b8', style: 'mustachL' },
        garment: { base: '#8a9098', sh: '#5e646e' },
        back: function (d) { ACC.mace(d, 39); },
        collar: function (d, h) { ACC.gorget(d, h.fm, '#b2b8c2'); }
      }
    },
    {
      id: 'm04_bojar', name: 'Bojar moskiewski',
      cfg: {
        skin: '#e2b288', faceW: 1.08, mood: 'sly', eyeColor: '#2e2014',
        hair: { color: '#3a2a1c', style: 'short' },
        beard: { color: '#3a2a1c', style: 'long' },
        garment: { base: '#2f5a3a', sh: '#1f3e28' },
        headwear: function (d, h) { HW.furHat(d, h.fm, '#4a3526', { tall: true, jewel: '#e8c352' }); },
        collar: function (d, h) { var y0 = h.fm.chin + 3, c = '#6a5238'; for (var y = y0; y <= y0 + 3; y++) for (var x = 15; x <= 33; x++) if ((x + y) % 2 === 0) d.p(x, y, c); }
      }
    },
    {
      id: 'm04_august', name: 'Zygmunt II August',
      cfg: {
        skin: '#e6b88e', faceW: 1, mood: 'sad', eyeColor: '#3a2e22',
        hair: { color: '#6a4a2c', style: 'medium' },
        beard: { color: '#6a4a2c', style: 'short' },
        garment: { base: '#3a2a4a', sh: '#261b32' },
        headwear: function (d, h) { HW.crown(d, h.fm, '#f0cf63'); },
        collar: function (d, h) { ACC.ruff(d, h.fm, '#f2eee2'); }
      }
    },
    {
      id: 'm04_batory', name: 'Stefan Batory',
      cfg: {
        skin: '#dca878', faceW: 1.06, mood: 'stern', eyeColor: '#3a2614',
        hair: { color: '#4a3020', style: 'short' },
        beard: { color: '#4a3020', style: 'mustachL' },
        garment: { base: '#8a2028', sh: '#5e151b' },
        headwear: function (d, h) { HW.crown(d, h.fm, '#f0cf63'); },
        collar: function (d, h) { var y0 = h.fm.chin + 3, c = '#6a5238'; for (var y = y0; y <= y0 + 3; y++) for (var x = 16; x <= 32; x++) if ((x + y) % 2 === 0) d.p(x, y, ((x + y) % 4 === 0) ? shade(c, 0.2) : c); }
      }
    },
    {
      id: 'm04_waza', name: 'Zygmunt III Waza',
      cfg: {
        skin: '#e8bd92', faceW: 0.96, mood: 'stern', eyeColor: '#3a3a44',
        hair: { color: '#5a4632', style: 'short' },
        beard: { color: '#5a4632', style: 'forked' },
        garment: { base: '#26242a', sh: '#161418' },
        headwear: function (d, h) { HW.crown(d, h.fm, '#eccb55'); },
        collar: function (d, h) { ACC.ruff(d, h.fm, '#f4f0e6'); }
      }
    },
    {
      id: 'm04_magnat', name: 'Litewski magnat',
      cfg: {
        skin: '#dcae82', faceW: 1.04, mood: 'sly', eyeColor: '#3a2614',
        hair: { color: '#4a3322', style: 'bald' },
        beard: { color: '#4a3322', style: 'mustachL' },
        garment: { base: '#2a4a6a', sh: '#1b3248' },
        headwear: function (d, h) { HW.furHat(d, h.fm, '#5a3a22', { band: '#2a4a6a', jewel: '#caa24a' }); },
        collar: function (d, h) { var y0 = h.fm.chin + 3, c = '#6a5238'; for (var y = y0; y <= y0 + 2; y++) for (var x = 17; x <= 31; x++) if ((x + y) % 2 === 0) d.p(x, y, c); }
      }
    },
    {
      id: 'm04_husarz', name: 'Husarz skrzydlaty',
      cfg: {
        skin: '#e2b48a', faceW: 1, mood: 'proud', eyeColor: '#3a3026',
        hair: { color: '#3a2a1c', style: 'short' },
        beard: { color: '#3a2a1c', style: 'mustachL' },
        garment: { base: '#aab0ba', sh: '#7c828e' },
        back: function (d, h) { ACC.wings(d); },
        headwear: function (d, h) { HW.helmet(d, h.fm, '#bcc0c8'); },
        collar: function (d, h) { ACC.gorget(d, h.fm, '#b2b8c2'); }
      }
    }
  ];
})();
