// state.js — globalny stan gry (localStorage)
// Eksportuje: window.JP.State
window.JP = window.JP || {};

JP.State = (function () {
  const KEY = 'jeszcze_polska_v1';
  const SAVE_VERSION = 1; // bump this to force-clear all saved progress
  const DEFAULT = { v: SAVE_VERSION, completedMissions: [], foundEggs: [] };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return Object.assign({}, DEFAULT);
      const data = JSON.parse(raw);
      // version mismatch → treat as fresh start
      if (data.v !== SAVE_VERSION) return Object.assign({}, DEFAULT);
      return Object.assign({}, DEFAULT, data);
    } catch { return Object.assign({}, DEFAULT); }
  }

  function save(s) {
    localStorage.setItem(KEY, JSON.stringify(s));
  }

  return {
    isMissionComplete(id) { return load().completedMissions.includes(id); },
    completeMission(id)  {
      const s = load();
      if (!s.completedMissions.includes(id)) { s.completedMissions.push(id); save(s); }
    },
    addEgg(id) {
      const s = load();
      if (!s.foundEggs.includes(id)) { s.foundEggs.push(id); save(s); }
    },
    getFoundEggs()       { return load().foundEggs; },
    allEggsFound(ids)    { const f = new Set(load().foundEggs); return ids.every(id => f.has(id)); },
    resetProgress()      { save(Object.assign({}, DEFAULT)); },
  };
})();
