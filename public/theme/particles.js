file path: public/theme/particles.js
content: ```js
console.log('Particles v1.0.0');

// Create a new particle
let particle = function(x, y, size, color) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.color = color;
};

// Draw the particle
particle.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fillStyle = this.color;
  ctx.fill();
};

// Update the particle
particle.prototype.update = function() {
  this.x += Math.random() * 2 - 1;
  this.y += Math.random() * 2 - 1;
};

// Create a new particle system
let particleSystem = function() {
  this.particles = [];
  this.numParticles = 100;
};

// Add a particle to the system
particleSystem.prototype.addParticle = function() {
  let x = Math.random() * window.innerWidth;
  let y = Math.random() * window.innerHeight;
  let size = Math.random() * 5 + 1;
  let color = 'rgba(255, 255, 255, 1)';

  let particle = new particle(x, y, size, color);
  this.particles.push(particle);
};

// Update the system
particleSystem.prototype.update = function() {
  for (let i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  }
};

// Draw the system
particleSystem.prototype.draw = function() {
  for (let i = 0; i < this.particles.length; i++) {
    this.particles[i].draw();
  }
};

// Create a new particle system
let ps = new particleSystem();

// Add particles to the system
for (let i = 0; i < ps.numParticles; i++) {
  ps.addParticle();
}

// Update and draw the system
setInterval(function() {
  ps.update();
  ps.draw();
}, 1000 / 60);
```