/* Mission 1 portrait configs — chunky flat style (window.PA v2). */
(function () {
  var HW = PA.HW, ACC = PA.ACC, shade = PA.shade, mix = PA.mix;

  window.MISSIONS = window.MISSIONS || {};
  window.MISSIONS.m1 = [
    {
      id: 'm01_dobrawa', name: 'Dobrawa',
      cfg: {
        skin: '#f0c49c', faceW: 0.95, mood: 'gentle', eyeColor: '#5a4a6a', eyeWhite: true,
        hair: { color: '#8a5a2e', style: 'long' },
        garment: { base: '#a63a48', sh: '#7a2832' },
        headwear: function (d, h) { HW.veil(d, h.fm, '#f2ebdc'); HW.diadem(d, h.fm, '#e8c352'); },
        extras: function (d, h) { ACC.crossNeck(d, 24, h.fm.chin + 6, '#e8c352'); }
      }
    },
    {
      id: 'm01_jordan', name: 'Biskup Jordan',
      cfg: {
        skin: '#e6b78c', faceW: 1, mood: 'calm', eyeColor: '#4a3a2a',
        hair: { color: '#d8d2c4', style: 'tonsure' },
        beard: { color: '#d8d2c4', style: 'full' },
        garment: { base: '#ece4d0', sh: '#c2b89c' },
        back: function (d) { ACC.crosier(d, 38, '#d8b24a'); },
        headwear: function (d, h) { HW.mitre(d, h.fm, '#f4eddb'); },
        collar: function (d, h) { d.rect(20, h.fm.chin + 3, 2, 12, '#c8a24a'); d.rect(26, h.fm.chin + 3, 2, 12, '#c8a24a'); }
      }
    },
    {
      id: 'm01_wojciech', name: 'Św. Wojciech',
      cfg: {
        skin: '#e8b88c', faceW: 0.85, mood: 'gentle', eyeColor: '#4a3420',
        hair: { color: '#6a4a2c', style: 'tonsure' },
        garment: { base: '#6b5235', sh: '#4a3722' },
        back: function (d) { ACC.crosier(d, 37, '#caa24a'); },
        headwear: function (d, h) { HW.hood(d, h.fm, '#6b5235'); },
        extras: function (d, h) { ACC.crossNeck(d, 24, h.fm.chin + 6, '#caa24a'); }
      }
    },
    {
      id: 'm01_boleslaw', name: 'Bolesław Chrobry',
      cfg: {
        skin: '#e0a878', faceW: 1.12, mood: 'proud', eyeColor: '#3a2614',
        hair: { color: '#6a3f22', style: 'medium' },
        beard: { color: '#6a3f22', style: 'full' },
        garment: { base: '#8f2a22', sh: '#5e1812' },
        headwear: function (d, h) { HW.crown(d, h.fm, '#f0cf63'); },
        collar: function (d, h) {
          var y0 = h.fm.chin + 3;
          for (var y = y0; y <= y0 + 2; y++) { d.span(y, 18, 30, '#8e8e98'); for (var x = 18; x <= 30; x++) if ((x + y) % 2 === 0) d.p(x, y, '#5e5e68'); }
          d.p(24, y0 + 5, '#e8c352'); d.p(24, y0 + 6, '#e8c352'); d.p(23, y0 + 6, '#c0392b');
        }
      }
    },
    {
      id: 'm01_otto', name: 'Otto III',
      cfg: {
        skin: '#f2c8a2', faceW: 0.92, mood: 'calm', eyeColor: '#3a5070', eyeWhite: true,
        hair: { color: '#c89a4a', style: 'medium' },
        garment: { base: '#5a3f86', sh: '#3c2860' },
        headwear: function (d, h) { HW.imperial(d, h.fm, '#f4d56a'); },
        collar: function (d, h) {
          var y0 = h.fm.chin + 3;
          d.span(y0, 18, 30, '#e8c352'); d.span(y0 + 1, 19, 29, '#e8c352');
          d.p(21, y0, '#c0392b'); d.p(24, y0, '#2e6da4'); d.p(27, y0, '#2e9e5b');
        }
      }
    },
    {
      id: 'm01_hipolit', name: 'Arcybiskup Hipolit',
      cfg: {
        skin: '#dcb088', faceW: 1, mood: 'sad', eyeColor: '#4a3826',
        hair: { color: '#cac4b6', style: 'tonsure' },
        beard: { color: '#cac4b6', style: 'full' },
        garment: { base: '#cabda6', sh: '#a89b82' },
        headwear: function (d, h) { HW.mitre(d, h.fm, '#e6ddc8'); },
        collar: function (d, h) {
          var y0 = h.fm.chin + 3;
          d.rect(23, y0, 3, 13, '#f0ead8');             // pallium band
          d.p(24, y0 + 3, '#3a3026'); d.p(24, y0 + 8, '#3a3026'); // crosses
        }
      }
    },
    {
      id: 'm01_thietmar', name: 'Thietmar z Merseburga',
      cfg: {
        skin: '#e2b288', faceW: 1, mood: 'stern', eyeColor: '#3a4a64',
        hair: { color: '#a09a8c', style: 'tonsure' },
        beard: { color: '#a09a8c', style: 'short' },
        garment: { base: '#3a4150', sh: '#262c38' },
        headwear: function (d, h) { HW.mitre(d, h.fm, '#dfe6ee'); },
        extras: function (d, h) { ACC.bookQuill(d, h.OL); }
      }
    },
    {
      id: 'm01_mieszko', name: 'Mieszko I',
      cfg: {
        skin: '#dca878', faceW: 1.05, mood: 'calm', eyeColor: '#3a2614',
        hair: { color: '#5a3a20', style: 'medium' },
        beard: { color: '#5a3a20', style: 'full' },
        garment: { base: '#5a4226', sh: '#3c2c18' },
        headwear: function (d, h) { HW.diadem(d, h.fm, '#caa24b'); },
        collar: function (d, h) {  // fur collar
          var y0 = h.fm.chin + 3, c = '#7a6244';
          for (var y = y0; y <= y0 + 3; y++) for (var x = 16; x <= 32; x++) if ((x + y) % 2 === 0) d.p(x, y, ((x + y) % 4 === 0) ? shade(c, 0.2) : c);
        }
      }
    },
    {
      id: 'm01_henryk', name: 'Henryk II',
      cfg: {
        skin: '#dcb89a', faceW: 0.98, mood: 'stern', eyeColor: '#3a4452',
        hair: { color: '#4a4036', style: 'medium' },
        beard: { color: '#4a4036', style: 'forked' },
        garment: { base: '#2e3640', sh: '#1c222a' },
        headwear: function (d, h) { HW.imperial(d, h.fm, '#e6cf6a'); },
        collar: function (d, h) {
          var y0 = h.fm.chin + 3;
          d.span(y0, 18, 30, '#caa24a'); d.span(y0 + 1, 19, 29, '#caa24a');
        }
      }
    }
  ];
})();
