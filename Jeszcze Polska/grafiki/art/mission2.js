/* Mission 2 portrait configs — chunky flat style (window.PA v2). */
(function () {
  var HW = PA.HW, ACC = PA.ACC, shade = PA.shade, mix = PA.mix;

  // small head for multi-figure portraits
  function miniHead(d, cx, top, o) {
    var skin = o.skin, sh = shade(skin, -0.16), OL = '#17120e';
    var prof = [2, 3, 4, 4, 4, 4, 3, 3, 2];
    for (var i = 0; i < prof.length; i++) d.span(top + i, cx - prof[i], cx + prof[i], skin);
    for (var s = 1; s < prof.length; s++) d.p(cx - prof[s], top + s, sh);
    // hat
    if (o.hat) { for (var y = top; y >= top - 3; y--) { var w = (y < top - 1) ? 3 : 4; d.span(y, cx - w, cx + w, o.hat); } d.span(top - 3, cx - 3, cx + 2, shade(o.hat, 0.15)); }
    // hairline / beard
    if (o.beard) { for (var b = top + 5; b <= top + 8; b++) { var w2 = prof[Math.min(b - top, prof.length - 1)]; d.span(b, cx - w2, cx + w2, o.beard); } }
    // eyes
    d.p(cx - 2, top + 4, '#2b1d12'); d.p(cx + 2, top + 4, '#2b1d12');
    // mouth (if no beard)
    if (!o.beard) d.span(top + 6, cx - 1, cx + 1, '#7c3e30');
  }

  window.MISSIONS = window.MISSIONS || {};
  window.MISSIONS.m2 = [
    {
      id: 'm02_architekt', name: 'Architekt',
      cfg: {
        skin: '#e6b187', faceW: 1, mood: 'calm', eyeColor: '#3a2a1a',
        hair: { color: '#6a5236', style: 'medium' },
        beard: { color: '#6a5236', style: 'short' },
        garment: { base: '#7a6a48', sh: '#5a4d32' },
        headwear: function (d, h) { HW.cap(d, h.fm, '#9a7a3a'); },
        extras: function (d, h) { ACC.scroll(d, 31, 36); }
      }
    },
    {
      id: 'm02_kupiec', name: 'Krakowski kupiec',
      cfg: {
        skin: '#e8b88c', faceW: 1.06, mood: 'sly', eyeColor: '#3a2a1a',
        hair: { color: '#5a4030', style: 'short' },
        beard: { color: '#5a4030', style: 'short' },
        garment: { base: '#7a2f3a', sh: '#561f27' },
        headwear: function (d, h) { HW.brimHat(d, h.fm, '#4a2e22', { feather: '#caa24a' }); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 17, 31, '#caa24a'); },
        extras: function (d, h) { ACC.coin(d, 30, 38); ACC.coin(d, 33, 40); }
      }
    },
    {
      id: 'm02_osadnik', name: 'Żydowski osadnik',
      cfg: {
        skin: '#e2b288', faceW: 0.95, mood: 'gentle', eyeColor: '#3a2a1a',
        hair: { color: '#3a2a1c', style: 'medium' },
        beard: { color: '#3a2a1c', style: 'full' },
        garment: { base: '#3f4a5a', sh: '#2a3240' },
        headwear: function (d, h) { HW.skullcap(d, h.fm, '#2e2a34'); }
      }
    },
    {
      id: 'm02_kiesselhuth', name: 'Kiesselhuth i Konrad',
      cfg: {
        render: function (d, h) {
          var OL = h.OL;
          // shared garment
          for (var y = 30; y < 48; y++) { var t = (y - 30) / 18, hw = Math.round(11 + t * 13); d.span(y, 24 - hw, 24 + hw, '#5a5040'); d.p(24 - hw, y, '#3f382c'); d.p(24 + hw, y, '#3f382c'); }
          // two necks
          d.rect(13, 28, 4, 3, '#e6b187'); d.rect(31, 28, 4, 3, '#e0a878');
          // two heads
          miniHead(d, 15, 14, { skin: '#e6b187', hat: '#6a4a2a', beard: '#5a4030' });
          miniHead(d, 33, 14, { skin: '#e0a878', hat: '#3a4a5a' });
          // shared location document held between them
          d.rect(19, 35, 10, 9, '#f0e6c8'); d.p(19, 35, '#caa56a'); d.p(28, 35, '#caa56a');
          for (var l = 0; l < 3; l++) d.hline(21, 37 + l * 2, 6, '#b8a884');
          d.p(24, 43, '#b03030'); // wax seal
          h.outlinePass(d, OL);
        }
      }
    },
    {
      id: 'm02_kronikarz', name: 'Kronikarz',
      cfg: {
        skin: '#dcb088', faceW: 1, mood: 'calm', eyeColor: '#3a3026',
        hair: { color: '#b8b2a4', style: 'medium' },
        beard: { color: '#b8b2a4', style: 'full' },
        garment: { base: '#34302a', sh: '#221f1b' },
        headwear: function (d, h) { HW.cap(d, h.fm, '#3a352c'); },
        extras: function (d, h) { ACC.bookQuill(d, h.OL); }
      }
    },
    {
      id: 'm02_doradca', name: 'Doradca króla',
      cfg: {
        skin: '#e2b48a', faceW: 0.98, mood: 'sad', eyeColor: '#3a2e22',
        hair: { color: '#6a5236', style: 'medium' },
        beard: { color: '#6a5236', style: 'short' },
        garment: { base: '#3e5240', sh: '#293828' },
        headwear: function (d, h) { HW.cap(d, h.fm, '#2e4030'); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#caa24a'); }
      }
    },
    {
      id: 'm02_ludwik', name: 'Ludwik Węgierski',
      cfg: {
        skin: '#e8bd92', faceW: 1.02, mood: 'proud', eyeColor: '#3a4055',
        hair: { color: '#7a5230', style: 'medium' },
        beard: { color: '#7a5230', style: 'short' },
        garment: { base: '#1f6a4a', sh: '#134331' },
        headwear: function (d, h) { HW.hungarianCrown(d, h.fm, '#eccb55'); },
        collar: function (d, h) { var y0 = h.fm.chin + 3; d.span(y0, 18, 30, '#caa24a'); d.p(24, y0, '#c0392b'); }
      }
    },
    {
      id: 'm02_kazimierz', name: 'Kazimierz Wielki',
      cfg: {
        skin: '#e4b186', faceW: 1.08, mood: 'calm', eyeColor: '#3a2614',
        hair: { color: '#7a5028', style: 'medium' },
        beard: { color: '#7a5028', style: 'full' },
        garment: { base: '#9a2f2a', sh: '#6c1f1c' },
        headwear: function (d, h) { HW.crown(d, h.fm, '#f0cf63'); },
        collar: function (d, h) { ACC.ermine(d, h.fm); }
      }
    }
  ];
})();
