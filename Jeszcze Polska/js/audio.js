// audio.js — system muzyki i sound bar
// Dwa utwory tła (medieval quite / quite2) tworzą jeden nieprzerwany łańcuch:
//   quite → quite2 → quite → quite2 → …
// Muzyka startuje przy załadowaniu strony i trwa przez całą grę bez względu
// na zmiany sceny. Jedyne wyjątki:
//   play('battle')   — tymczasowo zastępuje tło muzyką bitewną
//   playOnce('hymn') — mazurek kończy grę (tło nie wraca)
window.JP = window.JP || {};

JP.Audio = (function () {

  // ── Konfiguracja ─────────────────────────────────────────────────
  var BG_TRACKS    = ['music/medieval quite.mp3', 'music/medieval quite2.mp3'];
  var BATTLE_TRACK = 'music/medieval battle.mp3';
  var HYMN_TRACK   = 'music/mazurek.mp3';

  var _volume = 0.35;
  var _muted  = false;

  // ── Tło: naprzemienne odtwarzanie ────────────────────────────────
  var _bgEl      = null;   // aktywny element audio tła
  var _bgIdx     = 0;      // indeks następnego tracka tła
  var _bgRunning = false;  // czy tło powinno grać

  function _playBgNext() {
    if (_bgEl) { try { _bgEl.pause(); } catch (e) {} _bgEl = null; }
    var el = new Audio(BG_TRACKS[_bgIdx % BG_TRACKS.length]);
    el.volume = _muted ? 0 : _volume;
    el.loop   = false;
    el.addEventListener('ended', function () {
      if (!_bgRunning) return;
      _bgIdx = (_bgIdx + 1) % BG_TRACKS.length;
      _playBgNext();
    });
    _bgEl = el;
    el.play().catch(function () {
      // Autoplay zablokowany przez przeglądarkę — poczekaj na _unlock
    });
  }

  // Uruchamia tło jeśli jeszcze nie gra (idempotentna)
  function _startBg() {
    _bgRunning = true;
    if (_bgEl && !_bgEl.paused) return; // już gra — nic nie rób
    _playBgNext();
  }

  function _stopBg() {
    _bgRunning = false;
    if (_bgEl) { try { _bgEl.pause(); } catch (e) {} _bgEl = null; }
  }

  // ── Override: bitwa / mazurek ─────────────────────────────────────
  var _ovEl = null;

  function _playOverride(src, loop) {
    _stopBg();
    if (_ovEl) { try { _ovEl.pause(); } catch (e) {} _ovEl = null; }
    var el = new Audio(src);
    el.loop   = loop;
    el.volume = _muted ? 0 : _volume;
    _ovEl = el;
    el.play().catch(function () {});
  }

  function _stopOverride() {
    if (_ovEl) { try { _ovEl.pause(); } catch (e) {} _ovEl = null; }
  }

  // ── Publiczne API ─────────────────────────────────────────────────

  // play('hub') i play('explore') → upewnij się, że tło gra (nie przerywaj)
  // play('battle') → zastąp tło muzyką bitewną
  function play(trackKey) {
    if (trackKey === 'hub' || trackKey === 'explore') {
      _stopOverride();
      _startBg();
    } else if (trackKey === 'battle') {
      _playOverride(BATTLE_TRACK, true);
    }
  }

  // playOnce('hymn') → zatrzymaj wszystko, zagraj mazurek jeden raz (koniec gry)
  function playOnce(trackKey) {
    if (trackKey === 'hymn') {
      _stopBg();
      _stopOverride();
      _playOverride(HYMN_TRACK, false);
    }
  }

  function stop() {
    _stopBg();
    _stopOverride();
  }

  // ── Odblokowanie autoplay po pierwszej interakcji użytkownika ─────
  function _unlock() {
    document.removeEventListener('click',   _unlock, true);
    document.removeEventListener('keydown', _unlock, true);
    _startBg(); // wznowi jeśli blokada autoplay nie pozwoliła ruszyć wcześniej
  }

  // ── Głośność ──────────────────────────────────────────────────────
  function setVolume(v) {
    _volume = Math.max(0, Math.min(1, v));
    if (_bgEl && !_muted) _bgEl.volume = _volume;
    if (_ovEl && !_muted) _ovEl.volume = _volume;
    _savePrefs();
    _updateBar();
  }

  function toggleMute() {
    _muted = !_muted;
    var vol = _muted ? 0 : _volume;
    if (_bgEl) _bgEl.volume = vol;
    if (_ovEl) _ovEl.volume = vol;
    _savePrefs();
    _updateBar();
  }

  // ── Prefs (localStorage) ──────────────────────────────────────────
  function _savePrefs() {
    try { localStorage.setItem('jp_audio', JSON.stringify({ vol: _volume, muted: _muted })); } catch (e) {}
  }
  function _loadPrefs() {
    try {
      var p = JSON.parse(localStorage.getItem('jp_audio') || 'null');
      if (p) { _volume = p.vol !== undefined ? p.vol : _volume; _muted = !!p.muted; }
    } catch (e) {}
  }

  // ── Sound bar ─────────────────────────────────────────────────────
  function attachToHud() {
    var bar = document.getElementById('sound-bar');
    if (!bar) { mountBar(); bar = document.getElementById('sound-bar'); }
    if (!bar) return;
    var hud = document.querySelector('.scene-hud');
    if (hud) {
      var title = hud.querySelector('.hud-mission-title');
      if (title) hud.insertBefore(bar, title);
      else hud.appendChild(bar);
    } else {
      document.body.appendChild(bar);
    }
  }

  function mountBar() {
    if (document.getElementById('sound-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'sound-bar';
    bar.innerHTML =
      '<button id="sb-mute" title="Wycisz / odkisz"><span id="sb-icon">♪</span></button>' +
      '<input id="sb-slider" type="range" min="0" max="100" step="1" ' +
        'value="' + Math.round(_volume * 100) + '" title="Głośność" />';
    document.body.appendChild(bar);
    document.getElementById('sb-mute').addEventListener('click', function () { toggleMute(); });
    document.getElementById('sb-slider').addEventListener('input', function () {
      if (_muted) _muted = false;
      setVolume(this.value / 100);
    });
    _updateBar();
  }

  function _updateBar() {
    var icon   = document.getElementById('sb-icon');
    var slider = document.getElementById('sb-slider');
    if (!icon || !slider) return;
    icon.textContent   = (_muted || _volume === 0) ? '♪̶' : '♪';
    icon.style.opacity = (_muted || _volume === 0) ? '0.4' : '1';
    slider.value = Math.round(_volume * 100);
  }

  // ── Init ──────────────────────────────────────────────────────────
  function init() {
    _loadPrefs();
    mountBar();
    // Czekaj na pierwszą interakcję (polityka autoplay przeglądarek)
    document.addEventListener('click',   _unlock, true);
    document.addEventListener('keydown', _unlock, true);
    // Spróbuj od razu — zadziała jeśli przeglądarka pozwoli
    _startBg();
  }

  return {
    init:        init,
    play:        play,
    playOnce:    playOnce,
    stop:        stop,
    setVolume:   setVolume,
    toggleMute:  toggleMute,
    attachToHud: attachToHud,
  };

})();
