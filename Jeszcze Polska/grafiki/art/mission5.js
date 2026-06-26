/* Mission 5 portrait configs — chunky flat style (window.PA v2). */
(function () {
  var HW = PA.HW, ACC = PA.ACC, shade = PA.shade, mix = PA.mix;

  window.MISSIONS = window.MISSIONS || {};
  window.MISSIONS.m5 = [
    {
      id: 'm05_lubienski', name: 'Prymas Łubieński',
      cfg: {
        skin: '#e2b48a', faceW: 1, mood: 'sad', eyeColor: '#3a2e22',
        hair: { color: '#cfc8b8', style: 'tonsure' },
        garment: { base: '#7a1f3a', sh: '#551527' },
        headwear: function (d, h) { HW.skullcap(d, h.fm, '#7a1f3a'); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#e6dcc6'); d.p(24, y0 + 1, '#caa24a'); }
      }
    },
    {
      id: 'm05_repnin', name: 'Ambasador Repnin',
      cfg: {
        skin: '#e8bd94', faceW: 1, mood: 'sly', eyeColor: '#3a3a48',
        garment: { base: '#1f3a6a', sh: '#142647' },
        headwear: function (d, h) { HW.wig(d, h.fm, '#e6e2d8'); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#caa24a'); },
        extras: function (d, h) { ACC.sash(d, '#9a1f2a', true); }
      }
    },
    {
      id: 'm05_pulaski', name: 'Kazimierz Pułaski',
      cfg: {
        skin: '#e4b488', faceW: 1, mood: 'stern', eyeColor: '#2e2014',
        hair: { color: '#2e2018', style: 'short' },
        beard: { color: '#2e2018', style: 'mustache' },
        garment: { base: '#7a1f28', sh: '#54141b' },
        back: function (d) { ACC.sabreHilt(d, 9); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#caa24a'); }
      }
    },
    {
      id: 'm05_katarzyna', name: 'Katarzyna II',
      cfg: {
        skin: '#eec59e', faceW: 0.95, mood: 'sly', eyeColor: '#3a4458',
        hair: { color: '#cfc8bc', style: 'long' },
        garment: { base: '#2a5a52', sh: '#1b3e38' },
        headwear: function (d, h) { HW.queenCrown(d, h.fm, '#ecc94a'); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 17, 31, '#e6dcc6'); d.p(22, y0, '#c0392b'); d.p(24, y0, '#2e6da4'); d.p(26, y0, '#2e9e5b'); },
        extras: function (d, h) { ACC.sash(d, '#2e5a9e', true); }
      }
    },
    {
      id: 'm05_kollataj', name: 'Hugo Kołłątaj',
      cfg: {
        skin: '#e4b690', faceW: 1, mood: 'proud', eyeColor: '#3a2e22',
        hair: { color: '#9a9488', style: 'medium' },
        garment: { base: '#2a2a32', sh: '#1a1a20' },
        headwear: function (d, h) { HW.skullcap(d, h.fm, '#26262c'); },
        collar: function (d, h) { ACC.laceCollar(d, h.fm, '#efe9da'); },
        extras: function (d, h) { ACC.bookQuill(d, h.OL); }
      }
    },
    {
      id: 'm05_potocki', name: 'Szczęsny Potocki',
      cfg: {
        skin: '#e0ac7e', faceW: 1.04, mood: 'sly', eyeColor: '#3a2614',
        hair: { color: '#4a3322', style: 'bald' },
        beard: { color: '#4a3322', style: 'mustachL' },
        garment: { base: '#6a1f6a', sh: '#481448' },
        headwear: function (d, h) { HW.furHat(d, h.fm, '#5a3a22', { band: '#6a1f6a', jewel: '#e8c352' }); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#caa24a'); }
      }
    },
    {
      id: 'm05_kosciuszko', name: 'Tadeusz Kościuszko',
      cfg: {
        skin: '#e4b488', faceW: 1, mood: 'proud', eyeColor: '#3a2e22',
        hair: { color: '#5a4a36', style: 'short' },
        garment: { base: '#3a4150', sh: '#262c38' },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#cdb88a'); for (var x = 20; x <= 28; x += 3) d.p(x, y0, '#caa24a'); }
      }
    },
    {
      id: 'm05_glowacki', name: 'Bartosz Głowacki',
      cfg: {
        skin: '#d8a468', faceW: 1.04, mood: 'stern', eyeColor: '#3a2614',
        hair: { color: '#5a4028', style: 'short' },
        beard: { color: '#5a4028', style: 'mustachL' },
        garment: { base: '#cdbb96', sh: '#a8946e' },
        back: function (d) { ACC.scythe(d, 41); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 19, 29, '#b8a47e'); d.p(24, y0, '#8a7656'); }
      }
    },
    {
      id: 'm05_poniatowski', name: 'Stanisław August',
      cfg: {
        skin: '#ecc09a', faceW: 0.98, mood: 'sad', eyeColor: '#3a3a48',
        garment: { base: '#3a2a4a', sh: '#261b32' },
        headwear: function (d, h) { HW.wig(d, h.fm, '#e8e4da'); HW.queenCrown(d, h.fm, '#ecc94a'); },
        collar: function (d, h) { ACC.ruff(d, h.fm, '#f2eee2'); }
      }
    }
  ];
})();
