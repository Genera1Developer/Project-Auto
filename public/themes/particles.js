FILE PATH: public/themes/particles.js
CONTENT: ```js
(function () {
  var canvasEl = document.querySelector(".background");
  var ctx = canvasEl.getContext("2d");
  var width = canvasEl.width;
  var height = canvasEl.height;

  // define particle properties
  var particles = [];
  for (var i = 0; i < 100; i++) {
    var particle = {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      radius: Math.random() * 2 + 2,
    };
    particles.push(particle);
  }

  function update() {
    ctx.clearRect(0, 0, width, height);
    for (var i in particles) {
      var particle = particles[i];

      // add some movement to the particle
      particle.vx += Math.random() * 0.05 - 0.025;
      particle.vy += Math.random() * 0.05 - 0.025;

      // adjust particle position with the added movement
      particle.x += particle.vx;
      particle.y += particle.vy;

      // check if particle is out of bounds
      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
      }

      // draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  function render() {
    update();
    requestAnimationFrame(render);
  }

  render();
})();
```