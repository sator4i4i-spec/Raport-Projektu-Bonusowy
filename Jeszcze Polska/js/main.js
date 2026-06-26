// main.js — punkt startowy gry
// Rejestruje sceny i odpala hub.
// Uruchamiany jako ostatni <script> w index.html.

JP.Engine.registerScene('hub', function (container) {
  JP.Hub.mount(container);
  JP.Audio.play('hub');
});

JP.Engine.registerScene('mission', function (container, params) {
  var missionId = params && params.missionId;
  if (missionId === 'm01') {
    JP.M01.mountMission(container);
  } else if (missionId === 'm02') {
    JP.M02.mountMission(container);
  } else if (missionId === 'm03') {
    JP.M03.mountMission(container);
  } else if (missionId === 'm04') {
    JP.M04.mountMission(container);
  } else if (missionId === 'm05') {
    JP.M05.mountMission(container);
  } else {
    // Stub dla misji jeszcze niezbudowanych
    container.innerHTML =
      '<div class="stub-scene">' +
        '<p class="stub-text">Misja <strong>' + (missionId || '?') + '</strong> — wkrótce dostępna.</p>' +
        '<button class="btn-primary" id="stub-back">← Powrót do mapy</button>' +
      '</div>';
    document.getElementById('stub-back').addEventListener('click', function () {
      JP.Engine.showScene('hub');
    });
  }
});

// Start
JP.Audio.init();
JP.Engine.showScene('hub');
