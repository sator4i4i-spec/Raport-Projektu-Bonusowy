/* Mission 3 portrait configs — chunky flat style (window.PA v2). */
(function () {
  var HW = PA.HW, ACC = PA.ACC, shade = PA.shade, mix = PA.mix;

  window.MISSIONS = window.MISSIONS || {};
  window.MISSIONS.m3 = [
    {
      id: 'm03_bodzanta', name: 'Arcybiskup Bodzanta',
      cfg: {
        skin: '#dcb088', faceW: 1, mood: 'stern', eyeColor: '#3a3026',
        hair: { color: '#cfc8b8', style: 'tonsure' },
        beard: { color: '#cfc8b8', style: 'full' },
        garment: { base: '#e6dcc6', sh: '#bdb094' },
        back: function (d) { ACC.crosier(d, 38, '#caa24a'); },
        headwear: function (d, h) { HW.mitre(d, h.fm, '#f4eddb'); },
        collar: function (d, h) { d.rect(20, h.fm.chin + 3, 2, 12, '#1f6a4a'); d.rect(26, h.fm.chin + 3, 2, 12, '#1f6a4a'); }
      }
    },
    {
      id: 'm03_jagiello', name: 'Władysław Jagiełło',
      cfg: {
        skin: '#d8a474', faceW: 1.08, mood: 'stern', eyeColor: '#2e2014',
        hair: { color: '#2e2018', style: 'medium' },
        beard: { color: '#2e2018', style: 'full' },
        garment: { base: '#7a2030', sh: '#551522' },
        headwear: function (d, h) { HW.crown(d, h.fm, '#f0cf63'); },
        collar: function (d, h) { ACC.ermine(d, h.fm); }
      }
    },
    {
      id: 'm03_rektor', name: 'Rektor Akademii',
      cfg: {
        skin: '#e2b48a', faceW: 1, mood: 'calm', eyeColor: '#3a2e22',
        hair: { color: '#8a8478', style: 'medium' },
        beard: { color: '#8a8478', style: 'short' },
        garment: { base: '#2b2b34', sh: '#1a1a22' },
        headwear: function (d, h) { HW.biret(d, h.fm, '#3a1f22'); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#7a1f2a'); },
        extras: function (d, h) { ACC.bookQuill(d, h.OL); }
      }
    },
    {
      id: 'm03_witold', name: 'Witold',
      cfg: {
        skin: '#dca878', faceW: 1.08, mood: 'proud', eyeColor: '#3a2614',
        hair: { color: '#5a3a22', style: 'short' },
        beard: { color: '#5a3a22', style: 'full' },
        garment: { base: '#9aa0aa', sh: '#6c7280' },
        headwear: function (d, h) { HW.furHat(d, h.fm, '#4a3526', { band: '#7a2030', jewel: '#e8c352' }); },
        collar: function (d, h) { ACC.gorget(d, h.fm, '#aeb4be'); }
      }
    },
    {
      id: 'm03_ulrich', name: 'Herold Ulricha',
      cfg: {
        skin: '#e4ba90', faceW: 0.96, mood: 'stern', eyeColor: '#3a4458',
        hair: { color: '#caa24a', style: 'short' },
        garment: { base: '#ece7dc', sh: '#c4bdae' },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#d8d2c4'); },
        extras: function (d, h) {
          // Teutonic black cross on the white mantle
          var cy = 40; d.rect(22, cy - 4, 4, 10, '#1a1a1e'); d.rect(18, cy - 1, 12, 4, '#1a1a1e');
        }
      }
    },
    {
      id: 'm03_jadwiga', name: 'Królowa Jadwiga',
      cfg: {
        skin: '#f2c8a2', faceW: 0.92, mood: 'gentle', eyeColor: '#4a5a7a', eyeWhite: true,
        hair: { color: '#caa24a', style: 'long' },
        garment: { base: '#3a5a9a', sh: '#274072' },
        headwear: function (d, h) { HW.veil(d, h.fm, '#f4eee2'); HW.queenCrown(d, h.fm, '#ecc94a'); },
        extras: function (d, h) { ACC.crossNeck(d, 24, h.fm.chin + 6, '#e8c352'); }
      }
    },
    {
      id: 'm03_dlugosz', name: 'Jan Długosz',
      cfg: {
        skin: '#e0b086', faceW: 1, mood: 'calm', eyeColor: '#3a2e22',
        hair: { color: '#9a9488', style: 'tonsure' },
        garment: { base: '#33302a', sh: '#211f1b' },
        headwear: function (d, h) { HW.cap(d, h.fm, '#2e2a24'); },
        extras: function (d, h) { ACC.bookQuill(d, h.OL); }
      }
    },
    {
      id: 'm03_tatar', name: 'Tatarski sojusznik',
      cfg: {
        skin: '#d6a06a', faceW: 1, mood: 'sly', eyeColor: '#2e1e10',
        hair: { color: '#2a1c12', style: 'short' },
        beard: { color: '#2a1c12', style: 'mustache' },
        garment: { base: '#6a4a2a', sh: '#48311b' },
        back: function (d) { ACC.bow(d, 9); },
        headwear: function (d, h) { HW.furHat(d, h.fm, '#3a2a1a', { feather: '#b03030', tall: true }); }
      }
    },
    {
      id: 'm03_rycerz', name: 'Polski rycerz',
      cfg: {
        skin: '#e2b48a', faceW: 1, mood: 'proud', eyeColor: '#3a3026',
        garment: { base: '#a6acb6', sh: '#787e8a' },
        back: function (d) { ACC.banner(d, 40, '#7a5a2a', '#b03030'); },
        headwear: function (d, h) { HW.helmet(d, h.fm, '#b8bcc4', { plume: '#b03030' }); },
        collar: function (d, h) { ACC.gorget(d, h.fm, '#aeb4be'); }
      }
    }
  ];
})();
