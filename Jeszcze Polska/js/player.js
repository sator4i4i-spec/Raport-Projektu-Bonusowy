// player.js — postać króla: ruch, kierunek, kolizje
window.JP = window.JP || {};

JP.Player = (function () {
  var SPEED  = 160; // px/s
  var HBOX   = 20;  // połowa hitboxa (kwadrat 40×40)
  var SPRITE_W = 48, SPRITE_H = 48;

  var state = { x: 0, y: 0, facing: 'down', moving: false };
  var keys  = {};
  var active = false;
  var headSymbol = 'crown'; // 'pagan' | 'diadem' | 'crown'

  function init(startCol, startRow) {
    var T = JP.Tilemap.T;
    state.x = startCol * T + T / 2;
    state.y = startRow * T + T / 2;
    state.facing = 'down';
    state.moving  = false;
    for (var k in keys) keys[k] = false;
    active = true;
  }

  function bindKeys() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
  }
  function unbindKeys() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup',   onKeyUp);
    for (var k in keys) keys[k] = false;
  }

  function onKeyDown(e) {
    keys[e.code] = true;
    // Zapobiegaj przewijaniu strony strzałkami
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
      e.preventDefault();
    }
  }
  function onKeyUp(e) { keys[e.code] = false; }

  function update(dt) {
    if (!active) return;
    var T  = JP.Tilemap.T;
    var vx = 0, vy = 0;

    if (keys['ArrowLeft']  || keys['KeyA']) { vx = -SPEED; state.facing = 'left'; }
    if (keys['ArrowRight'] || keys['KeyD']) { vx =  SPEED; state.facing = 'right'; }
    if (keys['ArrowUp']    || keys['KeyW']) { vy = -SPEED; state.facing = 'up'; }
    if (keys['ArrowDown']  || keys['KeyS']) { vy =  SPEED; state.facing = 'down'; }

    state.moving = (vx !== 0 || vy !== 0);
    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    // Kolizja pozioma
    var nx = state.x + vx * dt;
    var cL = Math.floor((nx - HBOX + 2) / T);
    var cR = Math.floor((nx + HBOX - 2) / T);
    var rT = Math.floor((state.y - HBOX + 4) / T);
    var rB = Math.floor((state.y + HBOX - 4) / T);
    if (!JP.Tilemap.isSolid(vx > 0 ? cR : cL, rT) &&
        !JP.Tilemap.isSolid(vx > 0 ? cR : cL, rB)) {
      state.x = nx;
    }

    // Kolizja pionowa
    var ny = state.y + vy * dt;
    cL = Math.floor((state.x - HBOX + 2) / T);
    cR = Math.floor((state.x + HBOX - 2) / T);
    var rTest = Math.floor((vy > 0 ? ny + HBOX - 2 : ny - HBOX + 2) / T);
    if (!JP.Tilemap.isSolid(cL, rTest) && !JP.Tilemap.isSolid(cR, rTest)) {
      state.y = ny;
    }

    // Ogranicz do granic mapy
    var mx = JP.Tilemap.pixelWidth()  - HBOX;
    var my = JP.Tilemap.pixelHeight() - HBOX;
    state.x = Math.max(HBOX, Math.min(mx, state.x));
    state.y = Math.max(HBOX, Math.min(my, state.y));
  }

  // Słowiańskie koło słoneczne — symbol pogański Mieszka I
  function _drawPagan(ctx, cx, cy) {
    ctx.save();
    var r = 7;
    var yc = cy - 2;
    // Cień
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(cx, yc + r + 1, r * 0.7, 2, 0, 0, Math.PI * 2); ctx.fill();
    // Zewnętrzne koło
    ctx.strokeStyle = '#5c2a00';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(120,50,10,0.15)';
    ctx.beginPath(); ctx.arc(cx, yc, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // 8 szprych
    ctx.lineWidth = 1.5;
    for (var i = 0; i < 8; i++) {
      var a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r * 0.22, yc + Math.sin(a) * r * 0.22);
      ctx.lineTo(cx + Math.cos(a) * r * 0.85, yc + Math.sin(a) * r * 0.85);
      ctx.stroke();
    }
    // Środkowe kółko
    ctx.fillStyle = '#8B3A00';
    ctx.beginPath(); ctx.arc(cx, yc, r * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Opaska Bolesława — diadem chrześcijański przed koronacją
  function _drawDiadem(ctx, cx, cy) {
    ctx.save();
    var w = 16, h = 5;
    var x0 = cx - w / 2;
    // Cień
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(cx, cy + 2, w * 0.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    // Opaska złota
    var grad = ctx.createLinearGradient(cx, cy - h, cx, cy);
    grad.addColorStop(0, '#ffe066'); grad.addColorStop(1, '#b8860b');
    ctx.fillStyle = grad;
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(x0, cy - h, w, h, 2); ctx.fill(); ctx.stroke();
    // Mały krzyż chrześcijański w centrum
    ctx.strokeStyle = '#fff8e0';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx, cy - h + 1); ctx.lineTo(cx, cy - 1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 2.5, cy - h * 0.6); ctx.lineTo(cx + 2.5, cy - h * 0.6); ctx.stroke();
    ctx.restore();
  }

  // Kwiat — ikona Jadwigi przed koronacją
  function _drawFlower(ctx, cx, cy) {
    ctx.save();
    var yc = cy - 2, r = 5;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, yc + r + 2, r * 0.7, 2, 0, 0, Math.PI * 2); ctx.fill();
    var petalClr = ['#ff7ab5','#ffb3d6','#ff7ab5','#ffb3d6','#ff7ab5'];
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.fillStyle = petalClr[i];
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * r * 0.85, yc + Math.sin(a) * r * 0.85, r * 0.6, r * 0.4, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffd700';
    ctx.beginPath(); ctx.arc(cx, yc, r * 0.38, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Kwiecista korona — ikona Jadwigi po koronacji
  function _drawFloralCrown(ctx, cx, cy) {
    var w = 16, h = 9, x0 = cx - w / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(cx, cy + h + 1, w / 2, 2, 0, 0, Math.PI * 2); ctx.fill();
    // Opaska
    ctx.fillStyle = '#2d6e2a'; ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(x0, cy + h * 0.5, w, h * 0.5, 2); ctx.fill(); ctx.stroke();
    // 3 kwiatki na górze
    [cx - w * 0.3, cx, cx + w * 0.3].forEach(function (fx, i) {
      var clr = i === 1 ? '#ff4499' : '#ff7ab5';
      for (var p = 0; p < 4; p++) {
        var a = (p / 4) * Math.PI * 2;
        ctx.fillStyle = clr;
        ctx.beginPath();
        ctx.ellipse(fx + Math.cos(a) * 2.4, cy + Math.sin(a) * 2.4, 2, 1.4, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffd700';
      ctx.beginPath(); ctx.arc(fx, cy, 1.4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  // Korona królewska — proceduralna, cx/cy = środek podstawy korony
  function _drawCrown(ctx, cx, cy) {
    var w = 16, h = 10; // szerokość i wysokość korony
    var x0 = cx - w / 2;

    ctx.save();

    // Cień
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + h + 1, w / 2, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Obrys czarny (rysujemy kształt dwa razy: większy czarny, mniejszy złoty)
    ctx.lineJoin = 'miter';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(0,0,0,0.9)';

    function crownPath() {
      ctx.beginPath();
      // Podstawa
      ctx.moveTo(x0, cy + h);
      ctx.lineTo(x0 + w, cy + h);
      // Prawa ściana
      ctx.lineTo(x0 + w, cy + h * 0.5);
      // Prawy ząb
      ctx.lineTo(x0 + w * 0.82, cy);
      ctx.lineTo(x0 + w * 0.68, cy + h * 0.45);
      // Środkowy ząb (najwyższy)
      ctx.lineTo(x0 + w * 0.56, cy - h * 0.15);
      ctx.lineTo(x0 + w * 0.44, cy - h * 0.15);
      // Lewy ząb
      ctx.lineTo(x0 + w * 0.32, cy + h * 0.45);
      ctx.lineTo(x0 + w * 0.18, cy);
      // Lewa ściana
      ctx.lineTo(x0, cy + h * 0.5);
      ctx.closePath();
    }

    crownPath();
    ctx.stroke();

    // Wypełnienie złote — gradient
    var grad = ctx.createLinearGradient(cx, cy - h * 0.15, cx, cy + h);
    grad.addColorStop(0, '#ffe066');
    grad.addColorStop(0.5, '#ffd700');
    grad.addColorStop(1, '#b8860b');
    ctx.fillStyle = grad;
    crownPath();
    ctx.fill();

    // Trzy małe klejnoty (czerwony środek, dwa boczne)
    var gems = [
      { x: cx,          y: cy + h * 0.72, r: 1.6, c: '#e03030' },
      { x: cx - w*0.28, y: cy + h * 0.72, r: 1.2, c: '#3060e0' },
      { x: cx + w*0.28, y: cy + h * 0.72, r: 1.2, c: '#3060e0' },
    ];
    gems.forEach(function(g) {
      ctx.fillStyle = g.c;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  function render(ctx, camX, camY, imgs) {
    var sx = state.x - camX;
    var sy = state.y - camY;
    var W = SPRITE_W, H = SPRITE_H;
    var img = state.moving ? imgs.pawnRun : imgs.pawnIdle;

    // Cień pod postacią
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Sprite postaci
    ctx.save();
    if (state.facing === 'left') {
      // Lustrzane odbicie: przesuń, odbij, rysuj przy x=0
      ctx.translate(sx, 0);
      ctx.scale(-1, 1);
      sx = 0;
    }

    if (img) {
      // Tiny Swords: strip poziomy — klatka = img.height × img.height
      var fw = (img.width > img.height) ? img.height : img.width;
      ctx.drawImage(img, 0, 0, fw, img.height, sx - W/2, sy - H, W, H);
    } else {
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.fillText('♛', sx, sy - 8);
    }

    // Symbol nad głową — zależny od fazy
    if      (headSymbol === 'pagan')       _drawPagan(ctx, sx, sy - H - 4);
    else if (headSymbol === 'diadem')      _drawDiadem(ctx, sx, sy - H - 2);
    else if (headSymbol === 'flower')      _drawFlower(ctx, sx, sy - H - 4);
    else if (headSymbol === 'floralCrown') _drawFloralCrown(ctx, sx, sy - H - 4);
    else                                   _drawCrown(ctx, sx, sy - H - 6);

    ctx.restore();
  }

  return {
    state: state,
    keys: keys,
    init: init,
    bindKeys: bindKeys,
    unbindKeys: unbindKeys,
    update: update,
    render: render,
    pause:  function () { active = false; },
    resume: function () { active = true; },
    setHeadSymbol: function (s) { headSymbol = s; },
    resetHeadSymbol: function () { headSymbol = 'crown'; },
  };
})();
