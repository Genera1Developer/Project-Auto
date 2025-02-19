FILE PATH: public/themes/particles.js
CONTENT: ```js
/* particles.js config */
particlesJS("particles-js", {
  particles: {
    color: "#000000",
    shape: "circle",
    opacity: 1,
    size: 2,
    size_random: true,
    nb: 150,
    line_linked: {
      enable: false,
      distance: 100,
      color: "#000000",
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "bubble",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
  },
  retina_detect: true,
});
```