!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.particlesJS = t())
    : (e.particlesJS = t());
})(this, function () {
  return function () {
    "use strict";
    var e = {
        particles: {
          number: { value: 100, density: { enable: !0, value_area: 800 } },
          color: { value: "#2ecc71" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 },
            image: { src: "img/github.svg", width: 100, height: 100 },
          },
          opacity: {
            value: 0.7,
            random: !0,
            anim: { enable: !1, speed: 1, opacity_min: 0.3, sync: !1 },
          },
          size: {
            value: 3,
            random: !0,
            anim: { enable: !1, speed: 40, size_min: 0.1, sync: !1 },
          },
          line_linked: {
            enable: !0,
            distance: 150,
            color: "#3498db",
            opacity: 0.6,
            width: 1,
          },
          move: {
            enable: !0,
            speed: 3,
            direction: "none",
            random: !0,
            straight: !1,
            out_mode: "out",
            bounce: !1,
            attract: { enable: !1, rotateX: 600, rotateY: 1200 },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: !0, mode: "grab" },
            onclick: { enable: !0, mode: "push" },
            resize: !0,
          },
          modes: {
            grab: { distance: 150, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 0.8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: !0,
      },
      t = function () {
        if (window.particlesJS)
          window.particlesJS("particles-js", e);
        else
          setTimeout(t, 500);
      };
    return t();
  };
});