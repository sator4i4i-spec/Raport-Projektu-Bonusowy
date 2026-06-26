// engine.js — menedżer scen
// Eksportuje: window.JP.Engine
window.JP = window.JP || {};

JP.Engine = (function () {
  const scenes = {};

  return {
    registerScene(name, fn) {
      scenes[name] = fn;
    },
    showScene(name, params) {
      params = params || {};
      const container = document.getElementById('scene-container');
      if (window.JP && JP.Dialogue) JP.Dialogue.reset();
      if (window.JP && JP.Player)   JP.Player.pause();
      container.innerHTML = '';
      const fn = scenes[name];
      if (fn) {
        fn(container, params);
      } else {
        container.innerHTML = '<div class="error-scene"><p>Scena &bdquo;' + name + '&rdquo; nie istnieje.</p></div>';
      }
      if (window.JP && JP.Audio) JP.Audio.attachToHud();
    },
  };
})();
