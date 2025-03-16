/* particlesJS('dom-id', params);
 * @params string dom_id
 * @params object params (optional)
 */

/* ---- particlesJS functions ---- */

window.particlesJS = function (tagId, params) {

  /* ---- particles variables ---- */

  var canvas, ctx, stop, config, animation;
  var w, h;
  var mx = -100;
  var my = -100;
  var mouseActive = false;
  var dom = document.getElementById(tagId);
  var particles = [];

  /* ---- Default settings ---- */
  config = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#00c698' // Encryption green
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000000'
        },
        polygon: {
          nb_sides: 5
        },
        image: {
          src: '',
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#00c698', // Encryption green
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 6,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: true,
          mode: 'push'
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  };

  if (params) {
    Object.assign(config, params);
  }

  /* ---- particles init ---- */

  init = function () {

    canvas = document.createElement('canvas');
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = -1;

    dom.appendChild(canvas);

    if (canvas.getContext) {
      ctx = canvas.getContext('2d');
    } else {
      console.warn('Canvas not supported - falling back to static background');
      dom.style.backgroundColor = config.particles.color.value;
      return;
    }

    resize();

    window.addEventListener('resize', function(){
      resize();
    });

    canvas.addEventListener('mousemove', function(e){
      mx = e.offsetX || e.clientX;
      my = e.offsetY || e.clientY;
      mouseActive = true;
    });

    canvas.addEventListener('mouseleave', function(){
      mx = -100;
      my = -100;
      mouseActive = false;
    });

    canvas.addEventListener('click', function(){
      pushParticles(config.interactivity.modes.push.particles_nb, mx, my);
    });

    // Initialize particles array
    for (var i = 0; i < config.particles.number.value; i++) {
      particles.push(new Particle());
    }

    animationFrame(draw);
  };

  /* ---- Particle class ---- */

  function Particle() {

    var _this = this;

    _this.x = Math.random() * w;
    _this.y = Math.random() * h;

    _this.vx = ((Math.random() < 0.5) ? -1 : 1) * Math.random() * config.particles.move.speed;
    _this.vy = ((Math.random() < 0.5) ? -1 : 1) * Math.random() * config.particles.move.speed;

    _this.radius = (config.particles.size.random ? Math.random() : 1) * config.particles.size.value;

    _this.color = config.particles.color.value;

    _this.draw = function () {
      ctx.fillStyle = _this.color;
      ctx.beginPath();
      ctx.arc(_this.x, _this.y, _this.radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    };
  }

  /* ---- particles functions ---- */

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.draw();

      // Move the particle
      p.x += p.vx;
      p.y += p.vy;

      // Interact with mouse
      if(mouseActive){
        var dx = p.x - mx;
        var dy = p.y - my;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < config.interactivity.modes.grab.distance){
          p.vx += dx * 0.005;
          p.vy += dy * 0.005;
        }
      }

      // Bounce off edges
      if (p.x + p.radius > w || p.x - p.radius < 0) {
        p.vx = -p.vx;
      }
      if (p.y + p.radius > h || p.y - p.radius < 0) {
        p.vy = -p.vy;
      }

      // Link particles
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx = p.x - p2.x;
        var dy = p.y - p2.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < config.particles.line_linked.distance) {
          ctx.beginPath();
          ctx.strokeStyle = config.particles.line_linked.color;
          ctx.lineWidth = config.particles.line_linked.width;
          ctx.globalAlpha = config.particles.line_linked.opacity;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.closePath();
        }
      }

    }

    animationFrame(draw);
  }

  function pushParticles(nb, x, y){
    for(var i = 0; i < nb; i++){
      var p = new Particle();
      p.x = x;
      p.y = y;
      particles.push(p);
    }
  }

  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;
  }

  /* ---- start ---- */

  function animationFrame(callback){
    (window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) { window.setTimeout(callback, 1000 / 60); })(callback);
  }

  init();
};