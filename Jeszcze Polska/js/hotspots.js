// hotspots.js — wykrywanie i rendering hotspotów na mapie
window.JP = window.JP || {};

JP.Hotspots = (function () {
  var INTERACT_R = 72; // promień aktywacji (px)

  var list    = [];   // aktywne hotspoty
  var nearest = null; // najbliższy hotspot w zasięgu

  // Typ → kolor markera
  var TYPE_CLR = {
    budynek: '#e8c060',
    npc:     '#60c0e8',
    egg:     '#e880e8',
    refusal: '#e86060',
    battle:  '#e84040',
  };

  function init(hotspotDefs) {
    var T = JP.Tilemap.T;
    list = hotspotDefs.map(function (h) {
      return {
        id:         h.id,
        type:       h.type,
        label:      h.label,
        buildType:  h.buildType  || null,
        npcId:      h.npcId      || null,
        eggId:      h.eggId      || null,
        refusalMsg: h.refusalMsg || null,
        px: h.col * T + T / 2,
        py: h.row * T + T / 2,
        built:     false,
        collected: false,
        hidden:    !!h.hidden,
      };
    });
    nearest = null;
  }

  function update(playerX, playerY) {
    var prev = nearest;
    nearest = null;
    var best = INTERACT_R;
    list.forEach(function (h) {
      if (h.collected || h.hidden) return;
      var dx = playerX - h.px, dy = playerY - h.py;
      var d  = Math.sqrt(dx * dx + dy * dy);
      if (d < best) { best = d; nearest = h; }
    });
    if (nearest !== prev) _updateHint();
  }

  function _updateHint() {
    var el = document.getElementById('hotspot-hint');
    if (!el) {
      var panel = document.querySelector('.side-panel');
      if (!panel) return;
      el = document.createElement('div');
      el.id = 'hotspot-hint';
      el.style.cssText = 'text-align:center;font-size:0.7rem;color:var(--gold,#c8a84b);font-family:var(--font-serif,Georgia,serif);padding:6px 4px;min-height:2em;transition:opacity 0.2s;';
      panel.appendChild(el);
    }
    if (nearest) {
      el.style.opacity = '1';
      el.innerHTML = '⎵ Spacja<br><span style="color:#fff;font-size:0.65rem;">' + nearest.label + '</span>';
    } else {
      el.style.opacity = '0.35';
      el.innerHTML = '⎵ Spacja &mdash; odkrywaj';
    }
  }

  function render(ctx, camX, camY, imgs) {
    var cw = ctx.canvas.width, ch = ctx.canvas.height;

    list.forEach(function (h) {
      if (h.collected || h.hidden) return;
      var sx = h.px - camX, sy = h.py - camY;
      if (sx < -128 || sx > cw + 128 || sy < -160 || sy > ch + 32) return;

      var clr = TYPE_CLR[h.type] || '#ffffff';
      var isNear = (h === nearest);

      // --- Sprite budynku / ikona NPC ---
      if (h.type === 'budynek') {
        if (h.buildType === 'port') {
          // Port — kotwica zamiast budynku
          ctx.font = '40px serif';
          ctx.textAlign = 'center';
          ctx.globalAlpha = h.built ? 1 : 0.5;
          ctx.fillText('⚓', sx, sy - 10);
          ctx.globalAlpha = 1;
          if (h.built) {
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = '#4488ff';
            ctx.fillRect(sx - 30, sy - 52, 60, 52);
            ctx.globalAlpha = 1;
          }
        } else {
          var bImg = (h.buildType === 'zamek') ? imgs.castle : imgs.monastery;
          if (bImg) {
            var bW = 80, bH = 80;
            ctx.globalAlpha = h.built ? 1 : 0.45;
            ctx.drawImage(bImg, sx - bW/2, sy - bH, bW, bH);
            ctx.globalAlpha = 1;
            if (h.built) {
              ctx.globalAlpha = 0.18;
              ctx.fillStyle = '#ffd700';
              ctx.fillRect(sx - 40, sy - 80, 80, 80);
              ctx.globalAlpha = 1;
            }
          } else {
            ctx.font = '36px serif';
            ctx.textAlign = 'center';
            ctx.globalAlpha = h.built ? 1 : 0.45;
            ctx.fillText(h.buildType === 'zamek' ? '🏰' : '🏛', sx, sy - 8);
            ctx.globalAlpha = 1;
          }
        }
      } else if (h.type === 'npc') {
        var nImg = imgs.house1;
        if (nImg) {
          ctx.drawImage(nImg, sx - 32, sy - 56, 64, 56);
        } else {
          ctx.font = '28px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🏠', sx, sy - 6);
        }
      } else if (h.type === 'egg') {
        ctx.font = '30px serif';
        ctx.textAlign = 'center';
        // Subtelny puls
        var alpha = 0.6 + 0.4 * Math.sin(Date.now() / 400);
        ctx.globalAlpha = alpha;
        ctx.fillText('🗿', sx, sy - 4);
        ctx.globalAlpha = 1;
      } else if (h.type === 'refusal') {
        ctx.font = '26px serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠', sx, sy - 4);
      } else if (h.type === 'battle') {
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚔', sx, sy - 4);
      }

      // --- Marker / pulsujące kółko ---
      ctx.beginPath();
      ctx.arc(sx, sy, isNear ? 9 : 6, 0, Math.PI * 2);
      ctx.fillStyle = clr;
      ctx.globalAlpha = isNear ? 1 : 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;

      // --- Etykieta (tylko gdy blisko) ---
      if (isNear || h.built) {
        ctx.font = 'bold 11px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#fff';
        ctx.strokeText(h.label, sx, sy - (h.type === 'npc' ? 62 : h.type === 'budynek' ? 86 : 22));
        ctx.fillText(h.label,   sx, sy - (h.type === 'npc' ? 62 : h.type === 'budynek' ? 86 : 22));
      }
    });

  }

function getNearest()   { return nearest; }
  function getById(id)    { return list.find(function(h){ return h.id === id; }); }
  function markBuilt(id)  { var h = getById(id); if (h) h.built = true; }
  function markCollected(id) { var h = getById(id); if (h) h.collected = true; }

  return { init, update, render, getNearest, getById, markBuilt, markCollected };
})();
