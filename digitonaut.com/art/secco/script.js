var c = document.getElementById('canv');
var $ = c.getContext('2d');

(function() {
  var s = window.innerWidth/2;
  var h = window.innerHeight/2;
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  $.miterLimit = .1;

  var arr = [];
  var idx = -1;
  var p = {
    x: s,
    y: s / 1.5
  };
  var int;
  var r = 0.005;
  var sz = 8;

  var crv = .1;
  var circ = 8;
  var p3 = -.05;
  var p4 = .5;

  var f1 = 250;
  var f1d = true;
  var stop = true;
  var img;
  var u = 0;

  function add(p, q) {
    return {
      x: p.x + q.x,
      y: p.y + q.y
    };
  }

  function cart(r, a) {
    return {
      x: Math.cos(a) * r,
      y: Math.sin(a) * r
    };
  }

  function coord(ti, r) {
    idx++;
    if (!arr[idx]) arr[idx] = 0;
    arr[idx] += ti;
    return cart(r, arr[idx]);
  }

  $.fillStyle = 'hsla(0,0%,10%,1)';
  $.fillRect(0, 0, c.width, c.height);

  function draw() {
    u -= .3;
    var rp = coord(r, sz);
    $.drawImage(c, 1, 0);
    $.fillStyle = 'hsla(0,0%,10%,.001)';
    $.save();
    $.beginPath();
    $.moveTo(p.x, p.y);
    $.lineWidth = 4;
    $.shadowColor = 'hsla(0,0%,10%,.1)';
    $.shadowBlur = 6;
    for (var i = 0; i < 127; i++) {
      idx = -1;
      p = add(p, add(coord(crv, circ), add(coord(p3, rp.x), coord(p4, rp.y))));
      $.lineTo(p.x, p.y);
    }
    $.strokeStyle = 'hsla(' + u + ',100%,55%, 1)';
    $.closePath();
    $.stroke();
    $.restore();
  }

  function msp(e) {
    return {
      x: ((e.clientX - c.offsetLeft) - h) / h,
      y: ((e.clientY - c.offsetTop) - h) / h
    };
  }
 
  function go() {
    window.requestAnimationFrame(go);
    draw();
  }
  window.addEventListener('mousemove', function(e) {
    var p = msp(e);
    r = .01 * (1 - Math.abs(p.y));
    crv = 0.1 + .00025 * p.x;
  }, false);

  window.addEventListener('resize',function(){
    var s = window.innerWidth/2;
    var h = window.innerHeight/2;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    $.miterLimit = .1;
    $.fillStyle = 'hsla(0,0%,10%,1)';
    $.fillRect(0, 0, c.width, c.height);
  }, false);
go();
})();