/* particlesJS v2.0.0 by Vincent Garreau. @VincentGarreau - vincentgarreau.com/particles.js */
var pJS = function(tag_id, params){

  var canvas = document.querySelector('#'+tag_id+' > .particles-js-canvas-el');

  this.pJS = {
    canvas: {
      el: canvas,
      w: canvas.offsetWidth,
      h: canvas.offsetHeight
    },
    particles: {
      number: {
        value: 400,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#fff'
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
        value: 1,
        random: false,
        anim: {
          enable: false,
          speed: 2,
          opacity_min: 0,
          sync: false
        }
      },
      size: {
        value: 20,
        random: false,
        anim: {
          enable: false,
          speed: 20,
          size_min: 0,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 100,
        color: '#fff',
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
      },
      array: []
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
          distance: 200,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 200,
          size: 50,
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
      },
      mouse: {}
    },
    retina_detect: false,
    config_demo: {
      hide_card: false,
      background_color: '#1e293b',
      background_image: '',
      background_position: '50% 50%',
      background_repeat: 'no-repeat',
      background_size: 'cover'
    }
  };

  var pJS = this.pJS;

  /* ---------- particles.js functions - start ------------ */

  pJS.particles.number.value = 100;
  pJS.particles.color.value = '#00ffff';
  pJS.particles.line_linked.enable = true;
  pJS.particles.line_linked.color = '#00ffff';
  pJS.particles.move.speed = 3;
  pJS.particles.interactivity.events.onhover.enable = true;
  pJS.particles.interactivity.events.onhover.mode = 'grab';
  pJS.particles.interactivity.modes.grab.distance = 150;
  pJS.particles.interactivity.modes.grab.line_linked.opacity = 0.8;
  pJS.config_demo.background_color = '#000000';
  pJS.config_demo.background_image = '';
  pJS.config_demo.background_position = '50% 50%';
  pJS.config_demo.background_repeat = 'no-repeat';
  pJS.config_demo.background_size = 'cover';
  pJS.particles.shape.type = 'circle';

  pJS.fn = {

    /* particles.js - particles creator */
    particlesCreate: function(){

      for(var i = 0; i < pJS.particles.number.value; i++){

        pJS.particles.array.push(new pJS.fn.particle(pJS.particles.color.value, pJS.particles.opacity.value,pJS.particles.size.value));
      }

    },

    /* particles.js - draw */
    particlesDraw: function(){

      pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);
      pJS.fn.update();

      for(var i = 0; i < pJS.particles.array.length; i++){
        var p = pJS.particles.array[i];
        p.draw();
      }

    },

    /* particles.js - particle */
    particle: function(color, opacity, size){

      /* === properties === */

      this.radius = (pJS.particles.size.random ? Math.random() : 1) * size;
      this.opacity = (pJS.particles.opacity.random ? Math.random() : 1) * opacity;
      this.x = Math.random() * pJS.canvas.w;
      this.y = Math.random() * pJS.canvas.h;

      /* === check position  === */
      if(this.x > pJS.canvas.w || this.x < 0) this.x = pJS.canvas.w/2;
      if(this.y > pJS.canvas.h || this.y < 0) this.y = pJS.canvas.h/2;

      /* === velocity === */
      this.vx = ((Math.random() * pJS.particles.move.speed) - (pJS.particles.move.speed/2));
      this.vy = ((Math.random() * pJS.particles.move.speed) - (pJS.particles.move.speed/2));

      /* === color === */
      this.color = color;

      /* === Stroke === */
      this.strokeColor = pJS.particles.shape.stroke.color;
      this.strokeWidth = pJS.particles.shape.stroke.width;

      /* === draw particle === */
      this.draw = function(){
        pJS.canvas.ctx.fillStyle = this.color;
        pJS.canvas.ctx.globalAlpha = this.opacity;
        pJS.canvas.ctx.beginPath();
        pJS.canvas.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        if(this.strokeWidth > 0){
          pJS.canvas.ctx.strokeStyle = this.strokeColor;
          pJS.canvas.ctx.lineWidth = this.strokeWidth;
          pJS.canvas.ctx.stroke();
        }

        pJS.canvas.ctx.closePath();
        pJS.canvas.ctx.fill();
      }

      /* === Update particle position === */
      this.update = function(){

        /* === Move the particle === */
        this.x += this.vx;
        this.y += this.vy;

        /* === Bounce off the walls === */
        if(this.x + this.radius > pJS.canvas.w || this.x - this.radius < 0) {
          this.vx = -this.vx;
        }
        if(this.y + this.radius > pJS.canvas.h || this.y - this.radius < 0) {
          this.vy = -this.vy;
        }

        /* === Out of canvas mode === */
        if(pJS.particles.move.out_mode == 'bounce'){
          if(this.x + this.radius > pJS.canvas.w) this.vx = -this.vx;
          else if(this.x - this.radius < 0) this.vx = -this.vx;
          if(this.y + this.radius > pJS.canvas.h) this.vy = -this.vy;
          else if(this.y - this.radius < 0) this.vy = -this.vy;
        }

        /* === If particle goes out of the canvas === */
        else{

          if(this.y < -this.radius){
            this.y = pJS.canvas.h + this.radius;
          }
          if(this.x < -this.radius){
            this.x = pJS.canvas.w + this.radius;
          }
          if(this.x > pJS.canvas.w + this.radius){
            this.x = -this.radius;
          }
          if(this.y > pJS.canvas.h + this.radius){
            this.y = -this.radius;
          }
        }


        /* === Line Linked === */
        if(pJS.particles.line_linked.enable){
          for(var j = 0; j < pJS.particles.array.length; j++){
            var p2 = pJS.particles.array[j];
            if(p != p2){
              var dist = Math.sqrt(Math.pow(this.x - p2.x, 2) + Math.pow(this.y - p2.y, 2));
              if(dist <= pJS.particles.line_linked.distance){
                var opacity_line = pJS.particles.line_linked.opacity - (dist / (1/pJS.particles.line_linked.opacity)) / pJS.particles.line_linked.distance;
                if(opacity_line > 0){

                  /* === Draw the line === */
                  pJS.canvas.ctx.strokeStyle = 'rgba('+parseInt(this.color.substr(1,2),16)+','+parseInt(this.color.substr(3,2),16)+','+parseInt(this.color.substr(5,2),16)+','+ opacity_line+')';
                  pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
                  pJS.canvas.ctx.beginPath();
                  pJS.canvas.ctx.moveTo(this.x, this.y);
                  pJS.canvas.ctx.lineTo(p2.x, p2.y);
                  pJS.canvas.ctx.stroke();
                }
              }
            }
          }
        }
      }
    },

    /* particles.js - update */
    update: function(){

      for(var i = 0; i < pJS.particles.array.length; i++){
        var p = pJS.particles.array[i];

        p.update();
      }

      if(pJS.interactivity.events.onhover.enable){

        /* === Mouse coordinates === */
        var pos_x = pJS.interactivity.mouse.pos_x;
        var pos_y = pJS.interactivity.mouse.pos_y;

        /* === Mouseover / Mouseout === */
        if(pos_x && pos_y){
          for(var i = 0; i < pJS.particles.array.length; i++){
            var p = pJS.particles.array[i];
            var dist = Math.sqrt(Math.pow(p.x - pos_x, 2) + Math.pow(p.y - pos_y, 2));

            /* === Hover effect === */
            if(dist <= pJS.interactivity.modes.grab.distance){

              pJS.canvas.el.style.cursor = 'pointer';

              /* === Grab effect === */
              if(pJS.interactivity.modes.grab.line_linked.enable){
                var opacity_line = pJS.interactivity.modes.grab.line_linked.opacity - (dist / (1/pJS.interactivity.modes.grab.line_linked.opacity)) / pJS.interactivity.modes.grab.distance;

                if(opacity_line > 0){
                  /* === Draw the line === */
                  pJS.canvas.ctx.strokeStyle = 'rgba('+parseInt(p.color.substr(1,2),16)+','+parseInt(p.color.substr(3,2),16)+','+parseInt(p.color.substr(5,2),16)+','+ opacity_line+')';
                  pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
                  pJS.canvas.ctx.beginPath();
                  pJS.canvas.ctx.moveTo(p.x, p.y);
                  pJS.canvas.ctx.lineTo(pos_x, pos_y);
                  pJS.canvas.ctx.stroke();
                }

              }

            }
          }
        }
      }

      /* === Click effect === */
      if(pJS.interactivity.events.onclick.enable){

        switch(pJS.interactivity.events.onclick.mode){

          case 'push':
            pJS.fn.modes.pushParticles(pJS.interactivity.modes.push.particles_nb, pJS.interactivity.mouse.pos_x, pJS.interactivity.mouse.pos_y);
          break;

          case 'remove':
            pJS.fn.modes.removeParticles(pJS.interactivity.modes.remove.particles_nb);
          break;

          default:
          break;

        }
      }

    },

    /* particles.js - reset(destroy) */
    reset: function(){

      pJS.particles.array = [];
      cancelAnimationFrame(pJS.animation);

      pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);

    },

    /* particles.js - modes */
    modes: {

      /* particles.js - modes.pushParticles */
      pushParticles: function(nb, pos_x, pos_y){

        for(var i = 0; i < nb; i++){
          pJS.particles.array.push(
            new pJS.fn.particle(
              pJS.particles.color.value,
              pJS.particles.opacity.value,
              pJS.particles.size.value
            )
          )

          if(pos_x && pos_y){
              pJS.particles.array[pJS.particles.array.length-1].x = pos_x;
              pJS.particles.array[pJS.particles.array.length-1].y = pos_y;
          }
        }
      },

      /* particles.js - modes.removeParticles */
      removeParticles: function(nb){

        pJS.particles.array.splice(0, nb);

      }

    }

  }

  /* ---------- particles.js - start ------------ */

  pJS.fn.canvasInit = function(){

    pJS.canvas.ctx = pJS.canvas.el.getContext('2d');

  };

  pJS.fn.canvasSize = function(){

    pJS.canvas.el.width = pJS.canvas.w;
    pJS.canvas.el.height = pJS.canvas.h;

    if(pJS.retina_detect){
      pJS.canvas.el.width = pJS.canvas.w * 2;
      pJS.canvas.el.height = pJS.canvas.h * 2;
      pJS.canvas.ctx.scale(2, 2);
    }

    pJS.canvas.ctx.fillStyle = pJS.config_demo.background_color;
    pJS.canvas.ctx.fillRect(0, 0, pJS.canvas.w, pJS.canvas.h);

    if(pJS.config_demo.background_image != ''){
      var img = new Image();
      img.onload = function(){
        pJS.canvas.ctx.drawImage(img, 0, 0, pJS.canvas.w, pJS.canvas.h);
      }
      img.src = pJS.config_demo.background_image;
    }

    pJS.fn.particlesDraw();

  };

  /* ---------- particles.js - events ------------ */

  pJS.fn.windowResize = function(){

    pJS.canvas.w = pJS.canvas.el.offsetWidth;
    pJS.canvas.h = pJS.canvas.el.offsetHeight;

    if(pJS.retina_detect){
      pJS.canvas.w *= 2;
      pJS.canvas.h *= 2;
    }

    pJS.canvas.el.width = pJS.canvas.w;
    pJS.canvas.el.height = pJS.canvas.h;

    pJS.canvas.ctx.fillStyle = pJS.config_demo.background_color;
    pJS.canvas.ctx.fillRect(0, 0, pJS.canvas.w, pJS.canvas.h);

    if(pJS.config_demo.background_image != ''){
      var img = new Image();
      img.onload = function(){
        pJS.canvas.ctx.drawImage(img, 0, 0, pJS.canvas.w, pJS.canvas.h);
      }
      img.src = pJS.config_demo.background_image;
    }

    pJS.fn.particlesDraw();

  };

  /* ---------- particles.js - density ------------ */

  pJS.fn.densityAutoParticles = function(){

    var area = pJS.canvas.el.width * pJS.canvas.el.height / 1000;
    if(pJS.particles.number.density.enable){

      var nb_particles = area * pJS.particles.number.value / pJS.particles.number.density.value_area;
      var missing_particles = pJS.particles.array.length - nb_particles;

      if(missing_particles < 0){
        pJS.fn.modes.pushParticles(Math.abs(missing_particles));
      }else{
        pJS.fn.modes.removeParticles(missing_particles);
      }

    }

  };


  /* ---------- particles.js - init ------------ */

  pJS.fn.canvasInit();
  pJS.fn.canvasSize();
  pJS.fn.densityAutoParticles();

  pJS.fn.particlesCreate();
  pJS.fn.particlesDraw();

  window.addEventListener('resize', function(){
    pJS.fn.windowResize()
  });

  /* ---------- particles.js - animation ------------ */

  pJS.animation = requestAnimationFrame(pJS.fn.animloop);

};

