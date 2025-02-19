FILE PATH: public/themes/particles.js
CONTENT: ```javascript
import Particles from "particles.js";

const particlesOptions = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 3000
      }
    },
    color: {
      value: "#fff"
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 1,
      random: false
    },
    size: {
      value: 2,
      random: false
    },
    line_linked: {
      enable: false
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: true,
      straight: false
    }
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "bubble"
      }
    },
    modes: {
      bubble: {
        distance: 200,
        size: 5,
        duration: 0.4,
        opacity: 1,
        speed: 8
      }
    }
  }
};

export default Particles;
```