FILE PATH: public/themes/particles.js
CONTENT: ```javascript

/* particlesJS.js v2.0.0 - https://github.com/VincentGarreau/particles.js */

(function (factory) {
  /* CommonJS module */
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
  } else {
    /* Browser globals */
    factory();
  }
})(function () {
  "use strict";

  /* Utility */

  /**
   * RequestAnimFrame shim
   */
  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  /**
   * Create a 2D canvas element and append it to the document body
   */
  function createCanvas(w, h) {
    var canvas = document.createElement("canvas");
    canvas.width = w || window.innerWidth;
    canvas.height = h || window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    document.body.appendChild(canvas);
    return canvas;
  }

  /**
   * Return a string with a random hex color
   */
  function color() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /* Main class */

  function Particles(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.defaults = {
      vx: 5,
      vy: 5,
      vx_i: 1,
      vy_i: 1,
      c1: color(),
      c2: color(),
      c3: color(),
      radius: 10,
      color: null,
      distance: 100,
      count: 100,
    };

    this.particles = [];

    this.initialize();
  }

  Particles.prototype = {
    initialize: function () {
      this.build();
      this.animate();
    },

    build: function () {
      var c1 = this.defaults.c1;
      var c2 = this.defaults.c2;
      var c3 = this.defaults.c3;

      for (var i = 0; i < this.defaults.count; i++) {
        this.particles.push({
          vx: Math.random() * this.defaults.vx_i * this.defaults.vx,
          vy: Math.random() * this.defaults.vy_i * this.defaults.vy,
          c1: c1,
          c2: c2,
          c3: c3,
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * this.defaults.radius,
          color: this.defaults.color,
          distance: this.defaults.distance,
        });
      }
    },

    animate: function () {
      var self = this;
      requestAnimFrame(function () {
        self.animate();
      });

      self.ctx.clearRect(0, 0, self.width, self.height);

      for (var i = 0; i < self.particles.length; i++) {
        var particle = self.particles[i];

        if (particle.x > self.width || particle.x < 0) {
          particle.vx *= -1;
        }

        if (particle.y > self.height || particle.y < 0) {
          particle.vy *= -1;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        self.ctx.fillStyle = particle.c1;
        self.ctx.beginPath();
        self.ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
        self.ctx.fill();

        for (var j = 0; j < self.particles.length; j++) {
          var other = self.particles[j];
          if (particle !== other) {
            var dx = particle.x - other.x;
            var dy = particle.y - other.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < particle.distance && particle.c1 !== other.c1) {
              self.ctx.strokeStyle = particle.c1;
              self.ctx.beginPath();
              self.ctx.moveTo(particle.x, particle.y);
              self.ctx.lineTo(other.x, other.y);
              self.ctx.stroke();
            }
          }
        }
      }
    },
  };

  /* Start the particles animation */

  window.onload = function () {
    var canvas = createCanvas();
    var particles = new Particles(canvas);
  };

  return Particles;
});

```