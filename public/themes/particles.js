FILE PATH: public/themes/particles.js
CONTENT: ```js
(function () {
  const particles = [];
  const canvas = document.getElementById("particles-js");
  const ctx = canvas.getContext("2d");
  const colors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#8B00FF",
  ];

  const mouse = {
    x: 0,
    y: 0,
  };
  const opts = {
    particleCount: 100,
    minRadius: 2,
    maxRadius: 5,
    minSpeed: 0.3,
    maxSpeed: 0.9,
    color: "random",
  };

  // create particles object
  const Particle = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = opts.minRadius + Math.random() * (opts.maxRadius - opts.minRadius);
    this.color =
      opts.color == "random" ? colors[Math.floor(Math.random() * colors.length)] : opts.color;
    this.speedx = opts.minSpeed + Math.random() * (opts.maxSpeed - opts.minSpeed);
    this.speedy = opts.minSpeed + Math.random() * (opts.maxSpeed - opts.minSpeed);
  };

  // draw single particle
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  };

  // update particle position
  Particle.prototype.update = function () {
    this.x += this.speedx * 2;
    this.y += this.speedy * 2;
    if (this.x > canvas.width || this.x < 0) {
      this.speedx = -this.speedx;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.speedy = -this.speedy;
    }
  };

  // init particles
  for (var i = 0; i < opts.particleCount; i++) {
    var particle = new Particle();
    particles.push(particle);
  }

  // animation loop
  function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw particles
    for (var i = 0; i < particles.length; i++) {
      particles[i].draw();
      particles[i].update();
    }
  }
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  animate();
})();
```