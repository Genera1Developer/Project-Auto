file path: public/themes/particles.js
content: ```js
/* particlesJS.js v2.0.0 - https://github.com/VincentGarreau/particles.js */
(function (e, t, i, n, s, a, o) {
  function r(t, i) {
    var n = document.createElement(t);
    i && (n.textContent = i);
    return n;
  }
  function l(e, t, i) {
    e.addEventListener(t, i, !1);
  }
  function c(e, t, i) {
    e.removeEventListener(t, i, !1);
  }
  function h(e, t) {
    return e.getAttribute(t) || e.getAttribute(t, "true");
  }
  function u(e, t) {
    return "boolean" == typeof t ? !!h(e, t) : h(e, t);
  }
  function d(e, t) {
    for (var i in t) e.setAttribute(i, t[i]);
  }
  function p(e) {
    var t = {
      canvas: { el: e, w: e.offsetWidth, h: e.offsetHeight },
      cnt: 1,
      opt: {
        fpsLimit: 60,
        particles: {
          number: { value: 200, density: { enable: !0, value_area: 800 } },
          color: { value: "#fff" },
          shape: { value: "circle" },
          character: { value: [], fill: !1, font: "Verdana", fontSize: 10, style: "", weight: "400" },
          size: { value: 2, anim: { enable: !1, startValue: "random", minValue: 1, maxValue: "random" } },
          lineLinked: { enable: !0, distance: 100, color: "#fff", opacity: 1 },
          move: {
            enable: !0,
            speed: 2,
            direction: "none",
            random: !1,
            straight: !1,
            outModes: { default: "out", bottom: "out", top: "none", left: "out", right: "out" },
          },
          array: [],
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: !0, mode: "repulse" },
            onclick: { enable: !0, mode: "push" },
            resize: !0,
          },
          modes: {
            grab: { distance: 100, lineLinked: { opacity: 1 } },
            bubble: { distance: 200, size: 80, duration: 0.4 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
          mouse: {},
        },
        retina_detect: !1,
        fn: { interact: {}, modes: {}, vendors: {} },
        tmp: {},
      },
      plugins: [],
      deltaTime: 0,
      fpsLimit: 60,
      lastTick: 0,
      p: new Array(500),
    };
    var i = t.opt.particles;
    ("undefined" != typeof i.color ? i.color : {}).value,
      ("undefined" != typeof i.shape ? i.shape : {}).value,
      ("undefined" != typeof i.character ? i.character : {}).value,
      ("undefined" != typeof i.lineLinked ? i.lineLinked : {}).distance,
      ("undefined" != typeof i.move ? i.move : {}).enable,
      ("undefined" != typeof i.array ? i.array : []).length,
      0 == i.array.length &&
        ((i.number.value && 0 !== i.number.value) ||
          ((i.number.value = 200), (i.density.enable = !0), (i.density.value_area = 800)));
    return t;
  }
  function f(e, t) {
    var i = e.canvas.el.getContext("2d");
    null == i && alert("Sorry, your browser doesn't support canvas !");
    var n = e.retina_detect && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
    i.scale(n, n), i.clearRect(0, 0, e.canvas.w, e.canvas.h);
    for (var s = 0; s < e.cnt; s++) {
      var a = e.p[s].el;
      null !== a && (i.fillStyle = a.o.color, i.beginPath(), i.arc(a.x, a.y, a.radius * n, 0, 2 * Math.PI, !1), i.closePath(), i.fill());
    }
  }
  function m(e, t) {
    var i = 0;
    if (0 == t.length) return e[Math.floor(Math.random() * e.length)];
    for (var n = 0; n < t.length; n++) {
      var s = t[n];
      i += null === s ? 0 : e.indexOf(s);
    }
    return i >= e.length ? (i = Math.floor(Math.random() * e.length)) : i;
  }
  function v(e, t, i) {
    return null != t.character && t.character.value.length ? t.character.value.charCodeAt(m(e.character, t.character.value)) : i;
  }
  function y(e, t, i, n, s, a, o) {
    var r = e.canvas.el,
      l = ((r.offsetWidth, r.offsetHeight), 252 == (e.fpsLimit = a || 60) || 504 == e.fpsLimit ? 60 : e.fpsLimit);
    Math.round(1e3 / l);
    if (!e.tmp.target) {
      var c = {
        target: { x: t.x, y: t.y, radius: t.radius },
        position: { x: t.x, y: t.y },
        radius: t.radius,
        color: t.o.color,
        character: t.o.character ? t.o.character.value : "",
        font: t.o.character ? t.o.character.font : "",
        fontSize: t.o.character ? t.o.character.fontSize : undefined,
        fontStyle: t.o.character ? t.o.character.style : "",
        fontWeight: t.o.character ? t.o.character.weight : "",
        opacity: t.o.opacity,
      };
      o &&
        (c.target.x = s.position.x - r.offsetLeft, c.target.y = s.position.y - r.offsetTop || r.scrollTop, (e.tmp.target = c));
    }
    var h = -1;
    if (e.tmp.target) {
      var u = e.tmp.target;
      (h = null != u && 0 !== u.radius || 0 === u.radius ? Math.pow(u.target.x - n.x, 2) + Math.pow(u.target.y - n.y, 2) : -1) < Math.pow(u.radius, 2);
    }
    switch (((e.tmp.target && h) || (e.tmp.target = null), e.opt.particles.move.direction)) {
      case "top":
        n.y += e.opt.particles.move.speed;
        break;
      case "top-right":
        (n.x += e.opt.particles.move.speed), (n.y += e.opt.particles.move.speed);
        break;
      case "right":
        n.x += e.opt.particles.move.speed;
        break;
      case "bottom-right":
        (n.x += e.opt.particles.move.speed), (n.y -= e.opt.particles.move.speed);
        break;
      case "bottom":
        n.y -= e.opt.particles.move.speed;
        break;
      case "bottom-left":
        (n.x -= e.opt.particles.move.speed