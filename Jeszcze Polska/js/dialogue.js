// dialogue.js — okno dialogowe (portret + tekst) i ogólne overlay UI
window.JP = window.JP || {};

JP.Dialogue = (function () {
  var box        = null;
  var lines      = [];
  var lineIdx    = 0;
  var onClose    = null;
  var toastTimer = null;
  var _keyBound  = false;

  // Space/Enter zawsze posuwa dialog — niezależnie od logiki misji
  function _dlgKey(e) {
    if (e.code !== 'Space' && e.code !== 'Enter') return;
    if (!isOpen()) return;
    e.preventDefault();
    e.stopPropagation();
    advance();
  }

  function _bindKey() {
    if (_keyBound) return;
    _keyBound = true;
    document.addEventListener('keydown', _dlgKey, true); // capture — przed handleInteract
  }

  function _unbindKey() {
    if (!_keyBound) return;
    _keyBound = false;
    document.removeEventListener('keydown', _dlgKey, true);
  }

  var ICONS = {
    chrzest:   'grafiki/art/portraits/dlg_chrzest.png',
    koronacja: 'grafiki/art/portraits/dlg_koronacja.png',
    budowla:   'grafiki/art/portraits/dlg_budowla.png',
    dokument:  'grafiki/art/portraits/dlg_dokument.png',
    bitwa:     'grafiki/art/portraits/dlg_bitwa.png',
    egg:       'grafiki/art/portraits/dlg_easteregg.png',
    wskazowka: 'grafiki/art/portraits/dlg_wskazowka.png',
  };

  function _resolveIcon(icon) {
    if (!icon) return null;
    return ICONS[icon] || icon;
  }

  function _makeBox() {
    var el = document.createElement('div');
    el.id = 'dialogue-box';
    el.className = 'dlg hidden';
    el.innerHTML =
      '<div class="dlg-portrait-wrap">' +
        '<img class="dlg-portrait-img" src="" alt="" />' +
        '<div class="dlg-portrait-ph" id="dlg-ph"></div>' +
      '</div>' +
      '<div class="dlg-body">' +
        '<div class="dlg-name" id="dlg-name"></div>' +
        '<div class="dlg-text" id="dlg-text"></div>' +
        '<div class="dlg-btn-row" id="dlg-btn-row"></div>' +
      '</div>';
    var scene = document.querySelector('.game-scene');
    if (scene) scene.appendChild(el);
    else document.body.appendChild(el);
    return el;
  }

  function _ensure() {
    if (!box || !box.parentNode) box = document.getElementById('dialogue-box') || _makeBox();
    return box;
  }

  function _setPortrait(npc) {
    _ensure();
    var img = box.querySelector('.dlg-portrait-img');
    var ph  = document.getElementById('dlg-ph');
    var src = npc && (npc.portrait || npc._iconSrc);
    if (src) {
      img.src = src;
      img.style.display = 'block';
      ph.style.display  = 'none';
    } else {
      img.style.display = 'none';
      ph.style.display  = 'flex';
      ph.textContent    = (npc && npc.name) ? npc.name[0] : '?';
    }
  }

  function _showLine() {
    document.getElementById('dlg-text').textContent = lines[lineIdx] || '';
    var row = document.getElementById('dlg-btn-row');
    row.innerHTML = '';
    var btn = document.createElement('button');
    btn.className   = 'dlg-btn';
    btn.textContent = lineIdx < lines.length - 1 ? 'Dalej ▶' : 'Zamknij';
    btn.addEventListener('click', advance);
    row.appendChild(btn);
  }

  // Otwórz dialog z NPC (lista linii)
  function open(npc, callback) {
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    _ensure();
    lines   = (npc && npc.lines) ? npc.lines : [];
    lineIdx = 0;
    onClose = callback || null;
    _setPortrait(npc);
    document.getElementById('dlg-name').textContent = (npc && npc.name) || '';
    _showLine();
    box.classList.remove('hidden');
    JP.Player.pause();
    _bindKey();
  }

  function advance() {
    if (!lines.length) {
      // info() lub confirm() — kliknij pierwszy przycisk (tak/OK, nie Anuluj)
      if (box && !box.classList.contains('hidden')) {
        var btn = box.querySelector('.dlg-btn:not(.dlg-btn--cancel)');
        if (btn) btn.click();
      }
      return;
    }
    lineIdx++;
    if (lineIdx >= lines.length) { close(); }
    else { _showLine(); }
  }

  function close() {
    _ensure();
    box.classList.add('hidden');
    lines   = []; lineIdx = 0;
    _unbindKey();
    JP.Player.resume();
    if (onClose) { var cb = onClose; onClose = null; cb(); }
  }

  // Komunikat wymagający zamknięcia przez gracza
  function toast(msg) {
    open({ name: '', _iconSrc: ICONS.wskazowka, lines: [msg] }, null);
  }

  // Panel informacyjny z jednym przyciskiem (np. easter egg)
  // icon — klucz z ICONS lub pełna ścieżka do grafiki (opcjonalnie)
  function info(titleText, bodyText, btnLabel, callback, icon) {
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    _ensure();
    lines = []; lineIdx = 0;
    onClose = callback || null;
    _setPortrait(icon ? { _iconSrc: _resolveIcon(icon) } : null);
    document.getElementById('dlg-name').textContent = titleText;
    document.getElementById('dlg-text').textContent = bodyText;
    var row = document.getElementById('dlg-btn-row');
    row.innerHTML = '';
    var btn = document.createElement('button');
    btn.className   = 'dlg-btn';
    btn.textContent = btnLabel || 'OK';
    btn.addEventListener('click', close);
    row.appendChild(btn);
    box.classList.remove('hidden');
    JP.Player.pause();
    _bindKey();
  }

  // Dialog wyboru: Zbuduj / Anuluj  (yesLabel opcjonalnie nadpisuje tekst przycisku)
  // icon — klucz z ICONS lub pełna ścieżka do grafiki (opcjonalnie)
  function confirm(titleText, bodyText, onYes, onNo, yesLabel, icon) {
    _ensure();
    lines = []; lineIdx = 0; onClose = null;
    _setPortrait(icon ? { _iconSrc: _resolveIcon(icon) } : null);
    document.getElementById('dlg-name').textContent = titleText;
    document.getElementById('dlg-text').textContent = bodyText;

    var row = document.getElementById('dlg-btn-row');
    row.innerHTML = '';

    var yesBtn = document.createElement('button');
    yesBtn.className   = 'dlg-btn';
    yesBtn.textContent = yesLabel || 'Zbuduj ✓';
    yesBtn.addEventListener('click', function () {
      if (yesBtn.dataset.fired) return;
      yesBtn.dataset.fired = '1';
      close();
      if (onYes) onYes();
    });

    var noBtn = document.createElement('button');
    noBtn.className   = 'dlg-btn dlg-btn--cancel';
    noBtn.textContent = 'Anuluj';
    noBtn.addEventListener('click', function () {
      if (noBtn.dataset.fired) return;
      noBtn.dataset.fired = '1';
      close();
      if (onNo) onNo();
    });

    row.appendChild(yesBtn);
    row.appendChild(noBtn);
    box.classList.remove('hidden');
    JP.Player.pause();
    _bindKey();
  }

  function isOpen() {
    return !!box && !box.classList.contains('hidden');
  }

  function reset() {
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    _unbindKey();
    lines   = [];
    lineIdx = 0;
    onClose = null;
    box     = null; // zmusi _ensure() do stworzenia nowego elementu w nowej scenie
  }

  return { open, close, toast, info, confirm, isOpen, advance, reset };
})();
