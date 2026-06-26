/* ============================================================
   Pixel-art portrait engine v2 — chunky, flat, bold-outline
   retro RPG sprites (reference: low-res family pixel sprites).
   Square canvas: 48 x 48 art-pixels. Transparent background.
   Look: flat fills, 1 optional shadow tone, hard black outline
   around the whole silhouette + a few internal separators.
   ============================================================ */
(function (root) {
  'use strict';

  var S = 48;

  /* ---------- color helpers ---------- */
  function clamp(v){ return v<0?0:v>255?255:v|0; }
  function hex2rgb(h){ h=h.replace('#',''); if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]; }
  function rgb2hex(r,g,b){ return '#'+[r,g,b].map(function(x){var s=clamp(x).toString(16);return s.length<2?'0'+s:s;}).join(''); }
  function shade(hex,amt){ var c=hex2rgb(hex);
    if(amt>=0) return rgb2hex(c[0]+(255-c[0])*amt,c[1]+(255-c[1])*amt,c[2]+(255-c[2])*amt);
    return rgb2hex(c[0]*(1+amt),c[1]*(1+amt),c[2]*(1+amt)); }
  function mix(a,b,t){ var ca=hex2rgb(a),cb=hex2rgb(b); return rgb2hex(ca[0]+(cb[0]-ca[0])*t,ca[1]+(cb[1]-ca[1])*t,ca[2]+(cb[2]-ca[2])*t); }

  /* ---------- draw context with occupancy tracking ---------- */
  function makeDraw(ctx, px){
    var filled = new Uint8Array(S*S);   // any non-outline pixel
    function idx(x,y){ return y*S+x; }
    function raw(x,y,c){ if(x<0||y<0||x>=S||y>=S||!c)return; ctx.fillStyle=c; ctx.fillRect(x*px,y*px,px,px); }
    function p(x,y,c){ if(x<0||y<0||x>=S||y>=S||!c)return; ctx.fillStyle=c; ctx.fillRect(x*px,y*px,px,px); filled[idx(x,y)]=1; }
    function clear(x,y){ if(x<0||y<0||x>=S||y>=S)return; ctx.clearRect(x*px,y*px,px,px); filled[idx(x,y)]=0; }
    function span(y,xL,xR,c){ for(var x=xL;x<=xR;x++) p(x,y,c); }
    function rect(x,y,w,h,c){ for(var j=0;j<h;j++)for(var i=0;i<w;i++)p(x+i,y+j,c); }
    function hline(x,y,w,c){ for(var i=0;i<w;i++)p(x+i,y,c); }
    function vline(x,y,h,c){ for(var j=0;j<h;j++)p(x,y+j,c); }
    function isFilled(x,y){ return x>=0&&y>=0&&x<S&&y<S&&filled[idx(x,y)]; }
    return { p:p, raw:raw, clear:clear, span:span, rect:rect, hline:hline, vline:vline,
             isFilled:isFilled, filled:filled, px:px, S:S, ctx:ctx };
  }

  // base face half-width profile (top -> chin), scaled by faceW
  var FACE = [5,6,7,7,7,7,7,7,7,6,6,5,5,4,3];

  function faceGeom(cfg){
    var cx = 24;
    var top = cfg.faceTop != null ? cfg.faceTop : 12;
    var fw = cfg.faceW != null ? cfg.faceW : 1;
    var rows = {};
    for(var i=0;i<FACE.length;i++){
      var hw = Math.max(2, Math.round(FACE[i]*fw));
      var y = top+i;
      rows[y] = [cx-hw, cx+hw];
    }
    return { cx:cx, top:top, chin:top+FACE.length-1, rows:rows, hwAt:function(y){return rows[y]?(rows[y][1]-rows[y][0])/2:0;} };
  }

  /* ---------- outer silhouette outline ---------- */
  function outlinePass(d, outline){
    var add = [];
    for(var y=0;y<S;y++) for(var x=0;x<S;x++){
      if(d.isFilled(x,y)) continue;
      if(d.isFilled(x-1,y)||d.isFilled(x+1,y)||d.isFilled(x,y-1)||d.isFilled(x,y+1)
         ||d.isFilled(x-1,y-1)||d.isFilled(x+1,y-1)||d.isFilled(x-1,y+1)||d.isFilled(x+1,y+1)){
        add.push([x,y]);
      }
    }
    for(var k=0;k<add.length;k++) d.raw(add[k][0],add[k][1],outline);
  }

  /* ============================================================
     MAIN
     ============================================================ */
  function drawBust(ctx, px, cfg){
    var d = makeDraw(ctx, px);
    var OL = cfg.outline || '#17120e';
    var skin = cfg.skin || '#e0ac82';
    var skinSh = cfg.skinSh || shade(skin,-0.16);
    var fm = faceGeom(cfg);
    var helpers = { shade:shade, mix:mix, OL:OL, fm:fm, skin:skin, skinSh:skinSh, HW:HW, ACC:ACC, outlinePass:outlinePass, faceGeom:faceGeom };
    if(cfg.render){ cfg.render(d, helpers); return; }

    // ---- behind-head accessories (staff, etc.) ----
    if(cfg.back) cfg.back(d, helpers);

    // ---- body / garment ----
    var g = cfg.garment || { base:'#6a4b35', sh:'#523a28' };
    var bodyTop = fm.chin + 3;          // y where shoulders begin
    for(var y=bodyTop; y<S; y++){
      var t = (y-bodyTop)/(S-bodyTop);
      var hw = Math.round(7 + t*16);
      d.span(y, fm.cx-hw, fm.cx+hw, g.base);
      // single soft shadow column on the left third
      d.p(fm.cx-hw, y, g.sh); d.p(fm.cx-hw+1, y, g.sh);
      d.p(fm.cx+hw, y, shade(g.base,-0.08));
    }

    // ---- neck ----
    d.rect(fm.cx-2, fm.chin+1, 5, 3, skin);
    d.p(fm.cx-2, fm.chin+1, skinSh); d.p(fm.cx-2, fm.chin+2, skinSh);
    // neck shadow under chin
    d.span(fm.chin+1, fm.cx-1, fm.cx+1, skinSh);

    // ---- face fill ----
    for(var fy=fm.top; fy<=fm.chin; fy++){ var r=fm.rows[fy]; d.span(fy, r[0], r[1], skin); }
    // tiny form: 1-col shadow on the left cheek + soft right
    for(var sy=fm.top+1; sy<=fm.chin; sy++){ var rr=fm.rows[sy]; d.p(rr[0], sy, skinSh); }
    if(cfg.blush!==false){ d.p(fm.rows[fm.top+8][0]+1, fm.top+8, mix(skin,'#c87a64',0.45)); d.p(fm.rows[fm.top+8][1]-1, fm.top+8, mix(skin,'#c87a64',0.4)); }

    // ---- ears ----
    var eY = fm.top+7;
    d.p(fm.rows[eY][0]-1, eY, skin); d.p(fm.rows[eY][1]+1, eY, skin);

    // ---- hair (behind/around + on top) ----
    if(cfg.hair) drawHair(d, fm, cfg.hair, OL);

    // ---- beard ----
    if(cfg.beard) drawBeard(d, fm, cfg.beard, skin, OL);

    // ---- features ----
    drawFeatures(d, fm, cfg, skin, skinSh, OL);

    // ---- headwear ----
    if(cfg.headwear) cfg.headwear(d, helpers);

    // ---- collar detail ----
    if(cfg.collar) cfg.collar(d, helpers);

    // ---- outer silhouette outline ----
    outlinePass(d, OL);

    // ---- foreground items (drawn over everything, with own mini-outline) ----
    if(cfg.extras) cfg.extras(d, helpers);
  }

  /* ---------- hair ---------- */
  function drawHair(d, fm, hair, OL){
    var c=hair.color, hi=shade(c,0.22), sh=shade(c,-0.22);
    var style=hair.style||'short';
    var top=fm.top, cx=fm.cx;
    if(style==='bald') return;

    if(style==='tonsure'){
      // side ring only, bald crown
      for(var y=top+2;y<=top+9;y++){ var r=fm.rows[y]; if(!r)continue;
        d.p(r[0]-1,y,c); d.p(r[0],y,c); d.p(r[1]+1,y,c); d.p(r[1],y,c); }
      return;
    }

    // crown cap
    var cap = (style==='receding') ? top+1 : top+2;
    for(var yy=top-3; yy<=cap+1; yy++){
      var base = fm.rows[Math.max(top,Math.min(yy,fm.chin))];
      var hw = (yy<top) ? (fm.hwAt(top)-(top-yy)) : fm.hwAt(top)+1;
      hw = Math.max(2, Math.round(hw));
      if(style==='receding' && yy<=top) hw -= 1;
      d.span(yy, cx-hw, cx+hw, c);
    }
    // top highlight row
    d.span(top-2, cx-2, cx+1, hi);
    // hairline shaping
    if(style==='receding'){
      d.span(top+2, cx-6, cx-3, c); d.span(top+2, cx+3, cx+6, c);
    }
    // sides
    var sideBottom = style==='long' ? fm.chin+8 : (style==='medium' ? fm.top+11 : fm.top+6);
    for(var s=top+1; s<=sideBottom; s++){
      var sr = fm.rows[Math.min(s,fm.chin)] || fm.rows[fm.chin];
      d.p(sr[0]-1, s, c); if(s<=top+3) d.p(sr[0], s, c);
      d.p(sr[1]+1, s, c); if(s<=top+3) d.p(sr[1], s, c);
      if(style==='long'){ d.p(sr[0]-2, s, sh); d.p(sr[1]+2, s, sh); }
    }
    // internal hairline separator (dark) between hair and forehead
    var hlY = style==='receding' ? top+3 : top+2;
    var hr = fm.rows[hlY];
    if(style==='receding'){ d.p(cx-6,hlY,OL); d.p(cx-5,hlY,OL); d.p(cx+5,hlY,OL); d.p(cx+6,hlY,OL); }
    else { for(var x=hr[0];x<=hr[1];x++) d.p(x, hlY, mix(c,'#000',0.45)); }
  }

  /* ---------- beard ---------- */
  function drawBeard(d, fm, beard, skin, OL){
    var c=beard.color, sh=shade(c,-0.2);
    var style=beard.style;
    var cx=fm.cx;
    if(style==='mustache'||style==='mustachL') return;
    if(style==='short'){
      for(var y=fm.top+9; y<=fm.chin+1; y++){ var r=fm.rows[Math.min(y,fm.chin)];
        d.p(r[0],y,c); d.p(r[0]+1,y,c); d.p(r[1],y,c); d.p(r[1]-1,y,c);
        if(y>=fm.chin-1) d.span(y, r[0], r[1], c); }
      return;
    }
    // full / long / forked
    var bTop=fm.top+8;
    var bBottom = (style==='long'||style==='forked') ? fm.chin+5 : fm.chin+2;
    for(var by=bTop; by<=bBottom; by++){
      var rr = fm.rows[Math.min(by,fm.chin)];
      var hw = (by<=fm.chin) ? (rr[1]-rr[0])/2 : Math.max(2,(fm.rows[fm.chin][1]-fm.rows[fm.chin][0])/2-(by-fm.chin));
      var xL=Math.round(cx-hw), xR=Math.round(cx+hw);
      if(by>=fm.top+9 && by<=fm.top+10){ d.span(by,xL,cx-2,c); d.span(by,cx+2,xR,c); } // mouth gap
      else d.span(by,xL,xR,c);
    }
    if(style==='forked'){ d.clear(cx, bBottom); d.clear(cx, bBottom-1); }
  }

  /* ---------- features ---------- */
  function drawFeatures(d, fm, cfg, skin, skinSh, OL){
    var cx=fm.cx, eyeY=fm.top+6;
    var lx=cx-3, rx=cx+3;
    var eye=cfg.eyeColor||'#2b1d12';
    var mood=cfg.mood||'calm';

    // brows
    var browC = cfg.browColor || (cfg.hair?shade(cfg.hair.color,-0.15):'#4a3018');
    if(mood==='stern'){ d.p(lx-1,eyeY-2,browC); d.p(lx,eyeY-2,browC); d.p(lx+1,eyeY-1,browC);
                        d.p(rx+1,eyeY-2,browC); d.p(rx,eyeY-2,browC); d.p(rx-1,eyeY-1,browC); }
    else if(mood==='sad'){ d.p(lx-1,eyeY-1,browC); d.p(lx,eyeY-2,browC);
                           d.p(rx+1,eyeY-1,browC); d.p(rx,eyeY-2,browC); }
    else if(cfg.brows!==false){ d.p(lx-1,eyeY-2,browC); d.p(lx,eyeY-2,browC);
                                d.p(rx,eyeY-2,browC); d.p(rx+1,eyeY-2,browC); }

    // eyes — 1px wide, 2px tall dark
    function drawEye(ex){
      d.p(ex,eyeY,eye); d.p(ex,eyeY+1,eye);
      if(cfg.eyeWhite){ d.p(ex+1,eyeY,'#f4eee0'); }
    }
    drawEye(lx); drawEye(rx);
    if(mood==='sly'){ d.p(lx-1,eyeY,skinSh); d.p(rx+1,eyeY,skinSh); }

    // nose — 1px shadow
    d.p(cx, eyeY+3, skinSh);

    // mouth
    var my = cfg.mouthY || (fm.top+10);
    if(mood==='gentle'){ d.p(cx-1,my+1,'#8a4636'); d.p(cx,my+1,'#8a4636'); d.p(cx+1,my+1,'#8a4636'); d.p(cx-2,my,'#8a4636'); d.p(cx+2,my,'#8a4636'); }
    else if(mood==='stern'||mood==='proud'){ d.span(my,cx-2,cx+2,'#7c3e30'); }
    else if(mood==='sad'){ d.span(my,cx-1,cx+1,'#7c3e30'); d.p(cx-2,my-1,'#7c3e30'); d.p(cx+2,my-1,'#7c3e30'); }
    else { d.span(my,cx-2,cx+1,'#7c3e30'); }

    // mustache over mouth if requested
    if(cfg.beard && (cfg.beard.style==='full'||cfg.beard.style==='mustache'||cfg.beard.style==='mustachL'||cfg.beard.style==='long'||cfg.beard.style==='forked') && cfg.beard.mustache!==false){
      var mc=cfg.beard.color;
      if(cfg.beard.style==='mustachL'){ // big szlachta handlebar
        d.span(my-1, cx-4, cx+4, mc); d.span(my, cx-4, cx-2, mc); d.span(my, cx+2, cx+4, mc);
        d.p(cx-5,my,mc); d.p(cx+5,my,mc); d.p(cx-5,my+1,mc); d.p(cx+5,my+1,mc);
      } else {
        d.span(my-1, cx-3, cx+3, mc); d.p(cx-3,my,mc); d.p(cx+3,my,mc);
      }
    }
  }

  /* ============================================================
     HEADWEAR
     ============================================================ */
  var HW = {
    crown: function(d, fm, gold, opts){
      gold=gold||'#e8c352'; var ghi=shade(gold,0.3), gsh=shade(gold,-0.3);
      var y0=fm.top, hw=fm.hwAt(fm.top)+1, xL=fm.cx-hw, xR=fm.cx+hw;
      d.span(y0, xL, xR, gold); d.span(y0-1, xL, xR, gold);
      d.hline(xL, y0-1, xR-xL+1, ghi);
      var pts = opts&&opts.points || [-hw,-Math.round(hw/2),0,Math.round(hw/2),hw];
      for(var i=0;i<pts.length;i++){ var x=fm.cx+pts[i]; d.p(x,y0-2,gold); d.p(x,y0-3,gold); }
      // gems
      d.p(fm.cx,y0,'#c0392b'); d.p(fm.cx-Math.round(hw/2),y0,'#2e6da4'); d.p(fm.cx+Math.round(hw/2),y0,'#2e9e5b');
    },
    imperial: function(d, fm, gold){
      gold=gold||'#f0cf63'; var ghi=shade(gold,0.32), gsh=shade(gold,-0.3);
      var y0=fm.top, hw=fm.hwAt(fm.top)+1, xL=fm.cx-hw, xR=fm.cx+hw;
      d.span(y0,xL,xR,gold); d.span(y0-1,xL,xR,gold); d.hline(xL,y0-1,xR-xL+1,ghi);
      for(var x=xL+1;x<=xR-1;x+=2) d.p(x,y0,(x%4===0)?'#c0392b':'#2e6da4');
      // arch
      for(var k=0;k<=(xR-xL);k++){ var ax=xL+k; var ay=y0-2-Math.round(4*Math.sin(Math.PI*k/(xR-xL))); d.p(ax,ay,gold); }
      // orb + cross
      d.p(fm.cx,y0-7,gold); d.p(fm.cx,y0-8,gold); d.p(fm.cx-1,y0-7,gold); d.p(fm.cx+1,y0-7,gold);
    },
    mitre: function(d, fm, cloth){
      cloth=cloth||'#f2ead2'; var csh=shade(cloth,-0.14);
      var y0=fm.top+1, peak=Math.max(1, fm.top-11), hwBase=fm.hwAt(fm.top)+1;
      for(var y=y0;y>=peak;y--){ var t=(y0-y)/(y0-peak); var hw=Math.max(1,Math.round(hwBase*(1-t)+1)); d.span(y,fm.cx-hw,fm.cx+hw,cloth); d.p(fm.cx-hw,y,csh); }
      // orphrey band + cross
      var bc='#c8a24a'; d.vline(fm.cx,peak,y0-peak+1,bc);
      d.p(fm.cx,fm.top-2,'#b22'); d.p(fm.cx,fm.top-1,'#b22'); d.p(fm.cx-1,fm.top-1,'#b22'); d.p(fm.cx+1,fm.top-1,'#b22');
    },
    diadem: function(d, fm, metal){
      metal=metal||'#c9a24b'; var mhi=shade(metal,0.3);
      var y0=fm.top+1, hw=fm.hwAt(fm.top)+1;
      d.span(y0,fm.cx-hw,fm.cx+hw,metal); d.hline(fm.cx-hw,y0,2*hw+1,mhi);
      d.p(fm.cx,y0,'#b22');
    },
    hood: function(d, fm, cloth){
      cloth=cloth||'#6b5235';
      for(var y=fm.top-2; y<=fm.chin+2; y++){
        var r=fm.rows[Math.max(fm.top,Math.min(y,fm.chin))]||fm.rows[fm.chin];
        var hw=(y<fm.top+1)?fm.hwAt(fm.top)+1-(fm.top+1-y):(r[1]-r[0])/2+2;
        hw=Math.max(2,Math.round(hw));
        if(y<fm.top+1){ d.span(y,fm.cx-hw,fm.cx+hw,cloth); }
        d.p(fm.cx-hw,y,cloth); d.p(fm.cx-hw-1,y,cloth);
        d.p(fm.cx+hw,y,cloth); d.p(fm.cx+hw+1,y,cloth);
      }
    },
    veil: function(d, fm, cloth){
      cloth=cloth||'#efe7d6'; var csh=shade(cloth,-0.1);
      for(var y=fm.top-2; y<=fm.chin+6; y++){
        var r=fm.rows[Math.max(fm.top,Math.min(y,fm.chin))]||fm.rows[fm.chin];
        var hw=(y<fm.top+1)?fm.hwAt(fm.top)+1-(fm.top+1-y):(r[1]-r[0])/2+2+(y>fm.chin?(y-fm.chin):0);
        hw=Math.max(2,Math.round(hw));
        if(y<fm.top+1){ d.span(y,fm.cx-hw,fm.cx+hw,cloth); }
        d.p(fm.cx-hw,y,cloth); d.p(fm.cx-hw-1,y,csh);
        d.p(fm.cx+hw,y,cloth); d.p(fm.cx+hw+1,y,csh);
      }
    }
  };

  /* ============================================================
     ACCESSORIES
     ============================================================ */
  var ACC = {
    crosier: function(d, x, metal){      // pastoral staff, drawn behind the figure
      metal=metal||'#d8b24a';
      for(var y=7;y<S;y++) d.p(x,y,metal);
      d.p(x+1,6,metal); d.p(x+2,6,metal); d.p(x+2,7,metal); d.p(x+1,8,metal); // crook
    },
    crossNeck: function(d, x, y, metal){ // small cross on the chest
      metal=metal||'#e8c352';
      d.p(x,y,metal); d.p(x,y+1,metal); d.p(x,y+2,metal); d.p(x-1,y+1,metal); d.p(x+1,y+1,metal);
    },
    bookQuill: function(d, OL){          // open book lower-right + quill
      d.rect(31,38,13,9,'#caa56a'); d.rect(32,39,5,7,'#f3e8cf'); d.rect(38,39,5,7,'#f3e8cf');
      d.vline(37,38,9,'#8a6a3a');
      for(var l=0;l<3;l++){ d.hline(33,40+l*2,3,'#b8a07a'); d.hline(39,40+l*2,3,'#b8a07a'); }
      d.p(41,33,'#efe7d6'); d.p(40,34,'#efe7d6'); d.p(39,35,'#efe7d6'); d.p(38,36,'#cfc6b2'); // quill
    },
    mace: function(d, x){                // mace, drawn behind
      for(var y=30;y<S;y++) d.p(x,y,'#7a5a2a');
      d.rect(x-2,27,5,4,'#caa24a');
    }
  };

  root.PA = { S:S, drawBust:drawBust, HW:HW, ACC:ACC, shade:shade, mix:mix };

  /* ============================================================
     EXTRA HEADWEAR (missions 2-5)
     ============================================================ */
  HW.cap = function(d, fm, cloth){          // soft round cap (workers/settlers)
    cloth=cloth||'#6a5a40'; var csh=shade(cloth,-0.2);
    var y0=fm.top+1, hw=fm.hwAt(fm.top)+1;
    for(var y=y0;y>=fm.top-3;y--){ var t=(y0-y)/4; var w=Math.round(hw*(1-t*0.5)); d.span(y,fm.cx-w,fm.cx+w,cloth); }
    d.hline(fm.cx-hw,y0,2*hw+1,csh);
  };
  HW.skullcap = function(d, fm, cloth){     // modest skullcap / yarmulke on crown
    cloth=cloth||'#3a3a44';
    var y0=fm.top, hw=fm.hwAt(fm.top);
    for(var y=y0;y>=fm.top-2;y--){ var t=(y0-y)/3; var w=Math.round((hw-1)*(1-t)); d.span(y,fm.cx-w,fm.cx+w,cloth); }
  };
  HW.brimHat = function(d, fm, cloth, opts){ // brimmed merchant/burgher hat
    cloth=cloth||'#5a3a2a'; var csh=shade(cloth,-0.22), chi=shade(cloth,0.15);
    var hw=fm.hwAt(fm.top)+1;
    // crown of hat
    for(var y=fm.top-1;y>=fm.top-5;y--){ var w=hw-1; d.span(y,fm.cx-w,fm.cx+w,cloth); }
    d.span(fm.top-5,fm.cx-(hw-1),fm.cx+(hw-1),chi);
    // brim
    d.span(fm.top-1,fm.cx-hw-2,fm.cx+hw+2,cloth);
    d.span(fm.top,fm.cx-hw-2,fm.cx+hw+2,csh);
    if(opts&&opts.feather){ d.p(fm.cx+hw+1,fm.top-4,opts.feather); d.p(fm.cx+hw+1,fm.top-5,opts.feather); d.p(fm.cx+hw,fm.top-6,opts.feather); }
  };
  HW.biret = function(d, fm, cloth){        // academic square cap (biretta)
    cloth=cloth||'#2a2a30'; var chi=shade(cloth,0.18);
    var hw=fm.hwAt(fm.top)+1, y0=fm.top;
    d.span(y0,fm.cx-hw,fm.cx+hw,cloth); d.span(y0-1,fm.cx-hw,fm.cx+hw,cloth);
    d.span(y0-2,fm.cx-hw-1,fm.cx+hw+1,cloth); // square flat top overhang
    d.span(y0-3,fm.cx-hw-1,fm.cx+hw+1,cloth);
    d.hline(fm.cx-hw-1,y0-3,2*hw+3,chi);
    d.p(fm.cx,y0-4,cloth); // little tuft
  };
  HW.furHat = function(d, fm, fur, opts){   // fur cap / czapa / kolpak
    fur=fur||'#4a3526'; var fhi=shade(fur,0.2), fsh=shade(fur,-0.25);
    var hw=fm.hwAt(fm.top)+1;
    var tall = opts&&opts.tall ? 7 : 4;
    for(var y=fm.top;y>=fm.top-tall;y--){ var w=hw; for(var x=fm.cx-w;x<=fm.cx+w;x++) d.p(x,y, ((x+y)%2===0)?fur:( (x+y)%3===0?fhi:fsh)); }
    d.span(fm.top+1,fm.cx-hw,fm.cx+hw,fur);
    if(opts&&opts.band){ d.span(fm.top,fm.cx-hw,fm.cx+hw,opts.band); }
    if(opts&&opts.jewel){ d.p(fm.cx,fm.top-1,opts.jewel); }
    if(opts&&opts.feather){ d.p(fm.cx+hw,fm.top-tall,opts.feather); d.p(fm.cx+hw,fm.top-tall-1,opts.feather); d.p(fm.cx+hw-1,fm.top-tall-2,opts.feather); }
  };
  HW.wig = function(d, fm, color){          // 18th-c. powdered wig (rolled sides)
    color=color||'#e6e2d8'; var csh=shade(color,-0.12);
    var hw=fm.hwAt(fm.top)+1;
    // top mass
    for(var y=fm.top-3;y<=fm.top+1;y++){ var w=hw+1; d.span(y,fm.cx-w,fm.cx+w,color); }
    d.span(fm.top-3,fm.cx-3,fm.cx+2,shade(color,0.1));
    // side rolls (curls) down the cheeks
    for(var s=fm.top+1;s<=fm.top+9;s++){ var r=fm.rows[Math.min(s,fm.chin)];
      d.p(r[0]-2,s,color); d.p(r[0]-1,s,color); d.p(r[1]+1,s,color); d.p(r[1]+2,s,color);
      if(s%2===0){ d.p(r[0]-2,s,csh); d.p(r[1]+2,s,csh); } }
  };
  HW.hungarianCrown = function(d, fm, gold){ // crown with bent cross (Hungary)
    HW.crown(d, fm, gold||'#eccb55', { points:[-fm.hwAt(fm.top),-2,0,2,fm.hwAt(fm.top)] });
    var y0=fm.top;
    d.p(fm.cx,y0-4,'#eccb55'); d.p(fm.cx,y0-5,'#eccb55'); d.p(fm.cx+1,y0-5,'#eccb55'); // bent cross
  };
  HW.queenCrown = function(d, fm, gold){     // small jeweled crown for queens
    gold=gold||'#ecc94a'; var ghi=shade(gold,0.3);
    var y0=fm.top, hw=fm.hwAt(fm.top);
    d.span(y0,fm.cx-hw,fm.cx+hw,gold); d.hline(fm.cx-hw,y0,2*hw+1,ghi);
    var pts=[-hw,-2,0,2,hw];
    for(var i=0;i<pts.length;i++){ d.p(fm.cx+pts[i],y0-1,gold); if(i%2) d.p(fm.cx+pts[i],y0-1,'#c0392b'); }
    d.p(fm.cx,y0,'#2e6da4');
  };
  HW.helmet = function(d, fm, metal, opts){  // knight/hussar helmet (szyszak)
    metal=metal||'#b8bcc4'; var mhi=shade(metal,0.25), msh=shade(metal,-0.3);
    var hw=fm.hwAt(fm.top)+1;
    for(var y=fm.top+2;y>=fm.top-5;y--){ var t=(fm.top+2-y)/8; var w=Math.round(hw*(1-t*0.4)); d.span(y,fm.cx-w,fm.cx+w,metal); }
    d.vline(fm.cx-2,fm.top-5,8,mhi);          // ridge highlight
    d.span(fm.top+2,fm.cx-hw,fm.cx+hw,msh);   // brow rim
    d.vline(fm.cx,fm.top+3,5,metal);          // nasal guard
    d.p(fm.cx,fm.top+1,metal);
    if(opts&&opts.plume){ d.p(fm.cx,fm.top-6,opts.plume); d.p(fm.cx,fm.top-7,opts.plume); d.p(fm.cx+1,fm.top-7,opts.plume); }
  };
  HW.frenchCap = function(d, fm, cloth, jewel){ // small renaissance/french bonnet
    cloth=cloth||'#2a2030';
    var hw=fm.hwAt(fm.top)+1;
    for(var y=fm.top;y>=fm.top-3;y--){ var w=hw; d.span(y,fm.cx-w,fm.cx+w,cloth); }
    d.span(fm.top-3,fm.cx-hw,fm.cx+hw,shade(cloth,0.15));
    if(jewel){ d.p(fm.cx+hw-1,fm.top-1,jewel); }
    // small feather
    d.p(fm.cx-hw,fm.top-3,'#d8d0e0'); d.p(fm.cx-hw,fm.top-4,'#d8d0e0');
  };

  /* ============================================================
     EXTRA ACCESSORIES
     ============================================================ */
  ACC.scroll = function(d, x, y){            // rolled document held
    d.rect(x,y,3,7,'#ece0c2'); d.p(x,y,'#caa56a'); d.p(x+2,y,'#caa56a');
    d.p(x,y+7,'#caa56a'); d.p(x+2,y+7,'#caa56a');
  };
  ACC.coin = function(d, x, y){              // gold coin
    d.rect(x,y,3,3,'#e8c352'); d.p(x+1,y+1,'#fbe79a'); d.p(x,y,'#bf9a35'); d.p(x+2,y+2,'#bf9a35');
  };
  ACC.scale = function(d, x, y){             // merchant scale
    d.vline(x,y,5,'#8a6a3a'); d.hline(x-3,y,7,'#8a6a3a');
    d.p(x-3,y+1,'#caa24a'); d.p(x-3,y+2,'#caa24a'); d.p(x+3,y+1,'#caa24a'); d.p(x+3,y+2,'#caa24a');
  };
  ACC.banner = function(d, x, pole, flag){   // proporzec: pole + small flag
    pole=pole||'#7a5a2a'; flag=flag||'#b03030';
    for(var y=4;y<S;y++) d.p(x,y,pole);
    d.rect(x+1,5,7,6,flag); d.p(x+8,6,flag); d.p(x+8,9,flag); // swallow-tail hint
    d.p(x+4,8,shade(flag,0.3));
  };
  ACC.wings = function(d, hi){               // hussar wings behind both shoulders
    var f='#f2efe6', fsh='#cfc8b8';
    [[6,1],[41,-1]].forEach(function(p){
      var bx=p[0], dir=p[1];
      for(var k=0;k<11;k++){ var wy=14+k; var wx=bx + dir*Math.round(3*Math.sin(Math.PI*k/14));
        d.p(wx,wy,f); d.p(wx+dir,wy,fsh);
        if(k%2===0){ d.p(wx,wy,f); d.p(wx-dir,wy,fsh); } }
      d.vline(bx,13,12,'#caa24a'); // wing spine
    });
  };
  ACC.sabreHilt = function(d, x){            // sabre hilt at the shoulder
    d.rect(x,34,2,8,'#8a6a3a'); d.rect(x-1,33,4,2,'#caa24a'); d.p(x,32,'#e8c352');
  };
  ACC.bow = function(d, x){                  // curved bow behind shoulder
    for(var k=0;k<16;k++){ var by=18+k; var bx=x+Math.round(4*Math.sin(Math.PI*k/16)); d.p(bx,by,'#7a4a22'); }
    for(var y=18;y<34;y++) d.p(x-1,y,'#b8a06a'); // string
  };
  ACC.scythe = function(d, x){               // kosa upright (na sztorc), behind
    for(var y=6;y<S;y++){ d.p(x,y,'#6a4a28'); d.p(x+1,y,'#7a5a34'); } // snath
    // blade rising from the top
    var blade=[[0,5],[1,4],[2,3],[3,2],[4,2],[5,2],[6,3]];
    for(var i=0;i<blade.length;i++){ d.p(x+blade[i][0],blade[i][1],'#c8ccd2'); d.p(x+blade[i][0],blade[i][1]+1,'#9aa0a8'); }
  };

  /* ============================================================
     EXTRA COLLARS / TORSO DETAIL
     ============================================================ */
  ACC.ruff = function(d, fm, cloth){         // white lace ruff collar
    cloth=cloth||'#f4f0e6'; var csh=shade(cloth,-0.12);
    var y0=fm.chin+2;
    for(var x=fm.cx-7;x<=fm.cx+7;x++){ d.p(x,y0,cloth); d.p(x,y0+1, (x%2===0)?cloth:csh); }
    d.span(y0-1,fm.cx-5,fm.cx+5,cloth);
  };
  ACC.laceCollar = function(d, fm, cloth){   // flat white collar
    cloth=cloth||'#efe9da';
    var y0=fm.chin+2;
    d.span(y0,fm.cx-5,fm.cx+5,cloth); d.p(fm.cx-5,y0+1,cloth); d.p(fm.cx+5,y0+1,cloth);
    d.span(y0+1,fm.cx-4,fm.cx-2,cloth); d.span(y0+1,fm.cx+2,fm.cx+4,cloth);
  };
  ACC.gorget = function(d, fm, metal){       // armor neck/shoulder plate
    metal=metal||'#aeb4be'; var mhi=shade(metal,0.25), msh=shade(metal,-0.3);
    var y0=fm.chin+2;
    for(var y=y0;y<=y0+3;y++){ var w=8+(y-y0)*3; d.span(y,fm.cx-w,fm.cx+w,metal); d.hline(fm.cx-w,y,2*w+1,(y===y0)?mhi:metal); d.p(fm.cx-w,y,msh); d.p(fm.cx+w,y,msh); }
    d.p(fm.cx,y0+1,mhi);
  };
  ACC.ermine = function(d, fm){              // white ermine collar with black spots
    var y0=fm.chin+2;
    for(var y=y0;y<=y0+3;y++){ var w=7+(y-y0)*3; d.span(y,fm.cx-w,fm.cx+w,'#f2efe6'); }
    d.p(fm.cx-4,y0+1,'#2a2620'); d.p(fm.cx+3,y0+2,'#2a2620'); d.p(fm.cx,y0+3,'#2a2620');
  };
  ACC.sash = function(d, color, medal){      // order sash across the chest + medal
    color=color||'#2e5a9e';
    for(var k=0;k<14;k++){ var x=14+k; var y=30+k; d.p(x,y,color); d.p(x+1,y,shade(color,0.2)); }
    if(medal!==false){ d.rect(20,36,3,3,'#e8c352'); d.p(21,37,'#c0392b'); }
  };

})(typeof window!=='undefined'?window:this);
