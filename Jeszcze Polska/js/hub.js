// hub.js — ekran wyboru misji
window.JP = window.JP || {};

JP.Hub = {
  MISSIONS: [
    { id: 'm01', nr: 'I',   title: 'Mieszko I',          subtitle: 'Chrzest i pierwsza korona', dates: '966–1025',   locked: false, accent: '#b8923a', bubble: ['#d9b257','#8a6a24'], btnBg: '#9a7a2c' },
    { id: 'm02', nr: 'II',  title: 'Kazimierz Wielki',   subtitle: 'Polska z kamienia',          dates: '1333–1370',  locked: false, accent: '#2f6b3a', bubble: ['#3f8a4c','#1f4a28'], btnBg: '#2f6b3a' },
    { id: 'm03', nr: 'III', title: 'Jagiełło / Grunwald', subtitle: 'Unia i wielka bitwa', dates: '1385–1410', locked: false, accent: '#2f5a8a', bubble: ['#3d6ea6','#1d3f63'], btnBg: '#2f5a8a' },
    { id: 'm04', nr: 'IV',  title: 'Rzeczpospolita',     subtitle: 'Złoty wiek i Kreml',    dates: '1569–1612',  locked: false, accent: '#6b3f7a', bubble: ['#855097','#48285a'], btnBg: '#6b3f7a' },
    { id: 'm05', nr: 'V',   title: 'Rozbiory',           subtitle: 'Upadek i noc',               dates: '1763–1795',  locked: false, accent: '#6e3b2a', bubble: ['#8a4a34','#4a241a'], btnBg: '#6e3b2a' },
  ],

  _card: function (m) {
    var locked = m.locked;
    var borderHover = locked ? '' : m.accent;

    var badge = locked
      ? '<span style="display:inline-flex;align-items:center;gap:5px;margin-top:14px;padding:6px 14px;border-radius:4px;font-size:13px;font-weight:700;color:#a08060;background:#3a2a15;">&#128274; Zablokowane</span>'
      : '<span style="display:inline-flex;align-items:center;gap:6px;margin-top:14px;padding:6px 14px;border-radius:4px;font-size:13px;font-weight:700;letter-spacing:.04em;color:#fbeec4;background:' + m.btnBg + ';box-shadow:inset 0 1px 0 rgba(255,240,200,.3);">&#9656; Graj</span>';

    return '<button class="hub-card" data-mission="' + m.id + '"' +
      (locked ? ' disabled' : '') +
      ' style="' +
        'flex:1 1 168px;min-width:150px;max-width:206px;' +
        'position:relative;cursor:' + (locked ? 'default' : 'pointer') + ';' +
        'text-align:left;padding:34px 16px 14px;' +
        'border:1px solid rgba(110,80,36,.45);border-left:4px solid ' + m.accent + ';' +
        'border-radius:5px;background:linear-gradient(#f7efd6,#e8d7ad);' +
        'box-shadow:0 7px 16px rgba(60,40,15,.26),inset 0 0 0 1px rgba(255,250,232,.5);' +
        'transition:transform .16s ease,box-shadow .16s ease;' +
        (locked ? 'opacity:.55;filter:grayscale(40%);' : '') +
      '">' +
      '<span style="position:absolute;top:-15px;left:14px;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:\'Cardo\',serif;font-weight:700;font-size:18px;color:#fbeec4;background:radial-gradient(circle at 38% 30%,' + m.bubble[0] + ',' + m.bubble[1] + ');box-shadow:0 3px 7px rgba(0,0,0,.35),inset 0 0 0 1.5px rgba(255,240,200,.4);">' + m.nr + '</span>' +
      '<div style="font-family:\'Cardo\',serif;font-weight:700;font-size:18px;color:#3a2710;line-height:1.12;">' + m.title + '</div>' +
      '<div style="margin-top:4px;font-size:11px;letter-spacing:.18em;color:#8a6a30;font-weight:700;">' + m.dates + '</div>' +
      '<div style="margin-top:8px;font-style:italic;font-size:13.5px;color:#6b522e;line-height:1.35;">' + m.subtitle + '</div>' +
      badge +
    '</button>';
  },

  mount: function (container) {
    var cards = JP.Hub.MISSIONS.map(JP.Hub._card).join('');

    container.innerHTML =
      '<div style="position:absolute;inset:0;overflow-y:auto;box-sizing:border-box;display:flex;align-items:flex-start;justify-content:center;padding:clamp(12px,2.2vw,34px);font-family:\'Cardo\',Georgia,serif;background:radial-gradient(125% 105% at 50% -5%,#3a2616 0%,#241509 52%,#160d05 100%);">' +

        // leather grain
        '<div style="position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:overlay;background:repeating-linear-gradient(96deg,rgba(255,220,160,.05) 0 2px,rgba(0,0,0,.06) 2px 5px),repeating-linear-gradient(8deg,rgba(0,0,0,.05) 0 3px,rgba(255,220,160,.03) 3px 6px);"></div>' +

        // outer frame
        '<div style="position:relative;width:min(1180px,100%);border-radius:9px;padding:clamp(13px,1.9vw,24px);background:linear-gradient(158deg,#3c2a17 0%,#2a1a0c 55%,#1d1107 100%);border:3px solid #160d06;box-shadow:0 0 0 2px #b9923f,0 0 0 5px #1e130a,0 0 0 7px #7a5d2a,inset 0 0 70px rgba(0,0,0,.62),0 34px 90px rgba(0,0,0,.6);">' +

          // gold corner flourishes
          '<div style="position:absolute;top:6px;left:6px;width:34px;height:34px;border-top:2px solid #c8a24a;border-left:2px solid #c8a24a;border-radius:6px 0 0 0;"></div>' +
          '<div style="position:absolute;top:6px;right:6px;width:34px;height:34px;border-top:2px solid #c8a24a;border-right:2px solid #c8a24a;border-radius:0 6px 0 0;"></div>' +
          '<div style="position:absolute;bottom:6px;left:6px;width:34px;height:34px;border-bottom:2px solid #c8a24a;border-left:2px solid #c8a24a;border-radius:0 0 0 6px;"></div>' +
          '<div style="position:absolute;bottom:6px;right:6px;width:34px;height:34px;border-bottom:2px solid #c8a24a;border-right:2px solid #c8a24a;border-radius:0 0 6px 0;"></div>' +

          // parchment
          '<div style="position:relative;overflow:hidden;border-radius:4px;padding:clamp(26px,4vw,52px) clamp(28px,5vw,72px) clamp(22px,3.2vw,40px);background:radial-gradient(135% 130% at 18% 8%,#f5ead0 0%,#ecdcb6 40%,#ddca9d 74%,#cbb586 100%);box-shadow:inset 0 0 95px rgba(120,86,38,.42),inset 0 0 0 1px rgba(120,86,38,.3);">' +

            // aging blotches
            '<div style="position:absolute;inset:0;pointer-events:none;opacity:.55;background:radial-gradient(40% 30% at 12% 88%,rgba(120,80,30,.18),transparent 60%),radial-gradient(34% 26% at 90% 16%,rgba(120,80,30,.16),transparent 60%),radial-gradient(50% 40% at 78% 92%,rgba(90,60,24,.14),transparent 60%),radial-gradient(30% 24% at 6% 30%,rgba(150,110,50,.12),transparent 60%);"></div>' +

            // faint historic map
            '<svg viewBox="0 0 1180 640" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:.2;pointer-events:none;">' +
              '<g fill="none" stroke="#6e5026" stroke-width="2.4" stroke-linejoin="round">' +
                '<path d="M250 150 C340 120 470 132 560 120 C660 108 770 130 860 150 C930 165 952 220 930 280 C912 330 940 380 905 430 C865 486 760 500 660 505 C560 510 470 500 380 470 C300 444 250 410 235 350 C222 296 215 200 250 150 Z" opacity=".55"/>' +
              '</g>' +
              '<g fill="none" stroke="#3f6f86" stroke-width="2.2" stroke-linecap="round" opacity=".5">' +
                '<path d="M560 120 C548 200 600 250 590 320 C582 380 632 420 660 505"/>' +
                '<path d="M380 470 C420 410 400 350 470 320 C520 298 540 250 560 230"/>' +
              '</g>' +
              '<g fill="#6e5026" opacity=".55" font-family="Cardo,serif" font-style="italic" font-size="20" text-anchor="middle">' +
                '<circle cx="600" cy="318" r="4"/><text x="600" y="300">Krak\xf3w</text>' +
                '<circle cx="560" cy="170" r="4"/><text x="560" y="153">Gniezno</text>' +
                '<circle cx="670" cy="232" r="4"/><text x="690" y="226">Warszawa</text>' +
                '<circle cx="560" cy="118" r="4"/><text x="560" y="104">Gdańsk</text>' +
                '<circle cx="852" cy="178" r="4"/><text x="852" y="162">Wilno</text>' +
              '</g>' +
              '<g stroke="#6e5026" stroke-width="2" fill="none" opacity=".5">' +
                '<path d="M360 500 l14 -20 l14 20 M392 500 l16 -24 l16 24 M430 500 l14 -20 l14 20 M700 470 l14 -20 l14 20 M732 470 l16 -24 l16 24"/>' +
              '</g>' +
              '<g transform="translate(900,470)" stroke="#6e5026" fill="#6e5026" opacity=".5">' +
                '<circle r="34" fill="none" stroke-width="2"/>' +
                '<circle r="22" fill="none" stroke-width="1"/>' +
                '<path d="M0 -40 L7 0 L0 40 L-7 0 Z" fill="#6e5026"/>' +
                '<path d="M-40 0 L0 -7 L40 0 L0 7 Z" fill="none" stroke-width="2"/>' +
                '<text x="0" y="-44" font-size="16" text-anchor="middle" font-family="Cardo,serif">N</text>' +
              '</g>' +
            '</svg>' +

            // warm light wash
            '<div style="position:absolute;left:50%;top:0;transform:translateX(-50%);width:min(720px,86%);height:60%;pointer-events:none;background:radial-gradient(60% 70% at 50% 30%,rgba(250,242,222,.85),rgba(250,242,222,0) 72%);"></div>' +

            // left torch
            '<div style="position:absolute;left:clamp(4px,1vw,16px);top:26%;width:54px;height:120px;pointer-events:none;z-index:6;">' +
              '<div style="position:absolute;left:50%;top:-150px;transform:translateX(-50%);width:520px;height:520px;border-radius:50%;mix-blend-mode:soft-light;background:radial-gradient(circle,rgba(255,176,84,.85) 0%,rgba(255,150,60,.4) 28%,rgba(255,150,60,0) 64%);animation:glowFlicker 2.9s ease-in-out infinite;"></div>' +
              '<div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:14px;height:70px;border-radius:3px;background:linear-gradient(#5a3c1e,#2e1d0d);box-shadow:0 0 0 1px rgba(0,0,0,.4);"></div>' +
              '<div style="position:absolute;left:50%;bottom:62px;transform:translateX(-50%);width:30px;height:16px;border-radius:50% 50% 40% 40%;background:radial-gradient(circle at 50% 30%,#6b4a28,#2b1a0c);box-shadow:inset 0 -2px 3px rgba(0,0,0,.5);"></div>' +
              '<div style="position:absolute;left:50%;bottom:74px;transform-origin:50% 100%;animation:flameFlicker 2.4s ease-in-out infinite;">' +
                '<div style="position:relative;width:26px;height:26px;transform:rotate(-45deg);border-radius:0 50% 50% 50%;background:linear-gradient(135deg,#ffe07a 0%,#ff921f 52%,#df4f17 100%);box-shadow:0 0 22px 8px rgba(255,140,45,.6);">' +
                  '<div style="position:absolute;left:6px;top:6px;width:13px;height:13px;transform:rotate(0deg);border-radius:0 50% 50% 50%;background:linear-gradient(135deg,#fff6d2,#ffcf66);"></div>' +
                '</div>' +
              '</div>' +
              '<div style="position:absolute;left:46%;bottom:96px;width:4px;height:4px;border-radius:50%;background:#ffb454;animation:emberRise 3.2s ease-in infinite;"></div>' +
              '<div style="position:absolute;left:58%;bottom:92px;width:3px;height:3px;border-radius:50%;background:#ff9a3c;animation:emberRise 4.1s ease-in .8s infinite;"></div>' +
            '</div>' +

            // right torch
            '<div style="position:absolute;right:clamp(4px,1vw,16px);top:26%;width:54px;height:120px;pointer-events:none;z-index:6;">' +
              '<div style="position:absolute;left:50%;top:-150px;transform:translateX(-50%);width:520px;height:520px;border-radius:50%;mix-blend-mode:soft-light;background:radial-gradient(circle,rgba(255,176,84,.85) 0%,rgba(255,150,60,.4) 28%,rgba(255,150,60,0) 64%);animation:glowFlicker 3.3s ease-in-out .6s infinite;"></div>' +
              '<div style="position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:14px;height:70px;border-radius:3px;background:linear-gradient(#5a3c1e,#2e1d0d);box-shadow:0 0 0 1px rgba(0,0,0,.4);"></div>' +
              '<div style="position:absolute;left:50%;bottom:62px;transform:translateX(-50%);width:30px;height:16px;border-radius:50% 50% 40% 40%;background:radial-gradient(circle at 50% 30%,#6b4a28,#2b1a0c);box-shadow:inset 0 -2px 3px rgba(0,0,0,.5);"></div>' +
              '<div style="position:absolute;left:50%;bottom:74px;transform-origin:50% 100%;animation:flameFlicker 2.7s ease-in-out .4s infinite;">' +
                '<div style="position:relative;width:26px;height:26px;transform:rotate(-45deg);border-radius:0 50% 50% 50%;background:linear-gradient(135deg,#ffe07a 0%,#ff921f 52%,#df4f17 100%);box-shadow:0 0 22px 8px rgba(255,140,45,.6);">' +
                  '<div style="position:absolute;left:6px;top:6px;width:13px;height:13px;border-radius:0 50% 50% 50%;background:linear-gradient(135deg,#fff6d2,#ffcf66);"></div>' +
                '</div>' +
              '</div>' +
              '<div style="position:absolute;left:46%;bottom:96px;width:4px;height:4px;border-radius:50%;background:#ffb454;animation:emberRise 3.6s ease-in .3s infinite;"></div>' +
              '<div style="position:absolute;left:58%;bottom:92px;width:3px;height:3px;border-radius:50%;background:#ff9a3c;animation:emberRise 4.4s ease-in 1.1s infinite;"></div>' +
            '</div>' +

            // content
            '<div style="position:relative;z-index:5;max-width:1060px;margin:0 auto;text-align:center;">' +

              // crown row
              '<div style="display:flex;align-items:center;justify-content:center;gap:18px;margin-bottom:6px;">' +
                '<div style="width:34px;height:42px;clip-path:polygon(0 0,100% 0,100% 62%,50% 100%,0 62%);background:linear-gradient(#9e2b22,#6e1c16);box-shadow:0 0 0 2px #c8a24a,0 3px 6px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:#f0dca0;font-size:17px;padding-bottom:6px;">&#9819;</div>' +
                '<svg width="50" height="32" viewBox="0 0 50 32" aria-hidden="true">' +
                  '<defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d987"/><stop offset="1" stop-color="#b6862f"/></linearGradient></defs>' +
                  '<path d="M4 28 L8 8 L18 19 L25 4 L32 19 L42 8 L46 28 Z" fill="url(#cg)" stroke="#7a5d2a" stroke-width="1.4" stroke-linejoin="round"/>' +
                  '<rect x="4" y="27" width="42" height="4" rx="1.5" fill="url(#cg)" stroke="#7a5d2a" stroke-width="1"/>' +
                  '<circle cx="8" cy="8" r="2.6" fill="#f3d987" stroke="#7a5d2a" stroke-width="1"/>' +
                  '<circle cx="25" cy="4" r="2.8" fill="#9e2b22" stroke="#7a5d2a" stroke-width="1"/>' +
                  '<circle cx="42" cy="8" r="2.6" fill="#f3d987" stroke="#7a5d2a" stroke-width="1"/>' +
                '</svg>' +
                '<div style="width:34px;height:42px;clip-path:polygon(0 0,100% 0,100% 62%,50% 100%,0 62%);background:linear-gradient(#234a86,#16315c);box-shadow:0 0 0 2px #c8a24a,0 3px 6px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:#f0dca0;font-size:16px;padding-bottom:6px;">&#10013;</div>' +
              '</div>' +

              '<h1 style="margin:0;font-family:\'Cinzel\',Georgia,serif;font-weight:800;font-size:clamp(40px,6.6vw,86px);line-height:1;color:#4a2d12;text-shadow:0 1px 0 rgba(255,248,225,.6),0 2px 5px rgba(74,45,18,.35);letter-spacing:2px;">Jeszcze Polska</h1>' +

              '<div style="margin:14px 0 4px;font-size:clamp(13px,1.5vw,17px);letter-spacing:.42em;text-transform:uppercase;color:#7a5021;font-weight:700;font-family:\'Cinzel\',serif;">Kronika Kr\xf3lewska &nbsp;&middot;&nbsp; 966–1795</div>' +

              // divider
              '<div style="display:flex;align-items:center;justify-content:center;gap:14px;margin:16px auto 14px;max-width:340px;color:#9a7434;">' +
                '<span style="flex:1;height:1px;background:linear-gradient(90deg,transparent,#9a7434);"></span>' +
                '<span style="font-size:11px;transform:rotate(45deg);width:8px;height:8px;background:#9a7434;display:inline-block;"></span>' +
                '<span style="flex:1;height:1px;background:linear-gradient(90deg,#9a7434,transparent);"></span>' +
              '</div>' +

              '<p style="margin:0 auto;max-width:600px;font-size:clamp(14px,1.65vw,18px);line-height:1.62;color:#4f3a1f;">Odkryj niezwykłe sekrety przeszłości i przekonaj się, jak fascynujące potrafią być losy dawnych kr\xf3l\xf3w, wielkich bitew oraz mądrych władc\xf3w, kt\xf3rzy budowali nasz kraj. Wybierz swoją pierwszą misję i stań oko w oko z historią.</p>' +

              // cards
              '<div style="display:flex;flex-wrap:wrap;gap:clamp(10px,1.3vw,18px);justify-content:center;margin-top:clamp(22px,3vw,38px);padding-top:18px;">' +
                cards +
              '</div>' +

              '<div style="margin-top:clamp(20px,2.6vw,32px);font-style:italic;font-size:13.5px;letter-spacing:.06em;color:#8a6a3a;">Wybierz misję, aby wkroczyć w historię.</div>' +

            '</div>' +

            // vignette
            '<div style="position:absolute;inset:0;pointer-events:none;z-index:7;background:radial-gradient(120% 120% at 50% 40%,transparent 52%,rgba(40,24,8,.4) 100%);animation:ambientBreath 6.5s ease-in-out infinite;"></div>' +

          '</div>' + // parchment
        '</div>' +   // frame
      '</div>';      // outer

    // wire click events
    JP.Hub.MISSIONS.forEach(function (m) {
      if (m.locked) return;
      var btn = container.querySelector('[data-mission="' + m.id + '"]');
      if (btn) btn.addEventListener('click', function () {
        JP.Engine.showScene('mission', { missionId: m.id });
      });
    });
  },
};
