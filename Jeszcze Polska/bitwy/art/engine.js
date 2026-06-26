/* ============================================================================
   PIXEL BATTLE ENGINE  —  Polish Historical RPG
   - PA.Scene(canvas, spec): renders a layered pixel-art landscape to a low-res
     buffer (384x240) and blits it scaled & crisp; animates clouds / snow / rain /
     mist / banners / windmill each frame.
   - PA.drawBust(ctx, scale, cfg): draws a 48x48 chunky character bust.
   - PA.SCENES / PA.BUSTS: per-battle data.
   ========================================================================== */
(function () {
  var PA = (window.PA = window.PA || {});
  var SW = 320, SH = 200;       // low-res internal resolution (16:10) → ×4 = 1280×800 crisp
  PA.S = 48;                     // bust source grid

  /* ---------- color helpers ---------- */
  function hex(c) {
    c = c.replace('#', '');
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mix(c1, c2, t) {
    var a = hex(c1), b = hex(c2);
    return 'rgb(' + Math.round(lerp(a[0], b[0], t)) + ',' + Math.round(lerp(a[1], b[1], t)) + ',' + Math.round(lerp(a[2], b[2], t)) + ')';
  }
  PA.mix = mix;

  // deterministic pseudo-random
  function rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }

  // 4x4 Bayer matrix for dithered gradients
  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

  /* ---------- scene rendering ---------- */
  // paint a vertical dithered gradient between sky stops onto a pixel buffer
  function paintSky(buf, stops, y0, y1) {
    var d = buf.data;
    for (var y = y0; y < y1; y++) {
      var ty = (y - y0) / (y1 - y0);
      // find segment
      var c = stops[stops.length - 1][1];
      for (var i = 0; i < stops.length - 1; i++) {
        if (ty <= stops[i + 1][0]) {
          var seg = (ty - stops[i][0]) / (stops[i + 1][0] - stops[i][0]);
          c = mixArr(hex(stops[i][1]), hex(stops[i + 1][1]), seg);
          break;
        }
      }
      // quantize with dither
      for (var x = 0; x < SW; x++) {
        var th = (BAYER[(x & 3) + ((y & 3) << 2)] + 0.5) / 16;
        var lvls = 10;
        var idx = (y * SW + x) * 4;
        d[idx] = qd(c[0], lvls, th); d[idx + 1] = qd(c[1], lvls, th); d[idx + 2] = qd(c[2], lvls, th); d[idx + 3] = 255;
      }
    }
  }
  function mixArr(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  function qd(v, lvls, th) { var step = 255 / (lvls - 1); var low = Math.floor(v / step) * step; var frac = (v - low) / step; return Math.round((frac > th ? low + step : low)); }

  // hill / forest silhouette layer, returns top-edge y per column for stacking
  function drawHills(ctx, baseY, amp, freq, seed, color, type, lightTop) {
    var r = rng(seed), phases = [];
    for (var i = 0; i < 4; i++) phases.push(r() * 6.28);
    ctx.fillStyle = color;
    var tops = [];
    for (var x = 0; x < SW; x++) {
      var h = 0;
      h += Math.sin(x * freq + phases[0]) * amp;
      h += Math.sin(x * freq * 2.3 + phases[1]) * amp * 0.35;
      h += Math.sin(x * freq * 0.5 + phases[2]) * amp * 0.6;
      var top = Math.round(baseY - h);
      tops.push(top);
      ctx.fillRect(x, top, 1, SH - top);
    }
    if (lightTop) { ctx.fillStyle = lightTop; for (var x2 = 0; x2 < SW; x2++) ctx.fillRect(x2, tops[x2], 1, 2); }
    if (type === 'forest') {
      // little tree bumps along the crest
      ctx.fillStyle = color;
      for (var x3 = 0; x3 < SW; x3 += 3) {
        var tp = tops[x3], bump = 2 + Math.round(rng(seed + x3)() * 3);
        ctx.fillRect(x3, tp - bump, 3, bump);
      }
    }
    return tops;
  }

  // perspective ground from horizonY to bottom
  function drawGround(ctx, spec) {
    var hy = spec.horizonY, near = hex(spec.ground.near), far = hex(spec.ground.far);
    for (var y = hy; y < SH; y++) {
      var t = (y - hy) / (SH - hy);
      var c = mixArr(far, near, Math.pow(t, 0.8));
      ctx.fillStyle = 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')';
      ctx.fillRect(0, y, SW, 1);
    }
    // central light path (a soft triangle of trodden ground)
    if (spec.ground.path) {
      ctx.fillStyle = spec.ground.path;
      for (var y2 = hy; y2 < SH; y2++) {
        var t2 = (y2 - hy) / (SH - hy);
        var w = 6 + t2 * 150;
        ctx.globalAlpha = 0.5 * t2;
        ctx.fillRect(SW / 2 - w / 2, y2, w, 1);
      }
      ctx.globalAlpha = 1;
    }
    // furrow / texture rows
    if (spec.ground.rows) {
      ctx.fillStyle = spec.ground.rows;
      var r = rng(spec.seed || 7);
      for (var i = 0; i < 90; i++) {
        var y3 = hy + 6 + Math.pow(r(), 1.4) * (SH - hy - 6);
        var t3 = (y3 - hy) / (SH - hy);
        ctx.globalAlpha = 0.12 + t3 * 0.18;
        var len = 6 + t3 * 40, x = r() * SW;
        ctx.fillRect(x, y3, len, 1);
      }
      ctx.globalAlpha = 1;
    }
  }

  // soft oval patch (wheat fields / platforms)
  function oval(ctx, cx, cy, rx, ry, color, alpha) {
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = color;
    for (var y = -ry; y <= ry; y++) {
      var w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))));
      ctx.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2, 1);
    }
    ctx.globalAlpha = 1;
  }
  PA.oval = oval;

  // a chunky tree (foreground decoration)
  function tree(ctx, x, y, scale, leaf, leafDk, trunk) {
    var s = scale;
    ctx.fillStyle = trunk; ctx.fillRect(x - s, y - s * 2, s * 2, s * 4);
    ctx.fillStyle = leafDk;
    ctx.fillRect(x - s * 4, y - s * 6, s * 8, s * 4);
    ctx.fillRect(x - s * 3, y - s * 8, s * 6, s * 3);
    ctx.fillStyle = leaf;
    ctx.fillRect(x - s * 3, y - s * 7, s * 5, s * 3);
    ctx.fillRect(x - s * 2, y - s * 8, s * 4, s * 2);
  }

  /* ---------- the Scene object ---------- */
  PA.Scene = function (canvas, spec) {
    var off = document.createElement('canvas'); off.width = SW; off.height = SH;
    var octx = off.getContext('2d'); octx.imageSmoothingEnabled = false;
    var bg = document.createElement('canvas'); bg.width = SW; bg.height = SH;
    var bctx = bg.getContext('2d'); bctx.imageSmoothingEnabled = false;
    var dctx = canvas.getContext('2d'); dctx.imageSmoothingEnabled = false;

    // ---- render static background once ----
    var img = bctx.createImageData(SW, SH);
    paintSky(img, spec.sky, 0, spec.horizonY + 4);
    bctx.putImageData(img, 0, 0);
    // sun / moon glow
    if (spec.sun) {
      var g = spec.sun;
      for (var rr = g.r + 22; rr >= 0; rr--) {
        bctx.globalAlpha = rr > g.r ? 0.05 : 1;
        bctx.fillStyle = rr > g.r ? g.glow : g.color;
        circle(bctx, g.x, g.y, rr);
      }
      bctx.globalAlpha = 1;
    }
    // distant hill/forest layers (painter's order, back to front)
    (spec.layers || []).forEach(function (L) { drawHills(bctx, L.baseY, L.amp, L.freq, L.seed, L.color, L.type, L.lightTop); });
    // ground
    drawGround(bctx, spec);
    // decorative wheat ovals
    (spec.fields || []).forEach(function (f) { oval(bctx, f.x, f.y, f.rx, f.ry, f.color, f.a); });
    // battle platforms
    if (spec.platforms) spec.platforms.forEach(function (p) {
      oval(bctx, p.x, p.y, p.rx, p.ry, p.shadow, 0.55);
      oval(bctx, p.x, p.y - 1, p.rx - 2, p.ry - 1, p.color, 0.9);
    });
    // static scenery (landmarks without motion, foreground props)
    if (spec.staticDraw) spec.staticDraw(bctx, PA);

    // ---- animation loop ----
    var raf, t0 = performance.now(), stopped = false;
    var parts = initParticles(spec);
    function frame(now) {
      if (stopped) return;
      var t = (now - t0) / 1000;
      octx.drawImage(bg, 0, 0);
      if (spec.dynamicDraw) spec.dynamicDraw(octx, t, PA);
      drawParticles(octx, parts, t, spec);
      // blit scaled
      var cw = canvas.width, ch = canvas.height;
      dctx.imageSmoothingEnabled = false;
      dctx.clearRect(0, 0, cw, ch);
      dctx.drawImage(off, 0, 0, SW, SH, 0, 0, cw, ch);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return { stop: function () { stopped = true; cancelAnimationFrame(raf); } };
  };

  function circle(ctx, cx, cy, r) {
    for (var y = -r; y <= r; y++) {
      var w = Math.round(Math.sqrt(Math.max(0, r * r - y * y)));
      ctx.fillRect(cx - w, cy + y, w * 2 + 1, 1);
    }
  }
  PA.circle = circle;

  /* ---------- particle ambiance ---------- */
  function initParticles(spec) {
    var amb = spec.ambiance || {}, list = [];
    var n = amb.count || 0, r = rng(amb.seed || 99);
    for (var i = 0; i < n; i++) list.push({ x: r() * SW, y: r() * SH, sp: 0.4 + r() * 1.2, sz: amb.type === 'rain' ? 1 : (r() < 0.3 ? 2 : 1), ph: r() * 6.28, dr: (r() - 0.5) });
    // clouds
    var clouds = [], cn = (amb.clouds || 0), cr = rng((amb.seed || 99) + 5);
    for (var c = 0; c < cn; c++) clouds.push({ x: cr() * SW, y: 12 + cr() * (spec.cloudBand || 40), w: 24 + cr() * 40, sp: 2 + cr() * 4, op: 0.55 + cr() * 0.35 });
    return { list: list, clouds: clouds, amb: amb };
  }
  function drawParticles(ctx, P, t, spec) {
    var amb = P.amb;
    // clouds drift (behind hills visually but we keep them in upper sky)
    if (P.clouds.length) {
      P.clouds.forEach(function (cl) {
        var x = (cl.x + t * cl.sp) % (SW + 80) - 40;
        ctx.globalAlpha = cl.op;
        ctx.fillStyle = amb.cloudColor || '#ffffff';
        var w = cl.w;
        ctx.fillRect(x, cl.y, w, 5);
        ctx.fillRect(x + 6, cl.y - 4, w - 14, 4);
        ctx.fillRect(x + w * 0.45, cl.y - 7, w * 0.4, 4);
        ctx.globalAlpha = cl.op * 0.6;
        ctx.fillStyle = amb.cloudShade || '#d7e2ee';
        ctx.fillRect(x, cl.y + 5, w, 2);
      });
      ctx.globalAlpha = 1;
    }
    if (amb.type === 'snow') {
      ctx.fillStyle = amb.color || '#ffffff';
      P.list.forEach(function (p) {
        var y = (p.y + t * p.sp * 18) % SH;
        var x = (p.x + Math.sin(t * 0.8 + p.ph) * 8 + p.dr * t * 4 + SW) % SW;
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(p.ph + t);
        ctx.fillRect(x | 0, y | 0, p.sz, p.sz);
      });
      ctx.globalAlpha = 1;
    } else if (amb.type === 'rain') {
      ctx.strokeStyle = amb.color || 'rgba(200,215,230,0.6)';
      ctx.fillStyle = amb.color || 'rgba(200,215,230,0.55)';
      P.list.forEach(function (p) {
        var y = (p.y + t * (p.sp + 3) * 60) % SH;
        var x = (p.x - t * 30 + SW * 4) % SW;
        ctx.fillRect(x | 0, y | 0, 1, 6);
      });
    } else if (amb.type === 'mist') {
      P.list.forEach(function (p) {
        var x = (p.x + t * p.sp * 6) % (SW + 60) - 30;
        ctx.globalAlpha = 0.05 + 0.05 * Math.sin(t * 0.5 + p.ph);
        ctx.fillStyle = amb.color || '#fff6e0';
        ctx.fillRect(x, p.y * 0.4 + spec.horizonY - 30 + Math.sin(p.ph) * 6, 70, 3);
      });
      ctx.globalAlpha = 1;
    } else if (amb.type === 'embers') {
      P.list.forEach(function (p) {
        var y = (p.y - t * p.sp * 8 + SH) % SH;
        var x = (p.x + Math.sin(t + p.ph) * 6 + SW) % SW;
        ctx.globalAlpha = 0.4 + 0.4 * Math.sin(p.ph + t * 2);
        ctx.fillStyle = amb.color || '#ffd27a';
        ctx.fillRect(x | 0, y | 0, p.sz, p.sz);
      });
      ctx.globalAlpha = 1;
    }
    // water shimmer line near horizon
    if (spec.shimmer) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = spec.shimmer.color;
      for (var i = 0; i < 18; i++) {
        var sx = (i * 23 + Math.sin(t * 1.5 + i) * 6) % SW;
        ctx.fillRect(sx, spec.shimmer.y + (i % 3), 6 + (i % 4) * 3, 1);
      }
      ctx.globalAlpha = 1;
    }
  }

  /* ============================================================================
     CHARACTER BUSTS  —  PA.drawBust(ctx, scale, cfg)
     48x48 chunky head-and-shoulders portrait, drawn for a round window.
     ========================================================================== */
  function R(ctx, s, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x * s, y * s, w * s, h * s); }

  PA.drawBust = function (ctx, s, cfg) {
    ctx.clearRect(0, 0, 48 * s, 48 * s);
    ctx.imageSmoothingEnabled = false;
    // circular themed backdrop
    var bg1 = cfg.bg || '#9fb7cf', bg2 = cfg.bg2 || mix(cfg.bg || '#9fb7cf', '#000000', 0.25);
    for (var y = 0; y < 48; y++) {
      var w = Math.round(24 * Math.sqrt(Math.max(0, 1 - Math.pow((y - 24) / 24, 2))));
      ctx.fillStyle = mix(bg1, bg2, y / 48);
      ctx.fillRect((24 - w) * s, y * s, w * 2 * s, s);
    }
    var skin = cfg.skin || '#e0ac7e', sh = cfg.skinSh || mix(skin, '#5a2f18', 0.32);
    var hair = cfg.hair || '#5a3a22', hairD = mix(hair, '#000', 0.35);

    // shoulders / torso (armor or robe)
    var arm = cfg.armor || '#7a8794', armD = mix(arm, '#000', 0.3), armL = mix(arm, '#fff', 0.25);
    R(ctx, s, 8, 40, 32, 8, armD);
    R(ctx, s, 9, 37, 30, 6, arm);
    R(ctx, s, 12, 35, 24, 3, arm);
    R(ctx, s, 9, 37, 3, 9, armL);          // left highlight
    if (cfg.collar) { R(ctx, s, 17, 34, 14, 3, cfg.collar); R(ctx, s, 19, 36, 10, 2, mix(cfg.collar, '#fff', 0.3)); }
    if (cfg.chestMark) cfg.chestMark(ctx, s); // e.g. teutonic cross

    // neck
    R(ctx, s, 20, 31, 8, 5, sh); R(ctx, s, 21, 31, 6, 4, skin);

    // head (rounded)
    R(ctx, s, 16, 13, 16, 19, skin);
    R(ctx, s, 15, 16, 1, 12, skin); R(ctx, s, 32, 16, 1, 12, skin);
    R(ctx, s, 17, 12, 14, 1, skin);
    R(ctx, s, 31, 14, 1, 16, sh);          // right cheek shade
    R(ctx, s, 16, 26, 16, 1, sh);
    // ears
    R(ctx, s, 14, 21, 2, 4, skin); R(ctx, s, 32, 21, 2, 4, skin); R(ctx, s, 33, 21, 1, 4, sh);

    if (!cfg.noHair && cfg.hairStyle !== 'bald') {
      // hair base
      R(ctx, s, 15, 11, 18, 5, hair);
      R(ctx, s, 14, 14, 2, 9, hair); R(ctx, s, 32, 14, 2, 9, hair);
      R(ctx, s, 15, 11, 18, 1, hairD);
      if (cfg.hairStyle === 'long') { R(ctx, s, 13, 16, 2, 14, hair); R(ctx, s, 33, 16, 2, 14, hair); R(ctx, s, 13, 28, 3, 4, hairD); R(ctx, s, 32, 28, 3, 4, hairD); }
      if (cfg.hairStyle === 'wig') { // powdered 18thc
        R(ctx, s, 13, 14, 3, 16, '#e7e2d8'); R(ctx, s, 32, 14, 3, 16, '#e7e2d8');
        R(ctx, s, 15, 11, 18, 4, '#efeae0'); R(ctx, s, 13, 28, 4, 4, '#d8d2c6'); R(ctx, s, 31, 28, 4, 4, '#d8d2c6');
      }
    }

    // brows + eyes
    var eye = cfg.eye || '#2a2018';
    R(ctx, s, 19, 20, 3, 1, hairD); R(ctx, s, 26, 20, 3, 1, hairD);
    R(ctx, s, 19, 22, 2, 2, '#f4ede0'); R(ctx, s, 26, 22, 2, 2, '#f4ede0');
    R(ctx, s, 20, 22, 1, 2, eye); R(ctx, s, 27, 22, 1, 2, eye);
    // nose
    R(ctx, s, 23, 24, 2, 3, sh);
    // mouth / mustache / beard
    if (cfg.beard === 'long') {
      R(ctx, s, 17, 27, 14, 8, hair); R(ctx, s, 19, 35, 10, 3, hair); R(ctx, s, 22, 38, 4, 3, hairD);
      R(ctx, s, 17, 27, 14, 1, hairD);
      R(ctx, s, 20, 28, 8, 2, mix(hair, '#000', 0.2));
    } else if (cfg.beard === 'short') {
      R(ctx, s, 17, 28, 14, 5, hair); R(ctx, s, 18, 33, 12, 2, hair); R(ctx, s, 17, 28, 14, 1, hairD);
    }
    if (cfg.mustache) { R(ctx, s, 20, 27, 8, 2, hair); R(ctx, s, 19, 28, 2, 2, hair); R(ctx, s, 27, 28, 2, 2, hair); }
    if (!cfg.beard && !cfg.mustache) { R(ctx, s, 22, 28, 4, 1, sh); } // mouth

    // headgear on top
    if (cfg.hat) HATS[cfg.hat] && HATS[cfg.hat](ctx, s, cfg);
  };

  var HATS = {
    crown: function (ctx, s, c) {
      var g = c.hatColor || '#f1c84b', gd = mix(g, '#000', 0.3), gl = mix(g, '#fff', 0.4);
      R(ctx, s, 15, 9, 18, 4, g); R(ctx, s, 15, 12, 18, 1, gd); R(ctx, s, 15, 9, 18, 1, gl);
      // points
      [16, 22, 28].forEach(function (px) { R(ctx, s, px, 6, 3, 3, g); R(ctx, s, px + 1, 5, 1, 1, '#e2403a'); });
      R(ctx, s, 23, 10, 2, 2, '#3a7be0'); R(ctx, s, 18, 10, 1, 1, '#e2403a'); R(ctx, s, 29, 10, 1, 1, '#2ea66a');
    },
    fur: function (ctx, s, c) { // Monomakh cap — gold dome + dark fur brim + cross
      var f = c.hatColor || '#caa24a', dome = mix(f, '#fff', 0.2);
      R(ctx, s, 16, 6, 16, 6, f); R(ctx, s, 18, 4, 12, 3, f); R(ctx, s, 21, 2, 6, 3, f);
      R(ctx, s, 16, 6, 16, 1, dome);
      R(ctx, s, 23, 0, 2, 3, '#f0d97a'); R(ctx, s, 22, 1, 4, 1, '#f0d97a'); // cross finial
      var fur = c.furColor || '#6e5638', furL = mix(fur, '#fff', 0.25);
      R(ctx, s, 14, 11, 20, 4, fur); R(ctx, s, 14, 11, 20, 1, furL);
      for (var i = 14; i < 34; i += 2) R(ctx, s, i, 12, 1, 2, furL);
    },
    kolpak: function (ctx, s, c) { // Hungarian fur cap + feather (Batory)
      var t = c.hatColor || '#9e2a2a', fur = c.furColor || '#7a6038';
      R(ctx, s, 15, 5, 18, 7, t); R(ctx, s, 17, 3, 14, 3, t); R(ctx, s, 15, 5, 18, 1, mix(t, '#fff', 0.3));
      R(ctx, s, 13, 10, 22, 4, fur); R(ctx, s, 13, 10, 22, 1, mix(fur, '#fff', 0.3));
      for (var i = 13; i < 35; i += 2) R(ctx, s, i, 11, 1, 2, mix(fur, '#fff', 0.25));
      // feather
      R(ctx, s, 31, 1, 2, 7, '#e8e2d0'); R(ctx, s, 32, 0, 2, 5, '#ffffff'); R(ctx, s, 30, 9, 3, 2, '#caa24a');
    },
    boyar: function (ctx, s, c) { // tall fur hat
      var t = c.hatColor || '#2d6a4a', fur = c.furColor || '#5a4631';
      R(ctx, s, 16, 1, 16, 9, t); R(ctx, s, 16, 1, 16, 1, mix(t, '#fff', 0.3)); R(ctx, s, 18, 4, 3, 4, mix(t, '#fff', 0.2));
      R(ctx, s, 14, 9, 20, 4, fur); R(ctx, s, 14, 9, 20, 1, mix(fur, '#fff', 0.3));
      for (var i = 14; i < 34; i += 2) R(ctx, s, i, 10, 1, 2, mix(fur, '#fff', 0.22));
    },
    teuton: function (ctx, s, c) { // white coif/helm + black cross on brow
      R(ctx, s, 14, 9, 20, 6, '#efe9dc'); R(ctx, s, 13, 13, 3, 14, '#e4ddcc'); R(ctx, s, 32, 13, 3, 14, '#e4ddcc');
      R(ctx, s, 16, 8, 16, 2, '#ffffff'); R(ctx, s, 14, 9, 20, 1, '#ffffff');
      R(ctx, s, 22, 9, 4, 5, '#1c1c1c'); R(ctx, s, 20, 10, 8, 2, '#1c1c1c'); // black cross
    },
    helm: function (ctx, s, c) { // steel zischagge (husar/Żółkiewski)
      var st = c.hatColor || '#9aa4ad', stl = mix(st, '#fff', 0.35), std = mix(st, '#000', 0.35);
      R(ctx, s, 15, 7, 18, 7, st); R(ctx, s, 18, 5, 12, 3, st); R(ctx, s, 22, 3, 4, 3, st);
      R(ctx, s, 15, 7, 18, 1, stl); R(ctx, s, 17, 8, 2, 5, stl); R(ctx, s, 31, 8, 2, 6, std);
      R(ctx, s, 14, 13, 20, 2, std);            // brim
      R(ctx, s, 23, 13, 2, 6, st);              // nasal bar
      R(ctx, s, 23, 1, 2, 3, '#b03030');        // small plume base
    },
    bicorne: function (ctx, s, c) { // late-18thc black hat + cockade
      var b = c.hatColor || '#1b1d24', bl = mix(b, '#fff', 0.18);
      R(ctx, s, 12, 8, 24, 4, b); R(ctx, s, 14, 6, 20, 3, b); R(ctx, s, 12, 8, 24, 1, bl);
      R(ctx, s, 11, 9, 2, 2, b); R(ctx, s, 35, 9, 2, 2, b);
      if (c.cockade !== false) { R(ctx, s, 16, 7, 3, 4, c.cockade || '#d23a3a'); R(ctx, s, 17, 5, 1, 3, '#e8e2d0'); }
    },
    rogatywka: function (ctx, s, c) { // Polish 4-corner cap (Kościuszko / kosynier)
      var t = c.hatColor || '#8a1f2b', tl = mix(t, '#fff', 0.22), band = c.band || '#e7ddc8';
      R(ctx, s, 15, 6, 18, 6, t); R(ctx, s, 14, 5, 6, 3, t); R(ctx, s, 28, 5, 6, 3, t); // squared corners
      R(ctx, s, 15, 6, 18, 1, tl);
      R(ctx, s, 14, 11, 20, 3, band); R(ctx, s, 14, 11, 20, 1, mix(band, '#fff', 0.3));
    },
    czapka: function (ctx, s, c) { // peasant round cap
      var t = c.hatColor || '#6a4a2a', band = c.band || '#3a2a18';
      R(ctx, s, 15, 7, 18, 5, t); R(ctx, s, 17, 5, 14, 3, t); R(ctx, s, 15, 7, 18, 1, mix(t, '#fff', 0.2));
      R(ctx, s, 14, 11, 20, 3, band);
    }
  };

  // teutonic chest cross helper
  PA.teutonCross = function (ctx, s) { R(ctx, s, 22, 40, 4, 8, '#1c1c1c'); R(ctx, s, 19, 42, 10, 3, '#1c1c1c'); };

  /* ============================================================================
     BATTLE LOOP  —  PA.startBattle(root, cfg)
     Convention-based: reads [data-role] elements inside `root`.
       enemy-hp-fill / enemy-hp-text / player-hp-fill / player-hp-text
       dialogue (has data-initial)  ·  banner (has [data-role=banner-title],
       [data-role=banner-sub], starts hidden)  ·  replay button
       option buttons: [data-opt] with data-result text
     cfg: { maxEnemy, maxPlayer, outcome:'win'|'loss', win:{t,s}, loss:{t,s} }
     ========================================================================== */
  function hpColor(frac) { return frac > 0.5 ? '#5bbf5b' : frac > 0.22 ? '#e0b53a' : '#d24b3a'; }

  PA.startBattle = function (root, cfg) {
    var q = function (s) { return root.querySelector(s); };
    var qa = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
    var eF = q('[data-role=enemy-hp-fill]'), eT = q('[data-role=enemy-hp-text]');
    var pF = q('[data-role=player-hp-fill]'), pT = q('[data-role=player-hp-text]');
    var dlg = q('[data-role=dialogue]'), banner = q('[data-role=banner]');
    var dlgText = q('[data-role=dlg-text]');
    var dlgNext = q('[data-role=dlg-next]');
    var opts = qa('[data-opt]'), replay = q('[data-role=replay]');
    var maxE = cfg.maxEnemy, maxP = cfg.maxPlayer;
    var initial = dlg ? dlg.getAttribute('data-initial') || '' : '';

    // HP curves: 4 exchanges to the historical result
    var WIN = [[0.66, 0.80], [0.44, 0.54], [0.21, 0.35], [0.0, 0.27]];
    var LOSS = [[0.84, 0.58], [0.70, 0.34], [0.62, 0.15], [0.58, 0.0]];
    var curve = cfg.outcome === 'loss' ? LOSS : WIN;

    function setText(t) { if (dlgText) dlgText.textContent = t; else if (dlg) dlg.textContent = t; }
    function showNext() { if (dlgNext) { dlgNext.style.display = 'block'; dlgNext.focus(); } }
    function hideNext() { if (dlgNext) dlgNext.style.display = 'none'; }

    var step = 0, done = false, busy = false, _afterNext = null;
    function setBar(fill, text, frac, max) {
      if (fill) { fill.style.width = Math.max(0, frac * 100).toFixed(1) + '%'; fill.style.background = hpColor(frac); }
      if (text) text.textContent = Math.max(0, Math.round(frac * max)) + ' / ' + max;
    }
    function reset() {
      step = 0; done = false; busy = false; _afterNext = null;
      setBar(eF, eT, 1, maxE); setBar(pF, pT, 1, maxP);
      setText(initial);
      hideNext();
      if (banner) banner.style.opacity = '0', banner.style.pointerEvents = 'none';
      opts.forEach(function (b) { b.style.pointerEvents = 'auto'; b.style.opacity = '1'; });
    }
    function finish() {
      done = true;
      hideNext();
      var res = cfg.outcome === 'loss' ? cfg.loss : cfg.win;
      if (banner) {
        var bt = banner.querySelector('[data-role=banner-title]'), bs = banner.querySelector('[data-role=banner-sub]');
        if (bt) bt.textContent = res.t; if (bs) bs.textContent = res.s;
        banner.style.color = cfg.outcome === 'loss' ? '#e7c0b4' : '#f3e2a8';
        banner.style.opacity = '1'; banner.style.pointerEvents = 'auto';
      }
      opts.forEach(function (b) { b.style.pointerEvents = 'none'; b.style.opacity = '0.45'; });
    }
    function advanceTurn() {
      hideNext();
      if (_afterNext) {
        var fn = _afterNext; _afterNext = null; fn();
      } else {
        busy = false;
        opts.forEach(function (b) { if (!done) { b.style.opacity = '1'; b.style.pointerEvents = 'auto'; } });
      }
    }
    function play(btn) {
      if (done || busy || step >= curve.length) return;
      busy = true;
      var line = btn.getAttribute('data-result');
      setText(line);
      var c = curve[step];
      setBar(eF, eT, c[0], maxE);
      opts.forEach(function (b) { b.style.opacity = '0.5'; b.style.pointerEvents = 'none'; });
      // Show Dalej so player can read their own action result before enemy responds
      showNext();
      _afterNext = (function (cap) {
        return function () {
          var el = (cfg.enemyLines && cfg.enemyLines[step]) || '';
          setText(el);
          setBar(pF, pT, cap[1], maxP);
          step++;
          if (step >= curve.length) {
            setTimeout(finish, 850);
          } else {
            // Show Dalej again so player confirms before next turn's options appear
            showNext();
          }
        };
      })(c);
    }
    opts.forEach(function (b) { b.addEventListener('click', function () { play(b); }); });
    if (dlgNext) dlgNext.addEventListener('click', advanceTurn);

    // Space key advances the Dalej button when visible
    function _onKey(e) {
      if (e.code !== 'Space') return;
      if (dlgNext && dlgNext.style.display !== 'none') {
        e.preventDefault();
        advanceTurn();
      }
    }
    root.addEventListener('keydown', _onKey);

    if (replay) replay.addEventListener('click', reset);
    reset();
    return { reset: reset };
  };

})();
