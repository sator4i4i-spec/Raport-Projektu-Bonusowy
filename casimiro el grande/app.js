/* ============================================================
   Kazimierz Wielki — Założenie Bydgoszczy
   Narrated 3-part theatre engine
   ============================================================ */
(function(){
  'use strict';

  var U = 'uploads/';
  function enc(name){ return U + encodeURIComponent(name); }
  // optimized web version of a painted scene, e.g. "IMAGEN 5.png" -> assets/scene/IMAGEN_5.jpg
  function sceneSrc(name){ return 'assets/scene/' + name.replace('.png','.jpg').replace(/ /g,'_'); }

  // ---- Story structure: 3 parts, each with painted scenes -------------
  // fraction boundaries of the narration timeline
  var PART_BOUNDS = [0, 0.31, 0.655, 1];   // -> ~0:00 / 2:00 / 4:10 / 6:22
  var CARD_DUR = 7;                          // seconds for the chapter title card

  var PARTS = [
    {
      id:1, num:'I', title:'Powrót Kujaw', sub:'Wojna z Zakonem i odzyskanie ziemi nad Brdą',
      page:'1.jpeg', card:'IMAGEN 2.png', music:"King's Korona i Pergamin.mp3",
      scenes:[
        {img:'IMAGEN 1.png', cap:'Wojna z Państwem Krzyżackim o Kujawy'},
        {img:'IMAGEN 2.png', cap:'Król rozważa założenie nowego miasta nad Brdą'}
      ]
    },
    {
      id:2, num:'II', title:'Lokacja 1346', sub:'Akt lokacyjny na prawie magdeburskim, 19 kwietnia',
      page:'3.jpeg', card:'IMAGEN 5.png', music:"Family's Tree Ledger.mp3",
      scenes:[
        {img:'IMAGEN 5.png', cap:'Król podpisuje akt lokacyjny Bydgoszczy'},
        {img:'IMAGEN 3.png', cap:'„Miasto z woli króla Kazimierza”'},
        {img:'IMAGEN 6.png', cap:'Ogłoszenie przywileju mieszczanom'},
        {img:'IMAGEN 4.png', cap:'Zasadźcy wytyczają miejskie grunty'},
        {img:'IMAGEN 7.png', cap:'Pomiary ziemi i pierwsze zasiewy'},
        {img:'IMAGEN 8.png', cap:'Nadanie przekazane nowym osadnikom'}
      ]
    },
    {
      id:3, num:'III', title:'Rozwój miasta', sub:'Samorząd, rzemiosło, handel i dobrobyt',
      page:'5.jpeg', card:'IMAGEN 13.png', music:"Court Fiddlework.mp3",
      scenes:[
        {img:'IMAGEN 9.png',  cap:'Król przemawia do mieszczan Bydgoszczy'},
        {img:'IMAGEN 10.png', cap:'Rada miejska — narodziny samorządu'},
        {img:'IMAGEN 11.png', cap:'Ławnicy i sąd miejski'},
        {img:'IMAGEN 14.png', cap:'Nadanie 9000 ha — rzemiosło i handel'},
        {img:'IMAGEN 15.png', cap:'Prawo wolnego spławu towarów rzeką'},
        {img:'IMAGEN 12.png', cap:'Żniwa i rosnący dobrobyt mieszkańców'},
        {img:'IMAGEN 13.png', cap:'Święto plonów w nowym mieście'}
      ]
    }
  ];

  // Ken Burns presets. With the painting shown 'contain', scale 1 + no pan
  // = the WHOLE picture visible. Every preset touches that full-frame state
  // at one end, then zooms in/out to a detail at the other end.
  var KB = [
    {s0:1.00,s1:1.16, x0:0,   y0:0,   x1:-3.5,y1:-2.4},  // start full → push into upper area
    {s0:1.16,s1:1.00, x0:3.2, y0:2.2, x1:0,   y1:0},     // start on a detail → reveal full
    {s0:1.00,s1:1.13, x0:0,   y0:0,   x1:3.0, y1:1.8},   // start full → drift to lower-right
    {s0:1.13,s1:1.00, x0:-3.0,y0:-1.8,x1:0,   y1:0}      // start on a detail → reveal full
  ];

  // ---- DOM refs --------------------------------------------------------
  var narr, theatre, stage, capChapter, capText, cardplate, cardNum, cardTitle, cardSub;
  var btnPlay, btnPlayIcon, scrub, scrubFill, scrubBuf, timeNow, timeTot, chipsWrap, spk;
  var cues = [];        // flat list of {type,img,cap,partId,num,partTitle,start,end,kb}
  var layers = [];      // scene-layer DOM nodes (parallel to cues)
  var current = -1;
  var music = [];       // {audio, targetVol} per part
  var musicOn = true;
  var rafId = null;
  var built = false;
  var wantPlaying = false;   // user intends playback (vs. paused/closed/ended)

  // ---- Background music (personal-2.mp3) carried from main page ----------
  var bgAudio = null;
  var bgPlaying = false;
  var bgFadeRaf = null;

  function bgFadeTo(target, onDone) {
    if (!bgAudio) return;
    cancelAnimationFrame(bgFadeRaf);
    (function step() {
      var v = bgAudio.volume, diff = target - v;
      if (Math.abs(diff) < 0.008) {
        bgAudio.volume = target;
        if (target === 0 && !bgAudio.paused) { bgAudio.pause(); }
        if (onDone) onDone();
        return;
      }
      bgAudio.volume = v + diff * 0.09;
      bgFadeRaf = requestAnimationFrame(step);
    })();
  }

  function bgUpdateBtn() {
    var btn = document.getElementById('bgMusicBtn');
    if (!btn) return;
    btn.textContent = bgPlaying ? '♫' : '♪';
    btn.style.opacity = bgPlaying ? '1' : '.5';
    btn.style.borderColor = bgPlaying ? 'rgba(201,168,76,.7)' : 'rgba(201,168,76,.35)';
  }

  function bgPlay() {
    if (!bgAudio) return;
    bgAudio.volume = 0;
    bgAudio.play().then(function () {
      bgPlaying = true;
      bgFadeTo(0.35);
      bgUpdateBtn();
    }).catch(function () {
      // autoplay blocked — retry on first user gesture
      function onGesture() {
        document.removeEventListener('click',   onGesture);
        document.removeEventListener('keydown', onGesture);
        bgAudio.volume = 0;
        bgAudio.play().then(function () {
          bgPlaying = true;
          bgFadeTo(0.35);
          bgUpdateBtn();
        }).catch(function () {});
      }
      document.addEventListener('click',   onGesture);
      document.addEventListener('keydown', onGesture);
    });
  }

  function bgStop() {
    if (!bgAudio) return;
    bgFadeTo(0, function () { bgPlaying = false; bgUpdateBtn(); });
  }

  function initBgMusic() {
    bgAudio = document.getElementById('bgMusic');
    if (!bgAudio) return;

    // autoplay always; sessionStorage flag just means "came from main page"
    sessionStorage.removeItem('bgMusicActive');
    bgPlay();

    var btn = document.getElementById('bgMusicBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        bgPlaying ? bgStop() : bgPlay();
      });
    }
  }

  function fmt(t){
    if(!isFinite(t)) t=0;
    var m=Math.floor(t/60), s=Math.floor(t%60);
    return m+':'+(s<10?'0':'')+s;
  }

  // ---- Build cue sheet once duration is known -------------------------
  function buildCues(dur){
    cues = [];
    for(var p=0;p<PARTS.length;p++){
      var part = PARTS[p];
      var pStart = PART_BOUNDS[p]*dur;
      var pEnd   = PART_BOUNDS[p+1]*dur;
      // chapter title card
      cues.push({
        type:'card', img:part.card, cap:'', partId:part.id, num:part.num,
        partTitle:part.title, partSub:part.sub,
        start:pStart, end:Math.min(pStart+CARD_DUR, pEnd)
      });
      var sStart = Math.min(pStart+CARD_DUR, pEnd);
      var per = (pEnd - sStart) / part.scenes.length;
      for(var i=0;i<part.scenes.length;i++){
        cues.push({
          type:'scene', img:part.scenes[i].img, cap:part.scenes[i].cap,
          partId:part.id, num:part.num, partTitle:part.title,
          start:sStart + i*per, end:sStart + (i+1)*per
        });
      }
    }
    cues[cues.length-1].end = dur + 1;
  }

  function buildLayers(){
    stage.querySelectorAll('.scene-layer').forEach(function(n){n.remove();});
    layers = [];
    cues.forEach(function(c, idx){
      var layer = document.createElement('div');
      layer.className = 'scene-layer';
      var src = sceneSrc(c.img);
      var bg = document.createElement('div');
      bg.className = 'scene-layer__bg';
      bg.style.backgroundImage = 'url("'+ src +'")';
      var img = document.createElement('div');
      img.className = 'scene-layer__img';
      img.style.backgroundImage = 'url("'+ src +'")';
      layer.appendChild(bg);
      layer.appendChild(img);
      stage.insertBefore(layer, stage.firstChild);
      layers[idx] = {el:layer, img:img, bg:bg, kb:KB[idx % KB.length]};
    });
    // build scrubber marks at part boundaries
    var marks = scrub.querySelector('.scrub__marks');
    marks.innerHTML='';
    for(var b=1;b<PART_BOUNDS.length-1;b++){
      var m=document.createElement('div'); m.className='scrub__mark';
      m.style.left=(PART_BOUNDS[b]*100)+'%'; marks.appendChild(m);
    }
  }

  function cueAt(t){
    for(var i=0;i<cues.length;i++){ if(t>=cues[i].start && t<cues[i].end) return i; }
    return t<=0 ? 0 : cues.length-1;
  }

  function setCue(idx){
    if(idx===current) return;
    current = idx;
    layers.forEach(function(l,i){ l.el.classList.toggle('is-active', i===idx); });
    var c = cues[idx];
    if(c.type==='card'){
      cardNum.textContent = 'Część '+c.num;
      cardTitle.textContent = c.partTitle;
      cardSub.textContent = c.partSub;
      cardplate.classList.add('is-on');
    } else {
      cardplate.classList.remove('is-on');
      capChapter.textContent = 'Część '+c.num+' · '+c.partTitle;
      capText.style.opacity = 0;
      setTimeout(function(){ capText.textContent=c.cap; capText.style.opacity=1; }, 220);
    }
    // active part chip
    chipsWrap.querySelectorAll('.chip').forEach(function(ch){
      ch.classList.toggle('is-active', +ch.dataset.part===c.partId);
    });
  }

  function applyKenBurns(idx, t){
    var l = layers[idx]; if(!l) return;
    var c = cues[idx];
    var dur = Math.max(0.001, c.end - c.start);
    var pr = Math.min(1, Math.max(0, (t - c.start)/dur));
    var k = l.kb;
    var s = k.s0 + (k.s1-k.s0)*pr;
    var x = k.x0 + (k.x1-k.x0)*pr;
    var y = k.y0 + (k.y1-k.y0)*pr;
    l.img.style.transform = 'scale('+s.toFixed(4)+') translate('+x.toFixed(3)+'%,'+y.toFixed(3)+'%)';
  }

  // ---- Render loop -----------------------------------------------------
  function tick(){
    var t = narr.currentTime;
    var idx = cueAt(t);
    setCue(idx);
    applyKenBurns(idx, t);
    // scrubber + time
    var d = narr.duration||1;
    scrubFill.style.width = (t/d*100)+'%';
    if(narr.buffered.length){
      scrubBuf.style.width = (narr.buffered.end(narr.buffered.length-1)/d*100)+'%';
    }
    timeNow.textContent = fmt(t);
    // gracefully fade the court music into the true ending so it never
    // cuts abruptly near 6:22
    if(music.length){
      var rem = (narr.duration||d) - t;
      var ef = rem < 9 ? Math.max(0, rem/9) : 1;
      var pIdx = current>=0 ? PARTS.findIndex(function(p){return p.id===cues[current].partId;}) : 0;
      if(pIdx<0) pIdx=0;
      music.forEach(function(m,i){
        if(i===pIdx && musicOn && !narr.paused) m.target = 0.16*ef;
      });
      if(!fadeRaf) fadeRaf = requestAnimationFrame(fadeStep);
    }
    if(!narr.paused) rafId = requestAnimationFrame(tick);
  }

  // ---- Music crossfade -------------------------------------------------
  function ensureMusic(){
    if(music.length) return;
    PARTS.forEach(function(p){
      var a = new Audio(enc(p.music));
      a.loop = true; a.volume = 0; a.preload='auto';
      music.push({audio:a});
    });
  }
  var fadeRaf=null;
  function updateMusic(){
    if(!music.length) return;
    var partIdx = current>=0 ? PARTS.findIndex(function(p){return p.id===cues[current].partId;}) : 0;
    if(partIdx<0) partIdx=0;
    music.forEach(function(m,i){
      m.target = (musicOn && !narr.paused && i===partIdx) ? 0.16 : 0;
      if(m.target>0 && m.audio.paused){ m.audio.play().catch(function(){}); }
    });
    if(!fadeRaf) fadeRaf=requestAnimationFrame(fadeStep);
  }
  function fadeStep(){
    var moving=false;
    music.forEach(function(m){
      var tg=m.target||0, v=m.audio.volume;
      if(Math.abs(v-tg)>0.005){
        m.audio.volume = v + (tg-v)*0.08; moving=true;
      } else { m.audio.volume = tg; if(tg===0 && !m.audio.paused) m.audio.pause(); }
    });
    fadeRaf = moving ? requestAnimationFrame(fadeStep) : null;
  }

  // ---- Controls --------------------------------------------------------
  function play(){
    wantPlaying = true;
    bgStop(); // fade out background music when narration starts
    narr.play().then(function(){
      ensureMusic(); updateMusic();
      btnPlay.classList.add('is-playing');
      spk.classList.remove('is-paused');
      setPlayIcon(true);
      cancelAnimationFrame(rafId); rafId=requestAnimationFrame(tick);
    }).catch(function(){});
  }
  function pause(){
    wantPlaying = false;
    narr.pause();
    btnPlay.classList.remove('is-playing');
    spk.classList.add('is-paused');
    setPlayIcon(false);
    updateMusic();
  }
  function toggle(){ narr.paused ? play() : pause(); }
  function setPlayIcon(playing){
    btnPlayIcon.innerHTML = playing
      ? '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>'
      : '<path d="M7 4l13 8-13 8z"/>';
  }

  function seekFrac(f){
    var d = narr.duration||0;
    narr.currentTime = Math.max(0, Math.min(d-0.2, f*d));
    current=-1; tick();
  }
  function gotoPart(id){
    var p = PARTS.findIndex(function(x){return x.id===id;});
    seekFrac(PART_BOUNDS[p]);
    if(narr.paused) play();
  }

  // ---- Open / close ----------------------------------------------------
  function openTheatre(partId){
    if(!built){ buildEverything(); }
    theatre.classList.add('is-open');
    document.body.style.overflow='hidden';
    if(partId){ gotoPart(partId); }
    else {
      var saved = parseFloat(localStorage.getItem('kw_time')||'0');
      var d = narr.duration||382;
      narr.currentTime = (saved>2 && saved < d-2) ? saved : 0;
      current=-1; play();
    }
  }
  function closeTheatre(){
    theatre.classList.remove('is-open');
    document.body.style.overflow='';
    pause();
  }

  function buildEverything(){
    buildCues(narr.duration || 382);
    buildLayers();
    built = true;
    current=-1;
    setCue(0);
    applyKenBurns(0, 0);
  }

  // ---- Init ------------------------------------------------------------
  function init(){
    narr        = document.getElementById('narration');
    theatre     = document.getElementById('theatre');
    stage       = document.getElementById('stage');
    capChapter  = document.getElementById('capChapter');
    capText     = document.getElementById('capText');
    cardplate   = document.getElementById('cardplate');
    cardNum     = document.getElementById('cardNum');
    cardTitle   = document.getElementById('cardTitle');
    cardSub     = document.getElementById('cardSub');
    btnPlay     = document.getElementById('btnPlay');
    btnPlayIcon = document.getElementById('btnPlayIcon');
    scrub       = document.getElementById('scrub');
    scrubFill   = document.getElementById('scrubFill');
    scrubBuf    = document.getElementById('scrubBuf');
    timeNow     = document.getElementById('timeNow');
    timeTot     = document.getElementById('timeTot');
    chipsWrap   = document.getElementById('chips');
    spk         = document.getElementById('spk');

    setPlayIcon(false);

    narr.addEventListener('loadedmetadata', function(){
      timeTot.textContent = fmt(narr.duration);
      if(!built && theatre.classList.contains('is-open')) buildEverything();
    });
    narr.addEventListener('timeupdate', function(){
      localStorage.setItem('kw_time', narr.currentTime.toFixed(1));
      if(narr.paused){ timeNow.textContent=fmt(narr.currentTime); }
    });
    narr.addEventListener('ended', function(){ wantPlaying=false; pause(); });
    // watchdog: if the stream stalls and the browser pauses us before the
    // true end while the user still wants playback, resume automatically so
    // the narration always reaches 6:22
    narr.addEventListener('pause', function(){
      if(wantPlaying && !narr.ended && narr.currentTime < (narr.duration||1e9) - 0.4){
        narr.play().catch(function(){});
      }
    });
    narr.addEventListener('stalled', function(){
      if(wantPlaying) narr.play().catch(function(){});
    });
    narr.addEventListener('waiting', function(){
      if(wantPlaying) narr.play().catch(function(){});
    });
    narr.addEventListener('play', updateMusic);
    narr.addEventListener('pause', updateMusic);

    btnPlay.addEventListener('click', toggle);
    document.getElementById('btnBack').addEventListener('click', function(){ seekFrac((narr.currentTime-10)/(narr.duration||1)); });
    document.getElementById('btnFwd').addEventListener('click', function(){ seekFrac((narr.currentTime+10)/(narr.duration||1)); });
    document.getElementById('btnClose').addEventListener('click', closeTheatre);
    document.getElementById('btnMusic').addEventListener('click', function(){
      musicOn=!musicOn; this.classList.toggle('is-off',!musicOn);
      this.querySelector('span').textContent = musicOn?'Muzyka':'Wyciszona';
      updateMusic();
    });

    function scrubTo(e){
      var r=scrub.getBoundingClientRect();
      var x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
      seekFrac(Math.max(0,Math.min(1,x/r.width)));
    }
    var scrubbing=false;
    scrub.addEventListener('mousedown',function(e){scrubbing=true;scrubTo(e);});
    window.addEventListener('mousemove',function(e){if(scrubbing)scrubTo(e);});
    window.addEventListener('mouseup',function(){scrubbing=false;});
    scrub.addEventListener('touchstart',function(e){scrubTo(e);},{passive:true});
    scrub.addEventListener('touchmove',function(e){scrubTo(e);},{passive:true});

    chipsWrap.querySelectorAll('.chip').forEach(function(ch){
      ch.addEventListener('click', function(){ gotoPart(+ch.dataset.part); });
    });

    // openers
    document.querySelectorAll('[data-open]').forEach(function(el){
      el.addEventListener('click', function(){
        var p = el.dataset.open;
        openTheatre(p==='full'?0:+p);
      });
    });

    // keyboard
    window.addEventListener('keydown', function(e){
      if(!theatre.classList.contains('is-open')) return;
      if(e.code==='Space'){ e.preventDefault(); toggle(); }
      else if(e.code==='ArrowRight'){ seekFrac((narr.currentTime+10)/(narr.duration||1)); }
      else if(e.code==='ArrowLeft'){ seekFrac((narr.currentTime-10)/(narr.duration||1)); }
      else if(e.code==='Escape'){ closeTheatre(); }
    });

    // lightbox for codex
    var lb=document.getElementById('lightbox'), lbImg=document.getElementById('lbImg');
    var leaves=[].slice.call(document.querySelectorAll('.leaf')); var lbIdx=0;
    function showLb(i){ lbIdx=(i+leaves.length)%leaves.length; lbImg.src=leaves[lbIdx].dataset.full; lb.classList.add('is-open'); }
    leaves.forEach(function(lf,i){ lf.addEventListener('click',function(){showLb(i);}); });
    document.getElementById('lbPrev').addEventListener('click',function(){showLb(lbIdx-1);});
    document.getElementById('lbNext').addEventListener('click',function(){showLb(lbIdx+1);});
    document.getElementById('lbClose').addEventListener('click',function(){lb.classList.remove('is-open');});
    lb.addEventListener('click',function(e){ if(e.target===lb) lb.classList.remove('is-open'); });
    window.addEventListener('keydown',function(e){
      if(!lb.classList.contains('is-open'))return;
      if(e.code==='ArrowRight')showLb(lbIdx+1);
      else if(e.code==='ArrowLeft')showLb(lbIdx-1);
      else if(e.code==='Escape')lb.classList.remove('is-open');
    });
  }

  if(document.readyState!=='loading'){ init(); initBgMusic(); }
  else document.addEventListener('DOMContentLoaded', function(){ init(); initBgMusic(); });
})();