pJS.prototype.destroy = function(){
  cancelAnimationFrame(this.pJS.animation);
  this.pJS.fn.canvas.ctx.clearRect(0, 0, this.pJS.canvas.w, this.pJS.canvas.h);
  var canvas = document.getElementById(this.pJS.canvas.el.id);
  canvas.remove();
  pJSDom = null
};

pJS.prototype.render = function() {
  this.pJS.fn.particlesDraw();
};

pJS.prototype.wp_init = function(){
  console.log("particles-js: WordPress plugin activated");
};

window.particlesJS = function(tag_id, params){

  if(document.getElementById(tag_id) == null){
    console.error('particles.js - tag "'+tag_id+'" not found');
    return;
  }

  var canvas_el = document.createElement('canvas');
  canvas_el.className = 'particles-js-canvas-el';
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";

  var canvas = document.getElementById(tag_id).appendChild(canvas_el);

  if(canvas != null){
    return new pJS(tag_id, params);
  }
}

window.particlesJS.load = function(tag_id, path_config_json, callback){

  var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
  xobj.open('GET', path_config_json, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      var params = JSON.parse(xobj.responseText);

      window.particlesJS(tag_id, params);

      if(callback){
        callback();
      }
    }
  };
  xobj.send(null);
};
edit filepath: public/style.css
content: body {
    margin: 0;
    overflow: hidden; /* Prevent scrollbars */
    background-color: #000; /* Encryption-like black background */
    font-family: 'Courier New', monospace; /* A digital, encryption-like font */
    color: #00FF00; /* Encryption-like green text */
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1; /* Behind all content */
}

.container {
    position: relative;
    width: 80%;
    max-width: 600px;
    margin: 100px auto;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    border: 1px solid #00FF00; /* Encryption-like border */
    border-radius: 5px;
    text-align: center;
}

h1 {
    color: #00FF00;
    margin-bottom: 20px;
}

a {
    color: #00FFFF; /* Cyan for links */
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* Form styles */
input[type="text"],
input[type="password"] {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    background-color: #111;
    color: #00FF00;
    border: 1px solid #00FF00;
    border-radius: 3px;
}

input[type="submit"] {
    width: 100%;
    padding: 10px;
    margin-top: 20px;
    background-color: #00FF00;
    color: #000;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

input[type="submit"]:hover {
    background-color: #00D000;
}

.error-message {
    color: #FF0000;
    margin-top: 10px;
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div id="particles-js"></div>

    <div class="container">
        <h1>Welcome to the Encrypted Web Proxy</h1>
        <p>Securely browse the internet with enhanced encryption.</p>
        <p><a href="/login.html">Login</a> or <a href="/signup.html">Sign Up</a></p>
    </div>

    <script src="particles.js"></script>
    <script>
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#00ff00"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#00ff00",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 0.8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    </script>
</body>
</html>