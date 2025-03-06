const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

let particles = [];
const particleDensity = 0.001; // Adjust for desired density
const baseRadius = 1;
const radiusVariance = 2;
const baseSpeed = 0.5;
const speedVariance = 0.5;

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = (Math.random() - 0.5) * (baseSpeed + Math.random() * speedVariance);
    this.speedY = (Math.random() - 0.5) * (baseSpeed + Math.random() * speedVariance);
    this.radius = baseRadius + Math.random() * radiusVariance;
    this.opacity = Math.random() * 0.5 + 0.5; // Add opacity for a softer effect
}

Particle.prototype.update = function() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges with some energy loss (damping)
    const damping = 0.8;
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.speedX *= -damping;
        this.x += this.speedX; // Prevent sticking to the edge
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.speedY *= -damping;
        this.y += this.speedY; // Prevent sticking to the edge
    }
};

Particle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow');
    ctx.fillStyle = `rgba(${hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--primary-glow')).r}, ${hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--primary-glow')).g}, ${hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--primary-glow')).b}, ${this.opacity})`;
    ctx.fill();
};

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function initParticles() {
    particles = []; // Clear existing particles
    const numParticles = Math.floor(canvas.width * canvas.height * particleDensity);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
    });
    requestAnimationFrame(animate);
}

initParticles();
animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles(); // Re-initialize particles on resize
});