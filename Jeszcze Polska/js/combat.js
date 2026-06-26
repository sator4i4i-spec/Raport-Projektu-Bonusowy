// js/combat.js — PA engine battle overlay (Psków, Kłuszyn, Zieleńce, Racławice, Maciejowice)
// Usage: JP.Combat.start(battleId, onDone)
//   battleId: 'pskow' | 'kluszynk' | 'zielence' | 'raclawice' | 'maciejowice'
//   onDone:   called after the overlay is dismissed (audio already switched to 'explore')
window.JP = window.JP || {};

JP.Combat = (function () {

  // ── Common HTML builders ──────────────────────────────────────────

  function _enemyPortrait(b) {
    return '<div style="position:absolute;left:858px;top:236px;width:152px;height:152px;' +
      'border-radius:50%;overflow:hidden;background:' + b.enemy.portraitBg + ';' +
      'box-shadow:0 0 0 4px #20170d,0 0 0 7px ' + b.enemy.ringColor + ',0 10px 22px rgba(0,0,0,.5);">' +
      '<img src="' + b.enemy.portrait + '" style="position:absolute;width:142%;height:142%;left:-21%;top:-6%;image-rendering:pixelated;" />' +
      '</div>';
  }

  function _playerPortrait(b) {
    return '<div style="position:absolute;left:300px;top:322px;width:198px;height:198px;' +
      'border-radius:50%;overflow:hidden;background:' + b.player.portraitBg + ';' +
      'box-shadow:0 0 0 5px #20170d,0 0 0 8px ' + b.player.ringColor + ',0 12px 26px rgba(0,0,0,.55);">' +
      '<img src="' + b.player.portrait + '" style="position:absolute;width:140%;height:140%;left:-20%;top:-4%;image-rendering:pixelated;" />' +
      '</div>';
  }

  function _enemyNameplate(b) {
    var e = b.enemy;
    return '<div style="position:absolute;right:26px;top:26px;width:330px;padding:13px 16px 14px;' + e.nameplateStyle + '">' +
      '<div style="font-family:\'Jersey 15\',sans-serif;font-size:26px;color:' + e.nameColor + ';letter-spacing:.5px;line-height:1;">' + e.name + '</div>' +
      '<div style="font-size:21px;color:' + e.subColor + ';margin-top:5px;line-height:1;">' + e.sub + '</div>' +
      '<div style="display:flex;align-items:center;gap:9px;margin-top:9px;">' +
        '<span style="font-family:\'Jersey 15\',sans-serif;font-size:17px;color:' + e.hpColor + ';">HP</span>' +
        '<div style="position:relative;flex:1;height:13px;background:' + e.hpBarBg + ';border:1px solid ' + e.hpBarBorder + ';box-shadow:inset 0 1px 0 ' + e.hpBarInset + ';">' +
          '<div data-role="enemy-hp-fill" style="height:100%;width:100%;background:#5bbf5b;transition:width .45s ease;"></div>' +
        '</div>' +
      '</div>' +
      '<div data-role="enemy-hp-text" style="text-align:right;font-size:18px;color:' + e.hpTextColor + ';margin-top:2px;">' + e.maxHp + ' / ' + e.maxHp + '</div>' +
      '</div>';
  }

  function _playerNameplate(b) {
    var p = b.player;
    return '<div style="position:absolute;left:26px;top:26px;width:344px;padding:12px 16px 13px;' + p.nameplateStyle + '">' +
      '<div style="font-family:\'Jersey 15\',sans-serif;font-size:26px;color:' + p.nameColor + ';letter-spacing:.5px;line-height:1;">' + p.name + '</div>' +
      '<div style="font-size:21px;color:' + p.subColor + ';margin-top:5px;line-height:1;">' + p.sub + '</div>' +
      '<div style="display:flex;align-items:center;gap:9px;margin-top:9px;">' +
        '<span style="font-family:\'Jersey 15\',sans-serif;font-size:17px;color:' + p.hpColor + ';">HP</span>' +
        '<div style="position:relative;flex:1;height:13px;background:' + p.hpBarBg + ';border:1px solid ' + p.hpBarBorder + ';box-shadow:inset 0 1px 0 ' + p.hpBarInset + ';">' +
          '<div data-role="player-hp-fill" style="height:100%;width:100%;background:#5bbf5b;transition:width .45s ease;"></div>' +
        '</div>' +
        '<span data-role="player-hp-text" style="font-size:18px;color:' + p.hpTextColor + ';">' + p.maxHp + ' / ' + p.maxHp + '</span>' +
      '</div>' +
      '</div>';
  }

  function _dialogue(b) {
    return '<div data-role="dialogue" data-initial="' + b.dialogue.replace(/"/g, '&quot;') + '" ' +
      'style="position:absolute;left:26px;bottom:24px;width:556px;height:248px;box-sizing:border-box;' +
      'padding:22px 26px 52px;background:linear-gradient(180deg,#f3ead0,#e6d8b6);border:3px solid #2c2012;' +
      'box-shadow:inset 0 0 0 2px #c8ab68,0 6px 18px rgba(0,0,0,.5);font-size:28px;line-height:1.2;' +
      'color:#2c2012;text-wrap:pretty;">' +
      '<span data-role="dlg-text">' + b.dialogue + '</span>' +
      '<button data-role="dlg-next" style="display:none;position:absolute;right:14px;bottom:12px;' +
        'font-family:\'Jersey 15\',sans-serif;font-size:22px;color:#2c2012;' +
        'background:linear-gradient(180deg,#e6d8b6,#cfc0a0);border:2px solid #2c2012;' +
        'padding:6px 18px;cursor:pointer;box-shadow:0 3px 0 #2c2012;letter-spacing:.5px;">Dalej ▶</button>' +
    '</div>';
  }

  function _buttons(b) {
    var btnStyle = 'display:flex;flex-direction:column;justify-content:center;gap:3px;text-align:left;' +
      'padding:0 22px;background:linear-gradient(180deg,#16223f,#101a31);border:2px solid #c79a3e;' +
      'box-shadow:inset 0 0 0 2px #233356;cursor:pointer;';
    var html = '<div style="position:absolute;right:26px;bottom:24px;width:602px;height:248px;' +
      'display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:14px;">';
    b.buttons.forEach(function (btn) {
      html += '<button data-opt data-result="' + btn.result.replace(/"/g, '&quot;') + '" style="' + btnStyle + '">' +
        '<div style="font-family:\'Jersey 15\',sans-serif;font-size:22px;color:#f0cb63;line-height:1.05;white-space:nowrap;">' + btn.label + '</div>' +
        '<div style="font-size:18px;color:#c9b889;line-height:1.1;">' + btn.sub + '</div>' +
        '</button>';
    });
    html += '</div>';
    return html;
  }

  function _banner(b) {
    var res = b.paConfig.outcome === 'loss' ? b.paConfig.loss : b.paConfig.win;
    var bgOverlay = b.paConfig.outcome === 'loss' ? 'rgba(6,7,10,.62)' : 'rgba(8,10,16,.58)';
    var btnBg    = b.paConfig.outcome === 'loss' ? '#c9b48a' : '#edc659';
    var btnColor = b.paConfig.outcome === 'loss' ? '#161c28' : '#0f1830';
    return '<div data-role="banner" style="position:absolute;inset:0;display:flex;flex-direction:column;' +
      'align-items:center;justify-content:center;gap:18px;background:' + bgOverlay + ';' +
      'opacity:0;pointer-events:none;transition:opacity .5s ease;color:' + (b.bannerColor || '#f3e2a8') + ';">' +
      '<div data-role="banner-title" style="font-family:\'Jersey 15\',sans-serif;font-size:74px;' +
        'letter-spacing:2px;text-shadow:0 4px 0 #000,0 0 24px rgba(0,0,0,.6);color:inherit;">' + res.t + '</div>' +
      '<div data-role="banner-sub" style="font-size:30px;color:#e7dcc2;max-width:760px;text-align:center;text-wrap:pretty;">' + res.s + '</div>' +
      '<button data-role="continue" style="margin-top:10px;font-family:\'Jersey 15\',sans-serif;font-size:30px;' +
        'color:' + btnColor + ';background:' + btnBg + ';border:2px solid #2c2012;padding:12px 36px;' +
        'cursor:pointer;box-shadow:0 4px 0 #2c2012;opacity:0;transition:opacity .5s ease;pointer-events:none;">Dalej ▶</button>' +
      '</div>';
  }

  function _buildOverlayHTML(b) {
    return '<div id="pa-stage" style="position:relative;width:1280px;height:800px;' +
      'transform-origin:center center;overflow:hidden;' +
      'box-shadow:0 0 0 4px #000,0 24px 70px rgba(0,0,0,.65);background:' + b.stageBg + ';">' +
      '<canvas id="pa-scene" width="1280" height="800" style="position:absolute;inset:0;' +
        'width:1280px;height:800px;image-rendering:pixelated;display:block;"></canvas>' +
      _enemyPortrait(b) +
      _playerPortrait(b) +
      _enemyNameplate(b) +
      _playerNameplate(b) +
      _dialogue(b) +
      _buttons(b) +
      _banner(b) +
      '</div>';
  }

  // ── Public API ────────────────────────────────────────────────────

  function start(battleId, onDone) {
    var b = BATTLES[battleId];
    if (!b) { console.warn('[JP.Combat] Unknown battle:', battleId); return; }

    JP.Audio.play('battle');

    var scene = document.querySelector('.game-scene');
    if (!scene) return;

    var hudH = getComputedStyle(document.documentElement).getPropertyValue('--hud-h').trim() || '42px';
    var ov = document.createElement('div');
    ov.style.cssText = 'position:absolute;top:' + hudH + ';left:0;right:0;bottom:0;z-index:200;' +
      'background:' + b.bg + ';display:flex;align-items:center;justify-content:center;' +
      'overflow:hidden;font-family:\'VT323\',monospace;';
    ov.innerHTML = _buildOverlayHTML(b);
    scene.appendChild(ov);

    var stage = ov.querySelector('#pa-stage');
    function _fit() {
      var s = Math.min(ov.clientWidth / 1280, ov.clientHeight / 800);
      stage.style.zoom = s;
    }
    _fit();
    window.addEventListener('resize', _fit);

    var canvas = ov.querySelector('#pa-scene');
    var paScene = new PA.Scene(canvas, b.spec);
    PA.startBattle(ov, b.paConfig);

    var banner = ov.querySelector('[data-role="banner"]');
    var continueBtn = banner && banner.querySelector('[data-role="continue"]');

    function _dismiss() {
      paScene.stop();
      window.removeEventListener('resize', _fit);
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      JP.Audio.play('explore');
      if (onDone) onDone();
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', _dismiss);
    }

    // When banner fades in, reveal the Dalej button after 2 s (let player read the result)
    if (banner) {
      var obs = new MutationObserver(function () {
        if (banner.style.opacity === '1') {
          obs.disconnect();
          setTimeout(function () {
            if (continueBtn) {
              continueBtn.style.opacity = '1';
              continueBtn.style.pointerEvents = 'auto';
            }
          }, 2000);
        }
      });
      obs.observe(banner, { attributes: true, attributeFilter: ['style'] });
    }
  }

  // ── Battle Specs ──────────────────────────────────────────────────

  var BATTLES = {};

  // ── PSKÓW 1581 ────────────────────────────────────────────────────
  BATTLES.pskow = {
    bg: '#080a0d', stageBg: '#1c2a40',
    bannerColor: '#f3e2a8',
    enemy: {
      name: 'IWAN IV GROŹNY',
      sub: 'Car Wszechrusi · obrońca Pskowa · Lv.28',
      portrait: 'bitwy/art/m04_bojar.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#d6a6a0,#9a5a55 68%,#5e3330)',
      ringColor: '#8a5a2e',
      nameplateStyle: 'background:linear-gradient(180deg,#f1e7cd,#e2d3b0);border:3px solid #2c2012;box-shadow:inset 0 0 0 2px #c8ab68,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#2a1d10', subColor: '#6f5d3b', hpColor: '#7a3128',
      hpBarBg: '#1d160b', hpBarBorder: '#0c0a06', hpBarInset: '#4a3a1f',
      hpTextColor: '#6f5d3b', maxHp: 1581,
    },
    player: {
      name: 'STEFAN BATORY',
      sub: 'Król Polski · oblężenie Pskowa · Lv.31',
      portrait: 'bitwy/art/m04_batory.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#f3e4b8,#d8b86e 68%,#a07f3e)',
      ringColor: '#d8b24a',
      nameplateStyle: 'background:linear-gradient(180deg,#1b2a4d,#0f1830);border:2px solid #cf9f3f;box-shadow:inset 0 0 0 2px #2d4170,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#edc659', subColor: '#aebbd6', hpColor: '#cf9f3f',
      hpBarBg: '#0a1120', hpBarBorder: '#000', hpBarInset: '#2d4170',
      hpTextColor: '#aebbd6', maxHp: 1581,
    },
    dialogue: 'Sierpień 1581. Wojska Batorego stają pod potężnymi murami Pskowa. Nadciąga sroga zima. Jak król poprowadzi oblężenie twierdzy?',
    buttons: [
      { label: '⚔ SZTURM MURÓW',  sub: 'piechota rusza na wały twierdzy',     result: 'Piechota Batorego wdziera się na mury! Obrońcy spychają część szturmu, ale w obwarowaniach powstaje wyłom.' },
      { label: '◎ OGIEŃ Z DZIAŁ', sub: 'artyleria kruszy baszty i mury',       result: 'Polskie działa biją w baszty Pskowa. Mury pękają z hukiem, lecz Rosjanie wciąż zasypują wyłomy gruzem i ziemią.' },
      { label: '✜ OBLĘŻENIE',     sub: 'odciąć twierdzę od zaopatrzenia',      result: 'Wojsko otacza Psków ciasnym pierścieniem. W mieście kończy się żywność, a mróz daje się obrońcom we znaki.' },
      { label: '✋ ROZEJM',        sub: 'układy pokojowe z carem',             result: 'Wyczerpana długą wojną Moskwa siada do rozmów. Car godzi się oddać Inflanty Rzeczypospolitej!' },
    ],
    paConfig: {
      maxEnemy: 1581, maxPlayer: 1581, outcome: 'win',
      enemyLines: [
        'Obrońcy Pskowa stawiają zacięty opór! Ze ścian sypią się strzały i kamienie — wielu polskich żołnierzy pada.',
        'Mróz i głód dręczą polski obóz. Z baszt Pskowa grzmią rosyjskie działa, lecz mury wciąż się chwieją.',
        'Rosjanie ślą wyprawy, by zniszczyć polskie armaty. Walka trwa, ale Moskwa traci siły.',
        'Twierdza wytrzymuje szturmy — ale długa wojna wyniszczyła Carstwo i car musi pertraktować.'
      ],
      win: { t: 'ROZEJM!', s: 'Wyczerpana Moskwa oddaje Inflanty. Batory osiąga cel wojny. Rozejm w Jamie Zapolskim, 1582.' },
      loss: { t: '', s: '' }
    },
    spec: {
      horizonY: 108,
      sky: [[0,'#8ea4bd'],[0.45,'#b6c6d6'],[0.8,'#d4dee6'],[1,'#e8eef2']],
      sun: { x:64, y:42, r:11, color:'#f6e7ca', glow:'#e6dcc6' },
      cloudBand: 44,
      layers: [
        { baseY:103, amp:5, freq:0.05, seed:31, color:'#5f7079', type:'forest', lightTop:'#d9e6ec' },
        { baseY:108, amp:8, freq:0.03, seed:33, color:'#7d8d95', lightTop:'#e6eef3' }
      ],
      ground: { near:'#e6ecf0', far:'#c6d2da', path:'#aebcc6', rows:'#9fb0bb' },
      fields: [],
      platforms: [
        { x:236, y:101, rx:36, ry:7, color:'#e2eaf0', shadow:'#9fb2bd' },
        { x:100, y:137, rx:54, ry:12, color:'#dbe5ec', shadow:'#9aaeba' }
      ],
      ambiance: { type:'snow', count:80, color:'#ffffff', seed:7, clouds:4, cloudColor:'#e8edf2', cloudShade:'#c4cfd9' },
      staticDraw: function (ctx, PA) {
        var fy = 102, cx = 162;
        ctx.fillStyle = '#ece9df'; ctx.fillRect(cx-68, fy-14, 150, 14);
        ctx.fillStyle = '#d6d2c4'; ctx.fillRect(cx-68, fy-2, 150, 2);
        ctx.fillStyle = '#ece9df'; for (var c = cx-68; c < cx+82; c += 6) ctx.fillRect(c, fy-17, 3, 3);
        ctx.fillStyle = '#5a6b73'; for (var w = cx-60; w < cx+78; w += 13) ctx.fillRect(w, fy-9, 2, 3);
        function tower(tx, h) {
          ctx.fillStyle = '#f2efe5'; ctx.fillRect(tx-5, fy-h, 11, h);
          ctx.fillStyle = '#d8d3c4'; ctx.fillRect(tx+3, fy-h, 3, h);
          ctx.fillStyle = '#3c6b4e'; for (var r = 0; r < 11; r++) ctx.fillRect(tx-5+r, fy-h-1-r, 11-r*2, 1);
          ctx.fillStyle = '#4e8060'; ctx.fillRect(tx-1, fy-h-7, 2, 5);
          ctx.fillStyle = '#d8b24a'; ctx.fillRect(tx, fy-h-12, 1, 4);
          ctx.fillStyle = '#5a6b73'; ctx.fillRect(tx-1, fy-h+5, 2, 4);
        }
        tower(cx-56, 26); tower(cx+4, 32); tower(cx+70, 24);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(cx-68, fy-18, 150, 1);
        ctx.fillStyle = '#6b5a3e'; ctx.fillRect(cx-2, fy-8, 6, 8); ctx.fillStyle = '#3a3024'; ctx.fillRect(cx, fy-7, 2, 7);
        for (var y = fy+7; y < fy+22; y++) { ctx.fillStyle = PA.mix('#c7d8e2','#9db6c5',(y-fy-7)/15); ctx.fillRect(0, y, 320, 1); }
        ctx.fillStyle = '#8fa8b6'; for (var i = 0; i < 12; i++) { var ix = (i*31+7)%320; ctx.fillRect(ix, fy+10+(i%3)*4, 16+(i%4)*6, 1); }
        ctx.fillStyle = '#eef4f8'; for (var j = 0; j < 10; j++) { var jx = (j*41+15)%320; ctx.fillRect(jx, fy+9+(j%3)*4, 8, 1); }
        ctx.fillStyle = '#6b7a55'; PA.circle(ctx, 16, 184, 8); PA.circle(ctx, 306, 188, 9);
        ctx.fillStyle = '#dfe9ee'; PA.circle(ctx, 16, 180, 6); PA.circle(ctx, 306, 184, 6);
      },
      dynamicDraw: function (ctx, t, PA) {
        for (var i = 0; i < 3; i++) {
          var sx = 120+i*36+Math.sin(t*0.6+i)*3, sy = 78-((t*6+i*16)%38);
          ctx.globalAlpha = 0.16; ctx.fillStyle = '#d2d9dd';
          ctx.fillRect(sx, sy, 5, 5); ctx.fillRect(sx+2, sy-4, 4, 4);
        }
        ctx.globalAlpha = 1;
        function flag(bx, by, ph, cloth, mark) {
          ctx.fillStyle = '#3a2a18'; ctx.fillRect(bx, by-30, 2, 34);
          ctx.fillStyle = '#caa24a'; ctx.fillRect(bx-1, by-32, 4, 2);
          for (var k = 0; k < 13; k++) {
            var sway = Math.round(Math.sin(t*3+k*0.55+ph)*2.2);
            ctx.fillStyle = cloth; ctx.fillRect(bx+2+sway, by-30+k, 16, 1);
            if (mark && k>3 && k<9) { ctx.fillStyle = mark; ctx.fillRect(bx+7+sway, by-30+k, 4, 1); }
          }
        }
        flag(36, 150, 0, '#b5302c', '#efe6cf');
        flag(300, 150, 1.4, '#7a1f24', '#e6c84a');
      }
    }
  };

  // ── KŁUSZYN 1610 ──────────────────────────────────────────────────
  BATTLES.kluszynk = {
    bg: '#0d0a08', stageBg: '#2a2440',
    bannerColor: '#f3e2a8',
    enemy: {
      name: 'DYMITR SZUJSKI',
      sub: 'Wódz wojsk Moskwy i najemników · Lv.27',
      portrait: 'bitwy/art/m04_bojar.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#b6bcc8,#6f7686 68%,#434a5a)',
      ringColor: '#8a5a2e',
      nameplateStyle: 'background:linear-gradient(180deg,#f1e7cd,#e2d3b0);border:3px solid #2c2012;box-shadow:inset 0 0 0 2px #c8ab68,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#2a1d10', subColor: '#6f5d3b', hpColor: '#7a3128',
      hpBarBg: '#1d160b', hpBarBorder: '#0c0a06', hpBarInset: '#4a3a1f',
      hpTextColor: '#6f5d3b', maxHp: 1610,
    },
    player: {
      name: 'STANISŁAW ŻÓŁKIEWSKI',
      sub: 'Hetman koronny · dowódca husarii · Lv.32',
      portrait: 'bitwy/art/m04_zolkiewski.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#f3e4b8,#d8b86e 68%,#a07f3e)',
      ringColor: '#d8b24a',
      nameplateStyle: 'background:linear-gradient(180deg,#1b2a4d,#0f1830);border:2px solid #cf9f3f;box-shadow:inset 0 0 0 2px #2d4170,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#edc659', subColor: '#aebbd6', hpColor: '#cf9f3f',
      hpBarBg: '#0a1120', hpBarBorder: '#000', hpBarInset: '#2d4170',
      hpTextColor: '#aebbd6', maxHp: 1610,
    },
    dialogue: 'Świt 4 lipca 1610 pod Kłuszynem. Garstka husarii staje naprzeciw ogromnej armii Moskwy i obcych najemników. Jak uderzy hetman Żółkiewski?',
    buttons: [
      { label: '⚔ SZARŻA HUSARII',  sub: 'skrzydlata jazda atakuje z kopiami', result: 'Skrzydlata jazda rusza z kopiami naprzód! Husaria rozbija pierwsze szeregi wroga, a szum skrzydeł sieje popłoch.' },
      { label: '↻ PONOWNA SZARŻA',  sub: 'uderzać falami, raz za razem',        result: 'Husaria zawraca i uderza raz po raz — osiem, dziesięć szarż! Wróg nie wytrzymuje fali za falą jazdy.' },
      { label: '⚑ ATAK NA NAJEMNIKÓW', sub: 'rozbić obcy zaciąg wroga',         result: 'Polacy wbijają się między obcych najemników a Moskwę. Cudzoziemski zaciąg łamie szyk i przechodzi na stronę zwycięzcy.' },
      { label: '✸ PRZEŁAMANIE',      sub: 'rozbić ostatecznie szyk wroga',       result: 'Szyk Moskwy pęka i rzuca się do ucieczki. Garstka husarii Żółkiewskiego pokonuje wielokrotnie liczniejszą armię!' },
    ],
    paConfig: {
      maxEnemy: 1610, maxPlayer: 1610, outcome: 'win',
      enemyLines: [
        'Moskwa i obcy najemnicy odpierają pierwsze uderzenie! Ogień z rusznic dziesiątkuje husarię — giną towarzysze i konie.',
        'Wróg zwiera szyki za płotami. Husaria łamie kopie i sięga po szable — bój robi się krwawy i zacięty.',
        'Najemna jazda kontratakuje skrzydło Żółkiewskiego. Hetman z trudem utrzymuje swoje nieliczne chorągwie.',
        'Przewaga liczebna Moskwy topnieje pod kolejnymi szarżami — szyk wroga zaczyna pękać.'
      ],
      win: { t: 'ZWYCIĘSTWO!', s: 'Po krwawym boju husaria Żółkiewskiego rozbija wielokrotnie liczniejszą armię Moskwy. Triumf pod Kłuszynem, 4 lipca 1610.' },
      loss: { t: '', s: '' }
    },
    spec: {
      horizonY: 106,
      sky: [[0,'#4a5f9a'],[0.34,'#b07f74'],[0.58,'#edc488'],[0.82,'#f6dca0'],[1,'#f7e8c4']],
      sun: { x:196, y:80, r:15, color:'#ffe7a2', glow:'#ffcf78' },
      cloudBand: 26,
      layers: [
        { baseY:102, amp:4, freq:0.05, seed:41, color:'#46603f', type:'forest', lightTop:'#6f8a52' },
        { baseY:107, amp:7, freq:0.03, seed:43, color:'#577345', lightTop:'#86a060' }
      ],
      ground: { near:'#789a48', far:'#a7b86a', path:'#cabb82', rows:'#5f7d3c' },
      fields: [{ x:60, y:150, rx:42, ry:8, color:'#d4c06a', a:0.85 },{ x:262, y:152, rx:44, ry:8, color:'#d4c06a', a:0.85 }],
      platforms: [
        { x:236, y:101, rx:36, ry:7, color:'#b8a85d', shadow:'#5a6a3c' },
        { x:100, y:137, rx:54, ry:12, color:'#aebd6f', shadow:'#4d6036' }
      ],
      ambiance: { type:'mist', count:16, color:'#fff2da', seed:9, clouds:3, cloudColor:'#f6e2c4', cloudShade:'#e0c39c' },
      staticDraw: function (ctx, PA) {
        [[150,96],[164,98],[178,95],[192,98]].forEach(function (p) {
          ctx.fillStyle = '#d8cbac'; for (var i = 0; i < 6; i++) ctx.fillRect(p[0]-i, p[1]-6+i, i*2+1, 1);
          ctx.fillStyle = '#7a5230'; ctx.fillRect(p[0], p[1]-5, 1, 2);
        });
        function birch(x, base, h, lean) {
          for (var y = 0; y < h; y++) {
            var tx = x+Math.round(lean*y/h);
            ctx.fillStyle = '#eef0ea'; ctx.fillRect(tx, base-y, 3, 1);
            ctx.fillStyle = '#cdd2cc'; ctx.fillRect(tx+2, base-y, 1, 1);
          }
          ctx.fillStyle = '#23201c';
          for (var d = 0; d < h; d += 5) { var dx = x+Math.round(lean*(h-d)/h); ctx.fillRect(dx+(d%2), base-d, 2, 1); }
          var bx = x+Math.round(lean), by = base-h;
          ctx.fillStyle = '#5f8348'; PA.circle(ctx, bx, by, 7); PA.circle(ctx, bx-5, by+3, 5);
          ctx.fillStyle = '#7aa05c'; PA.circle(ctx, bx+2, by-2, 5);
        }
        birch(20, 196, 56, 2); birch(40, 200, 40, -2);
        birch(298, 200, 50, -2); birch(282, 194, 36, 2);
        ctx.fillStyle = '#5f8a3c'; for (var g = 0; g < 26; g++) { var gx = (g*13+5)%320; ctx.fillRect(gx, 192+(g%4)*3, 1, 4); }
      },
      dynamicDraw: function (ctx, t, PA) {
        ctx.globalAlpha = 0.06; ctx.fillStyle = '#fff0c0';
        for (var r = 0; r < 5; r++) { var rx = 196+Math.sin(t*0.2+r)*3; ctx.fillRect(rx-r*14, 80, 2, 80); ctx.fillRect(rx+r*14, 80, 2, 80); }
        ctx.globalAlpha = 1;
        function flag(bx, by, ph, cloth, mark) {
          ctx.fillStyle = '#3a2a18'; ctx.fillRect(bx, by-30, 2, 34);
          ctx.fillStyle = '#caa24a'; ctx.fillRect(bx-1, by-32, 4, 2);
          for (var k = 0; k < 13; k++) {
            var sway = Math.round(Math.sin(t*3+k*0.55+ph)*2.2);
            ctx.fillStyle = cloth; ctx.fillRect(bx+2+sway, by-30+k, 16, 1);
            if (mark && k>3 && k<9) { ctx.fillStyle = mark; ctx.fillRect(bx+7+sway, by-30+k, 4, 1); }
          }
        }
        flag(58, 150, 0, '#b5302c', '#efe6cf');
        flag(284, 150, 1.4, '#7a1f24', '#e6c84a');
      }
    }
  };

  // ── ZIELEŃCE 1792 ─────────────────────────────────────────────────
  BATTLES.zielence = {
    bg: '#080a06', stageBg: '#3a5a7a',
    bannerColor: '#f3e2a8',
    enemy: {
      name: 'GEN. KACHOWSKI',
      sub: 'Dowódca armii rosyjskiej · Lv.29',
      portrait: 'bitwy/art/m05_repnin.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#a9c2a4,#5f8a5a 68%,#355a35)',
      ringColor: '#8a5a2e',
      nameplateStyle: 'background:linear-gradient(180deg,#f1e7cd,#e2d3b0);border:3px solid #2c2012;box-shadow:inset 0 0 0 2px #c8ab68,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#2a1d10', subColor: '#6f5d3b', hpColor: '#7a3128',
      hpBarBg: '#1d160b', hpBarBorder: '#0c0a06', hpBarInset: '#4a3a1f',
      hpTextColor: '#6f5d3b', maxHp: 1792,
    },
    player: {
      name: 'KS. JÓZEF PONIATOWSKI',
      sub: 'Wódz wojsk Rzeczypospolitej · Lv.30',
      portrait: 'bitwy/art/m05_poniatowski.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#f3e4b8,#d8b86e 68%,#a07f3e)',
      ringColor: '#d8b24a',
      nameplateStyle: 'background:linear-gradient(180deg,#1b2a4d,#0f1830);border:2px solid #cf9f3f;box-shadow:inset 0 0 0 2px #2d4170,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#edc659', subColor: '#aebbd6', hpColor: '#cf9f3f',
      hpBarBg: '#0a1120', hpBarBorder: '#000', hpBarInset: '#2d4170',
      hpTextColor: '#aebbd6', maxHp: 1792,
    },
    dialogue: '18 czerwca 1792. Na zielonych wzgórzach Podola wojsko polskie zasłania odwrót po wkroczeniu Rosji. Jak poprowadzi obronę książę Józef?',
    buttons: [
      { label: '⚔ ATAK JAZDY',       sub: 'kawaleria szarżuje w dół wzgórza',   result: 'Polska jazda zjeżdża ze wzgórza i tnie szeregi Rosjan. Pierwszy impet odrzuca napastników w dolinę.' },
      { label: '◎ OGIEŃ ARTYLERII',  sub: 'działa biją z wzniesień',             result: 'Działa książęce grają ze wzniesień! Kule sieją zamęt w rosyjskich kolumnach pnących się pod górę.' },
      { label: '⛰ OBRONA WZGÓRZA',  sub: 'utrzymać wzniesienie za wszelką cenę', result: 'Piechota trzyma grzbiet wzgórza pod gradem kul. Rosjanie raz po raz cofają się ze stoku.' },
      { label: '✸ KONTRATAK',        sub: 'rzucić odwody i odeprzeć Rosjan',     result: 'Książę Józef rzuca odwody do kontrataku. Rosjanie odparci! Wojsko osłania odwrót.' },
    ],
    paConfig: {
      maxEnemy: 1792, maxPlayer: 1792, outcome: 'win',
      enemyLines: [
        'Rosjanie nacierają całą siłą! Kolumny piechoty wdzierają się na stok, a ich działa odpowiadają ogniem — szeregi polskie krwawią.',
        'Wróg obchodzi skrzydło i naciera ponownie. Wokół księcia Józefa wre zacięty bój o każdy grzbiet wzgórza.',
        'Rosyjska jazda wpada na polskie baterie. Walka jest wyrównana i krwawa, lecz Polacy nie ustępują pola.',
        'Po godzinach boju napór Rosjan słabnie — pora na decydujące uderzenie.'
      ],
      win: { t: 'ZWYCIĘSTWO!', s: 'Książę Józef odpiera Rosjan i osłania odwrót armii. Za to zwycięstwo ustanowiono order Virtuti Militari. Zieleńce, 18 czerwca 1792.' },
      loss: { t: '', s: '' }
    },
    spec: {
      horizonY: 116,
      sky: [[0,'#4a8fcf'],[0.45,'#84b6e0'],[0.8,'#b8d8ea'],[1,'#dcecef']],
      sun: { x:160, y:30, r:11, color:'#fff6c8', glow:'#ffe89c' },
      cloudBand: 40,
      layers: [
        { baseY:104, amp:10, freq:0.024, seed:51, color:'#5f9050', lightTop:'#7fae66' },
        { baseY:112, amp:14, freq:0.017, seed:53, color:'#6f9e54', lightTop:'#94ba6c' }
      ],
      ground: { near:'#75a64a', far:'#a6c474', path:'#c4bd84', rows:'#5f8a3a' },
      fields: [{ x:56, y:158, rx:38, ry:7, color:'#d6c46c', a:0.7 },{ x:270, y:160, rx:40, ry:7, color:'#cf6f6a', a:0.5 }],
      platforms: [
        { x:236, y:109, rx:36, ry:7, color:'#bcc472', shadow:'#5f7a40' },
        { x:100, y:145, rx:54, ry:12, color:'#aec870', shadow:'#4d6036' }
      ],
      ambiance: { type:'embers', count:14, color:'#eef0bc', seed:5, clouds:6, cloudColor:'#ffffff', cloudShade:'#cfe0ea' },
      staticDraw: function (ctx, PA) {
        var vx = 150, vy = 108;
        ctx.fillStyle = '#e6dcc6'; ctx.fillRect(vx-4, vy-12, 8, 12);
        ctx.fillStyle = '#b6442f'; for (var r = 0; r < 6; r++) ctx.fillRect(vx-4+r, vy-12-r, 8-r*2, 1);
        ctx.fillStyle = '#caa24a'; ctx.fillRect(vx-1, vy-20, 2, 3);
        [[vx-16,vy],[vx+14,vy+1]].forEach(function (c) {
          ctx.fillStyle = '#dcd0b4'; ctx.fillRect(c[0]-4, c[1]-5, 9, 5);
          ctx.fillStyle = '#8a5a36'; for (var r2 = 0; r2 < 4; r2++) ctx.fillRect(c[0]-4+r2, c[1]-5-r2, 9-r2*2, 1);
        });
        function bush(x, y, s) { ctx.fillStyle = '#3f6b39'; PA.circle(ctx,x,y,s); ctx.fillStyle = '#5b8f4d'; PA.circle(ctx,x-1,y-1,s-2); ctx.fillStyle = '#4a3220'; ctx.fillRect(x-1,y+s-2,2,4); }
        bush(70,124,6); bush(214,120,5); bush(286,132,7); bush(40,150,6);
        ctx.fillStyle = '#5f8a3c'; for (var g = 0; g < 28; g++) { var gx = (g*12+4)%320; ctx.fillRect(gx, 196+(g%4)*3, 1, 4); }
      },
      dynamicDraw: function (ctx, t, PA) {
        function flag(bx, by, ph, cloth, mark) {
          ctx.fillStyle = '#3a2a18'; ctx.fillRect(bx, by-30, 2, 34);
          ctx.fillStyle = '#caa24a'; ctx.fillRect(bx-1, by-32, 4, 2);
          for (var k = 0; k < 13; k++) {
            var sway = Math.round(Math.sin(t*3+k*0.55+ph)*2.2);
            ctx.fillStyle = cloth; ctx.fillRect(bx+2+sway, by-30+k, 16, 1);
            if (mark && k>3 && k<9) { ctx.fillStyle = mark; ctx.fillRect(bx+7+sway, by-30+k, 4, 1); }
          }
        }
        flag(40, 156, 0, '#b5302c', '#efe6cf');
        flag(300, 158, 1.4, '#1b3b73', '#e6c84a');
      }
    }
  };

  // ── RACŁAWICE 1794 ────────────────────────────────────────────────
  BATTLES.raclawice = {
    bg: '#080a06', stageBg: '#3a5a7a',
    bannerColor: '#f3e2a8',
    enemy: {
      name: 'GEN. TORMASOW',
      sub: 'Dowódca wojsk rosyjskich · Lv.28',
      portrait: 'bitwy/art/m05_repnin.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#a9c2a4,#5f8a5a 68%,#355a35)',
      ringColor: '#8a5a2e',
      nameplateStyle: 'background:linear-gradient(180deg,#f1e7cd,#e2d3b0);border:3px solid #2c2012;box-shadow:inset 0 0 0 2px #c8ab68,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#2a1d10', subColor: '#6f5d3b', hpColor: '#7a3128',
      hpBarBg: '#1d160b', hpBarBorder: '#0c0a06', hpBarInset: '#4a3a1f',
      hpTextColor: '#6f5d3b', maxHp: 1794,
    },
    player: {
      name: 'TADEUSZ KOŚCIUSZKO',
      sub: 'Naczelnik powstania · z kosynierami · Lv.31',
      portrait: 'bitwy/art/m05_kosciuszko.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#f3e4b8,#d8b86e 68%,#a07f3e)',
      ringColor: '#d8b24a',
      nameplateStyle: 'background:linear-gradient(180deg,#1b2a4d,#0f1830);border:2px solid #cf9f3f;box-shadow:inset 0 0 0 2px #2d4170,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#edc659', subColor: '#aebbd6', hpColor: '#cf9f3f',
      hpBarBg: '#0a1120', hpBarBorder: '#000', hpBarInset: '#2d4170',
      hpTextColor: '#aebbd6', maxHp: 1794,
    },
    dialogue: '4 kwietnia 1794 pod Racławicami. Przy wiejskim wiatraku Kościuszko staje na czele wojska i chłopów z kosami. Jak poprowadzi bitwę Naczelnik?',
    buttons: [
      { label: '⚔ SZARŻA KOSYNIERÓW', sub: 'chłopi z kosami atakują z rozpędu', result: 'Chłopi z kosami rzucają się naprzód z okrzykiem! Kosynierzy wpadają na rosyjskie szeregi szybciej, niż padną strzały.' },
      { label: '◎ ZDOBYĆ DZIAŁA',      sub: 'rzut na rosyjskie armaty',           result: 'Bartosz Głowacki dopada armaty i czapką gasi lont! Zdobyte rosyjskie działa milkną — to przełom bitwy.' },
      { label: '⚑ ATAK Z FLANKI',      sub: 'uderzyć wroga z boku',               result: 'Regularne wojsko obchodzi wroga i uderza z boku. Rosjanie, zaskoczeni z dwóch stron, tracą szyk.' },
      { label: '✸ NACIERAĆ',           sub: 'zepchnąć Rosjan z pola bitwy',        result: 'Kosynierzy i wojsko spychają Rosjan z pola! Tormasow rejteruje — zwycięstwo, które rozpaliło nadzieję.' },
    ],
    paConfig: {
      maxEnemy: 1794, maxPlayer: 1794, outcome: 'win',
      enemyLines: [
        'Rosjanie witają atak salwą z muszkietów i armat! Pierwsi kosynierzy padają, lecz reszta biegnie dalej przez dym.',
        'Wróg formuje czworobok i razi ogniem. Bój o wiatrak jest zażarty — ranni leżą po obu stronach.',
        'Rosyjska piechota próbuje kontry. Kościuszko sam prowadzi ludzi naprzód, byle nie stracić rozpędu.',
        'Po krwawym starciu opór Rosjan słabnie — chłopi i wojsko spychają ich z pola.'
      ],
      win: { t: 'ZWYCIĘSTWO!', s: 'Kosynierzy zdobywają armaty, a Kościuszko zwycięża pod Racławicami. 4 kwietnia 1794 — iskra nadziei dla całego powstania.' },
      loss: { t: '', s: '' }
    },
    spec: (function () {
      var WX = 156, WGY = 100;
      return {
        horizonY: 110,
        sky: [[0,'#5e9bd0'],[0.45,'#9fc6e4'],[0.8,'#cae0ec'],[1,'#e4eef0']],
        sun: { x:70, y:32, r:11, color:'#fff6d2', glow:'#ffeeb0' },
        cloudBand: 42,
        layers: [
          { baseY:104, amp:6, freq:0.04, seed:61, color:'#5d8048', type:'forest', lightTop:'#7c9c5c' },
          { baseY:109, amp:9, freq:0.028, seed:63, color:'#6f9150', lightTop:'#92b067' }
        ],
        ground: { near:'#789a48', far:'#a6bd6e', path:'#bca878', rows:'#7a5a34' },
        fields: [{ x:58, y:156, rx:40, ry:8, color:'#8a6a40', a:0.55 },{ x:268, y:158, rx:42, ry:8, color:'#8a6a40', a:0.5 }],
        platforms: [
          { x:236, y:103, rx:36, ry:7, color:'#aeb867', shadow:'#5a6a3c' },
          { x:100, y:143, rx:54, ry:12, color:'#a6bd66', shadow:'#4d6036' }
        ],
        ambiance: { type:'none', count:0, seed:5, clouds:5, cloudColor:'#ffffff', cloudShade:'#cfe0ea' },
        staticDraw: function (ctx, PA) {
          PA.oval(ctx, WX, WGY+2, 22, 5, '#5f7a40', 0.7);
          var topW = 9, botW = 15, h = 24;
          for (var y = 0; y < h; y++) {
            var ww = Math.round(botW-(botW-topW)*y/h);
            ctx.fillStyle = PA.mix('#8a5f36','#6e4a28',y/h); ctx.fillRect(WX-(ww>>1), WGY-y, ww, 1);
            ctx.fillStyle = '#a8784a'; ctx.fillRect(WX-(ww>>1), WGY-y, 1, 1);
          }
          ctx.fillStyle = '#5a3c22'; for (var p = 2; p < h; p += 4) ctx.fillRect(WX-6, WGY-p, 12, 1);
          ctx.fillStyle = '#3a281a'; ctx.fillRect(WX-2, WGY-7, 4, 7);
          ctx.fillStyle = '#cdbf8a'; ctx.fillRect(WX-4, WGY-16, 3, 3);
          ctx.fillStyle = '#4a3220'; for (var r2 = 0; r2 < 6; r2++) ctx.fillRect(WX-6+r2, WGY-h-r2, 12-r2*2, 1);
          [[WX-30,WGY+4],[WX+28,WGY+6],[WX+46,WGY+3]].forEach(function (c) {
            ctx.fillStyle = '#e0d4b6'; ctx.fillRect(c[0]-5, c[1]-6, 11, 6);
            ctx.fillStyle = '#8a5a36'; for (var r3 = 0; r3 < 5; r3++) ctx.fillRect(c[0]-5+r3, c[1]-6-r3, 11-r3*2, 1);
            ctx.fillStyle = '#3a281a'; ctx.fillRect(c[0]-1, c[1]-4, 2, 4);
          });
          function bush(x, y, s) { ctx.fillStyle = '#4a3220'; ctx.fillRect(x-1,y-2,2,5); ctx.fillStyle = '#6f9a4e'; PA.circle(ctx,x,y-5,s); ctx.fillStyle = '#88b365'; PA.circle(ctx,x-1,y-6,s-2); }
          bush(150,120,6); bush(60,132,6); bush(286,130,7);
          ctx.fillStyle = '#6a4a2a'; for (var f = 0; f < 8; f++) ctx.fillRect(8+f*2, 178+f*4, 70-f*4, 1);
          ctx.fillStyle = '#5f8a3c'; for (var g = 0; g < 22; g++) { var gx = (g*15+6)%320; ctx.fillRect(gx, 192+(g%3)*3, 1, 4); }
        },
        dynamicDraw: function (ctx, t, PA) {
          var hubX = WX, hubY = WGY-22, ang = t*1.1;
          for (var k = 0; k < 4; k++) {
            var a = ang+k*Math.PI/2, ca = Math.cos(a), sa = Math.sin(a), px = Math.cos(a+Math.PI/2), py = Math.sin(a+Math.PI/2);
            for (var rr = 3; rr < 17; rr++) {
              var x = hubX+ca*rr, y = hubY+sa*rr;
              ctx.fillStyle = '#3a281a'; ctx.fillRect(Math.round(x), Math.round(y), 2, 1);
              if (rr%3===1) { ctx.fillStyle = '#e6dcbe'; for (var s = 1; s <= 4; s++) ctx.fillRect(Math.round(x+px*s), Math.round(y+py*s), 1, 1); }
            }
          }
          ctx.fillStyle = '#2a1c10'; ctx.fillRect(hubX-1, hubY-1, 3, 3);
          function flag(bx, by, ph, cloth, mark) {
            ctx.fillStyle = '#3a2a18'; ctx.fillRect(bx, by-30, 2, 34);
            ctx.fillStyle = '#caa24a'; ctx.fillRect(bx-1, by-32, 4, 2);
            for (var ki = 0; ki < 13; ki++) {
              var sway = Math.round(Math.sin(t*3+ki*0.55+ph)*2.2);
              ctx.fillStyle = cloth; ctx.fillRect(bx+2+sway, by-30+ki, 16, 1);
              if (mark && ki>3 && ki<9) { ctx.fillStyle = mark; ctx.fillRect(bx+7+sway, by-30+ki, 4, 1); }
            }
          }
          flag(40, 154, 0, '#b5302c', '#efe6cf');
          flag(300, 156, 1.4, '#7a1f24', '#e6c84a');
        }
      };
    })()
  };

  // ── MACIEJOWICE 1794 ──────────────────────────────────────────────
  BATTLES.maciejowice = {
    bg: '#06070a', stageBg: '#3a4048',
    bannerColor: '#e7c0b4',
    enemy: {
      name: 'CARYCA KATARZYNA II',
      sub: 'Cesarstwo Rosyjskie · gen. Fersen · Lv.34',
      portrait: 'bitwy/art/m05_katarzyna.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#c2a6cc,#7a5a8e 66%,#463056)',
      ringColor: '#8a6a3a',
      nameplateStyle: 'background:linear-gradient(180deg,#e7dcc6,#d4c4a4);border:3px solid #2c2012;box-shadow:inset 0 0 0 2px #b89a5a,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#2a1d10', subColor: '#6f5d3b', hpColor: '#7a3128',
      hpBarBg: '#1d160b', hpBarBorder: '#0c0a06', hpBarInset: '#4a3a1f',
      hpTextColor: '#6f5d3b', maxHp: 1794,
    },
    player: {
      name: 'TADEUSZ KOŚCIUSZKO',
      sub: 'Naczelnik powstania · ostatnia bitwa · Lv.31',
      portrait: 'bitwy/art/m05_kosciuszko.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#e6d6ac,#c2a25e 68%,#8a6a34)',
      ringColor: '#c2a24a',
      nameplateStyle: 'background:linear-gradient(180deg,#28303f,#161c28);border:2px solid #b89a4a;box-shadow:inset 0 0 0 2px #3a4660,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#e6c659', subColor: '#a6b0c2', hpColor: '#b89a4a',
      hpBarBg: '#0a1018', hpBarBorder: '#000', hpBarInset: '#3a4660',
      hpTextColor: '#a6b0c2', maxHp: 1794,
    },
    dialogue: '10 października 1794 pod Maciejowicami. W deszczu nad Wisłą garść powstańców czeka na posiłki, otoczona przez Rosjan. Co rozkaże Naczelnik?',
    buttons: [
      { label: '⌛ CZEKAĆ NA POSIŁKI', sub: 'liczyć na korpus Ponińskiego',    result: 'Posiłki gen. Ponińskiego nie nadchodzą — utknęły gdzieś w deszczu. Powstańcy zostają sami przeciw przewadze wroga.' },
      { label: '⛰ OBRONA POZYCJI',     sub: 'utrzymać linię pod ostrzałem',    result: 'Powstańcy okopują się na wzgórzu. Rosyjskie działa rozbijają pozycje jedna po drugiej — szeregi topnieją w ogniu.' },
      { label: '⚔ KONTRATAK',          sub: 'rozpaczliwa szarża Naczelnika',   result: 'Kościuszko sam prowadzi rozpaczliwą szarżę! Lecz Rosjan jest zbyt wielu — pierścień zaciska się wokół powstańców.' },
      { label: '↩ PRÓBA ODWROTU',      sub: 'wycofać się nad rzekę',           result: 'Próba odwrotu nad Wisłę grzęźnie w błocie i deszczu. Ranny Kościuszko spada z konia i dostaje się do niewoli.' },
    ],
    paConfig: {
      maxEnemy: 1794, maxPlayer: 1794, outcome: 'loss',
      enemyLines: [
        'Rosjanie ruszają do ataku przez deszcz! Ich kolumny są coraz liczniejsze, a oczekiwane posiłki wciąż nie nadchodzą.',
        'Działa Fersena sieją spustoszenie w polskich okopach. Powstańcy padają, lecz wciąż trzymają wzgórze.',
        'Wróg przełamuje skrzydło i wdziera się do polskich pozycji. Pierścień wokół Naczelnika zaciska się.',
        'Otoczeni i bez posiłków powstańcy są spychani nad rozmokłą Wisłę — opór dogasa.'
      ],
      win: { t: '', s: '' },
      loss: { t: 'KLĘSKA', s: 'Bez posiłków, w deszczu i błocie, ranny Kościuszko spada z konia i dostaje się do niewoli. Powstanie chyli się ku upadkowi. Maciejowice, 10 października 1794.' }
    },
    spec: {
      horizonY: 112,
      sky: [[0,'#525b67'],[0.5,'#79828e'],[0.82,'#9aa2ac'],[1,'#b2b8c0']],
      cloudBand: 56,
      layers: [
        { baseY:106, amp:5, freq:0.045, seed:71, color:'#534b3a', type:'forest', lightTop:'#6e6448' },
        { baseY:111, amp:8, freq:0.03, seed:73, color:'#665b40', lightTop:'#867950' }
      ],
      ground: { near:'#5f5638', far:'#7e765a', path:'#574e36', rows:'#463e2a' },
      fields: [{ x:60, y:158, rx:38, ry:7, color:'#7a6c44', a:0.4 },{ x:268, y:160, rx:40, ry:7, color:'#7a6c44', a:0.4 }],
      platforms: [
        { x:236, y:105, rx:36, ry:7, color:'#766a48', shadow:'#3e3826' },
        { x:100, y:145, rx:54, ry:12, color:'#6e6444', shadow:'#3a3422' }
      ],
      shimmer: { y:120, color:'#9aa6b0' },
      ambiance: { type:'rain', count:100, color:'rgba(196,208,220,0.5)', seed:11, clouds:6, cloudColor:'#878f99', cloudShade:'#6c747e' },
      staticDraw: function (ctx, PA) {
        for (var y = 113; y < 132; y++) {
          ctx.fillStyle = PA.mix('#8b97a3','#6f7c88',(y-113)/19);
          ctx.fillRect(0, y, 320, 1);
        }
        ctx.fillStyle = '#5b5640'; ctx.fillRect(0, 112, 320, 1);
        var vx = 158, vy = 112;
        ctx.fillStyle = '#5a5648'; ctx.fillRect(vx-3, vy-11, 6, 11);
        for (var r = 0; r < 5; r++) ctx.fillRect(vx-3+r, vy-11-r, 6-r*2, 1);
        ctx.fillRect(vx-1, vy-17, 2, 3);
        [[vx-14,vy],[vx+13,vy]].forEach(function (c) { ctx.fillStyle = '#544f40'; ctx.fillRect(c[0]-4,c[1]-4,8,4); for (var r2 = 0; r2 < 3; r2++) ctx.fillRect(c[0]-4+r2,c[1]-4-r2,8-r2*2,1); });
        function deadTree(x, base, h) {
          ctx.fillStyle = '#352a1e'; ctx.fillRect(x, base-h, 2, h);
          ctx.fillStyle = '#3f3322';
          ctx.fillRect(x-4, base-h+2, 4, 1); ctx.fillRect(x-6, base-h, 3, 1);
          ctx.fillRect(x+2, base-h+4, 5, 1); ctx.fillRect(x+5, base-h+1, 3, 1);
          ctx.fillRect(x-3, base-h+7, 3, 1); ctx.fillRect(x+2, base-h+9, 4, 1);
        }
        deadTree(22,196,40); deadTree(40,200,30); deadTree(300,198,44); deadTree(284,194,28);
        ctx.globalAlpha = 0.5; ctx.fillStyle = '#7e868f';
        PA.oval(ctx,90,188,16,3,'#7e868f',0.5); PA.oval(ctx,250,192,18,3,'#7e868f',0.5);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#4e4a30'; for (var g = 0; g < 24; g++) { var gx = (g*14+5)%320; ctx.fillRect(gx, 194+(g%3)*3, 1, 4); }
      },
      dynamicDraw: function (ctx, t, PA) {
        var fl = Math.max(0, Math.sin(t*0.5)-0.985)*60;
        if (fl > 0) { ctx.globalAlpha = Math.min(0.5,fl); ctx.fillStyle = '#dfe6ee'; ctx.fillRect(0,0,320,112); ctx.globalAlpha = 1; }
        function flag(bx, by, ph, cloth, mark) {
          ctx.fillStyle = '#2c2114'; ctx.fillRect(bx, by-28, 2, 32);
          ctx.fillStyle = '#7a6638'; ctx.fillRect(bx-1, by-30, 4, 2);
          for (var k = 0; k < 12; k++) {
            var sway = Math.round(Math.sin(t*1.4+k*0.5+ph)*1.1)+Math.round(k*0.5);
            ctx.fillStyle = cloth; ctx.fillRect(bx+2+sway, by-28+k, 14, 1);
            if (mark && k>3 && k<8) { ctx.fillStyle = mark; ctx.fillRect(bx+6+sway, by-28+k, 4, 1); }
          }
        }
        flag(44, 156, 0, '#8a2c28', '#d8cdb4');
        flag(298, 158, 1.4, '#5e1a1f', '#c2a83e');
      }
    }
  };

  // ── GRUNWALD 1410 ─────────────────────────────────────────────────
  BATTLES.grunwald = {
    bg: '#080b06', stageBg: '#2a4a1a',
    bannerColor: '#f3e2a8',
    enemy: {
      name: 'ULRICH VON JUNGINGEN',
      sub: 'Wielki Mistrz Zakonu Krzyżackiego · Lv.25',
      portrait: 'bitwy/art/m03_ulrich.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#e8e0cc,#b0a888 68%,#706848)',
      ringColor: '#2a2a2a',
      nameplateStyle: 'background:linear-gradient(180deg,#f1e7cd,#e2d3b0);border:3px solid #2c2012;box-shadow:inset 0 0 0 2px #c8ab68,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#2a1d10', subColor: '#6f5d3b', hpColor: '#7a3128',
      hpBarBg: '#1d160b', hpBarBorder: '#0c0a06', hpBarInset: '#4a3a1f',
      hpTextColor: '#6f5d3b', maxHp: 1410,
    },
    player: {
      name: 'WŁADYSŁAW JAGIEŁŁO',
      sub: 'Król Polski i Litwy · z ks. Witoldem · Lv.30',
      portrait: 'bitwy/art/m03_jagiello.png',
      portraitBg: 'radial-gradient(circle at 50% 38%,#f3e4b8,#d8b86e 68%,#a07f3e)',
      ringColor: '#d8b24a',
      nameplateStyle: 'background:linear-gradient(180deg,#1b2a4d,#0f1830);border:2px solid #cf9f3f;box-shadow:inset 0 0 0 2px #2d4170,0 6px 18px rgba(0,0,0,.5);',
      nameColor: '#edc659', subColor: '#aebbd6', hpColor: '#cf9f3f',
      hpBarBg: '#0a1120', hpBarBorder: '#000', hpBarInset: '#2d4170',
      hpTextColor: '#aebbd6', maxHp: 1410,
    },
    dialogue: '15 lipca 1410, pola pod Grunwaldem. Krzyżacy stoją w ciężkich zbrojach, gotowi do bitwy. Jak poprowadzi wojsko król Jagiełło?',
    buttons: [
      { label: '⚔ SZARŻA RYCERSTWA',   sub: 'ciężka polska jazda rusza naprzód',    result: 'Polska jazda uderza w bok szyku Zakonu! Rycerze w czarnych płaszczach odskakują — wyłom w centrum!' },
      { label: '↩ ODWRÓT WITOLDA',     sub: 'pozorowana ucieczka Litwinów',          result: 'Litewska jazda Witolda pozoruje odwrót — Krzyżacy gonią i wpadają w zasadzkę! Szyk zakonu się łamie.' },
      { label: '⛺ CHORĄGWIE Z LASU',   sub: 'ukryte oddziały wpadają z boku',        result: 'Z lasu wypadają ukryte chorągwie polskie! Zakon otoczony z trzech stron walczy o każdy oddech.' },
      { label: '✝ CIOS W WODZA',        sub: 'atak prosto na Wielkiego Mistrza',      result: 'Polscy rycerze przebijają się do samego Ulricha! Wielki Mistrz ginie w walce — Zakon traci głowę.' },
    ],
    paConfig: {
      maxEnemy: 1410, maxPlayer: 1410, outcome: 'win',
      enemyLines: [
        'Krzyżacy kontratakują! Ciężka jazda Zakonu wbija się w polskie szeregi — pada wielu rycerzy.',
        'Zakon rzuca do walki odwody. Wokół króla Jagiełły wrze ciężki bój, sztandary chwieją się w pyle.',
        'Krzyżacki rycerz przebija się ku królowi! Władysław ledwo odpiera cios — bitwa wisi na włosku.',
        'Resztki Zakonu walczą zaciekle do końca, lecz polsko-litewskie wojsko bierze górę.'
      ],
      win: { t: 'ZWYCIĘSTWO!', s: 'Ciężka i krwawa bitwa — ale Polska i Litwa rozbijają Zakon Krzyżacki. Ulrich von Jungingen ginie. 15 lipca 1410.' },
      loss: { t: '', s: '' }
    },
    spec: {
      horizonY: 104,
      sky: [[0,'#3f7fc4'],[0.42,'#79b2dd'],[0.78,'#bedcec'],[1,'#e8eccf']],
      sun: { x:160, y:34, r:12, color:'#fff6c8', glow:'#ffe89c' },
      cloudBand: 30,
      layers: [
        { baseY:100, amp:5, freq:0.05, seed:11, color:'#5d7d51', type:'forest', lightTop:'#789a64' },
        { baseY:105, amp:9, freq:0.028, seed:24, color:'#6f9356', lightTop:'#8aae6a' }
      ],
      ground: { near:'#6f9e4c', far:'#9cb96a', path:'#c8b27a', rows:'#587a40' },
      fields: [{ x:56, y:150, rx:40, ry:8, color:'#cdb968', a:0.85 },{ x:268, y:150, rx:42, ry:8, color:'#cdb968', a:0.85 }],
      platforms: [
        { x:236, y:101, rx:36, ry:7, color:'#b6a65d', shadow:'#5a6a3c' },
        { x:100, y:137, rx:54, ry:12, color:'#aebd6f', shadow:'#4d6036' }
      ],
      ambiance: { type:'embers', count:22, color:'#ecdc90', seed:3, clouds:5, cloudColor:'#ffffff', cloudShade:'#d8e6ee' },
      staticDraw: function (ctx, PA) {
        var ox = 196, oy = 102;
        PA.oval(ctx, ox, oy+3, 24, 5, '#6f9a52', 1);
        ctx.fillStyle = '#5a3f28'; ctx.fillRect(ox-2, oy-16, 5, 20);
        ctx.fillStyle = '#4a3220'; ctx.fillRect(ox+2, oy-16, 1, 20);
        ctx.fillStyle = '#33592f'; PA.circle(ctx, ox, oy-26, 16);
        ctx.fillStyle = '#477339'; PA.circle(ctx, ox-8, oy-27, 11); PA.circle(ctx, ox+9, oy-24, 10);
        ctx.fillStyle = '#5b8f4d'; PA.circle(ctx, ox-3, oy-31, 8); PA.circle(ctx, ox+6, oy-29, 6);
        [[52,96],[66,98],[80,95]].forEach(function (p) {
          ctx.fillStyle = '#e7e0d0'; for (var i = 0; i < 6; i++) ctx.fillRect(p[0]-i, p[1]-6+i, i*2+1, 1);
          ctx.fillStyle = '#b03028'; ctx.fillRect(p[0], p[1]-5, 1, 2);
        });
        ctx.fillStyle = '#3f6b39'; PA.circle(ctx, 16, 184, 9); PA.circle(ctx, 306, 188, 10);
        ctx.fillStyle = '#4f7d44'; PA.circle(ctx, 13, 181, 6); PA.circle(ctx, 309, 184, 6);
      },
      dynamicDraw: function (ctx, t, PA) {
        function flag(bx, by, ph, cloth, mark) {
          ctx.fillStyle = '#3a2a18'; ctx.fillRect(bx, by-30, 2, 34);
          ctx.fillStyle = '#caa24a'; ctx.fillRect(bx-1, by-32, 4, 2);
          for (var i = 0; i < 13; i++) {
            var sway = Math.round(Math.sin(t*3+i*0.55+ph)*2.2);
            ctx.fillStyle = cloth; ctx.fillRect(bx+2+sway, by-30+i, 16, 1);
            if (mark && i>3 && i<9) { ctx.fillStyle = mark; ctx.fillRect(bx+7+sway, by-30+i, 4, 1); }
          }
        }
        flag(36, 150, 0, '#b5302c', '#efe6cf');
        flag(300, 150, 1.4, '#1f3f78', '#e6c84a');
      }
    }
  };

  // Render only the PA.Scene background into a provided canvas (no battle UI or PA.startBattle)
  function startScene(battleId, canvas) {
    var b = BATTLES[battleId];
    if (!b || !b.spec) return null;
    return new PA.Scene(canvas, b.spec);
  }

  return { start: start, startScene: startScene };

})();
