/* particlesJS v2.0.0 by Vincent Garreau. @vincentgarreau - vincentgarreau.com/particles.js */

var pJS = function(tag_id, params){

  var canvas = document.querySelector('#'+tag_id+' > .particles-js-canvas-el');

  this.pJS = {
    canvas: {
      el: canvas,
      w: canvas.offsetWidth,
      h: canvas.offsetHeight
    },
    particles: {
      number: params.particles.number.value,
      color: params.particles.color.value,
      shape: params.particles.shape.type,
      opacity: {
        value: params.particles.opacity.value,
        anim: {
          enable: params.particles.opacity.anim.enable,
          speed: params.particles.opacity.anim.speed,
          sync: params.particles.opacity.anim.sync
        }
      },
      size: {
        value: params.particles.size.value,
        anim: {
          enable: params.particles.size.anim.enable,
          speed: params.particles.size.anim.speed,
          sync: params.particles.size.anim.sync
        }
      },
      line_linked: {
        enable: params.particles.line_linked.enable,
        distance: params.particles.line_linked.distance,
        color: params.particles.line_linked.color,
        opacity: params.particles.line_linked.opacity,
        width: params.particles.line_linked.width
      },
      move: {
        enable: params.particles.move.enable,
        speed: params.particles.move.speed,
        direction: params.particles.move.direction,
        random: params.particles.move.random,
        straight: params.particles.move.straight,
        out_mode: params.particles.move.out_mode,
        attract: {
          enable: params.particles.move.attract.enable,
          rotateX: params.particles.move.attract.rotateX,
          rotateY: params.particles.move.attract.rotateY
        }
      },
      array: []
    },
    interactivity: {
      detect_on: params.interactivity.detect_on,
      events: {
        onhover: {
          enable: params.interactivity.events.onhover.enable,
          mode: params.interactivity.events.onhover.mode
        },
        onclick: {
          enable: params.interactivity.events.onclick.enable,
          mode: params.interactivity.events.onclick.mode
        }
      },
      modes: {
        grab: {
          distance: params.interactivity.modes.grab.distance,
          line_linked: {
            opacity: params.interactivity.modes.grab.line_linked.opacity
          }
        },
        bubble: {
          distance: params.interactivity.modes.bubble.distance,
          size: params.interactivity.modes.bubble.size,
          opacity: params.interactivity.modes.bubble.opacity
        },
        repulse: {
          distance: params.interactivity.modes.repulse.distance
        },
        push: {
          particles_nb: params.interactivity.modes.push.particles_nb
        },
        remove: {
          particles_nb: params.interactivity.modes.remove.particles_nb
        }
      }
    },
    retina_detect: params.retina_detect
  };

  var pJS = this.pJS;

  /* ---------- particles.js functions - start ------------ */

  /* init canvas + particles */
  pJS.init = function(){

    /* detect retina display */
    if(pJS.retina_detect && window.devicePixelRatio > 1){
      pJS.retina = true;
    }

    /* set canvas size */
    pJS.canvas.w = pJS.canvas.el.offsetWidth * (pJS.retina ? 2 : 1);
    pJS.canvas.h = pJS.canvas.el.offsetHeight * (pJS.retina ? 2 : 1);

    pJS.canvas.el.width = pJS.canvas.w;
    pJS.canvas.el.height = pJS.canvas.h;

    /* requestAnimationFrame polyfill */
    window.requestAnimationFrame = (function(){
      return window.requestAnimationFrame       ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame    ||
             window.oRequestAnimationFrame      ||
             window.msRequestAnimationFrame     ||
             function(callback){
               window.setTimeout(callback, 1000 / 60);
             };
    })();

    /* clear canvas */
    pJS.ctx = pJS.canvas.el.getContext('2d');
    pJS.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);

    /* init particle params */
    pJS.particles.array = [];
    for(var i = 0; i < pJS.particles.number; i++){
      pJS.particles.array.push(new pJS.particle(pJS.particles.color, pJS.particles.opacity.value, pJS.particles.size.value));
    }

    /* draw particles */
    pJS.draw();
  };

  /* Particle class */
  pJS.particle = function(color, opacity, size){

    /* particle position */
    this.x = Math.random() * pJS.canvas.w;
    this.y = Math.random() * pJS.canvas.h;

    /* particle parameters */
    this.opacity = opacity;
    this.size = size;
    this.color = color;

    /* particle speed */
    this.speed = {
      x: -1 + Math.random() * 2,
      y: -1 + Math.random() * 2
    };

    /* particle implemented parameters */
    if(pJS.particles.move.random){
      this.speed.x = this.speed.x * Math.random();
      this.speed.y = this.speed.y * Math.random();
    }

    /* particle function */
    this.draw = function(){
      pJS.ctx.fillStyle = 'rgba('+this.color+', '+this.opacity+')';
      pJS.ctx.beginPath();

      switch (pJS.particles.shape) {

        case 'circle':
          pJS.ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
        break;

        case 'edge':
          pJS.ctx.rect(this.x, this.y, this.size, this.size);
        break;

        case 'triangle':
          pJS.ctx.moveTo(this.x, this.y-this.size);
          pJS.ctx.lineTo(this.x+this.size, this.y+this.size);
          pJS.ctx.lineTo(this.x-this.size, this.y+this.size);
          pJS.ctx.closePath();
        break;
      }

      pJS.ctx.closePath();
      pJS.ctx.fill();
    }

    /* update particle position */
    this.update = function(){

      /* move the particle */
      this.x += this.speed.x;
      this.y += this.speed.y;

      /* change particle opacity */
      if(pJS.particles.opacity.anim.enable){
        if(this.opacity > 1 || this.opacity < 0){
          this.speed.opacity *= -1;
        }
        this.opacity += this.speed.opacity / pJS.particles.opacity.anim.speed;
      }

      /* change particle size */
      if(pJS.particles.size.anim.enable){
        if(this.size > pJS.particles.size.value || this.size < 0){
          this.speed.size *= -1;
        }
        this.size += this.speed.size / pJS.particles.size.anim.speed;
      }

      /* bounce particle if on edge of canvas */
      if(this.x < 0 || this.x > pJS.canvas.w){
        this.speed.x *= -1;
      }
      if(this.y < 0 || this.y > pJS.canvas.h){
        this.speed.y *= -1;
      }

      /* draw again */
      this.draw();
    }
  };

  /* animate particles */
  pJS.draw = function(){

    /* clear canvas */
    pJS.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);

    /* update each particle */
    for(var i = 0; i < pJS.particles.array.length; i++){
      var p = pJS.particles.array[i];
      p.update();
    }

    /* draw lines between particles */
    if(pJS.particles.line_linked.enable){
      for(var i = 0; i < pJS.particles.array.length; i++){
        for(var j = i + 1; j < pJS.particles.array.length; j++){

          /* calculate distance between particles */
          var p1 = pJS.particles.array[i];
          var p2 = pJS.particles.array[j];

          var dist = Math.sqrt((p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y));

          /* draw a line between them if the distance is less than the specified distance */
          if(dist < pJS.particles.line_linked.distance){
            pJS.ctx.beginPath();
            pJS.ctx.strokeStyle = 'rgba('+pJS.particles.line_linked.color+', '+pJS.particles.line_linked.opacity+')';
            pJS.ctx.lineWidth = pJS.particles.line_linked.width;
            pJS.ctx.moveTo(p1.x, p1.y);
            pJS.ctx.lineTo(p2.x, p2.y);
            pJS.ctx.stroke();
            pJS.ctx.closePath();
          }
        }
      }
    }

    /* requestAnimationFrame (animate) */
    requestAnimationFrame(pJS.draw);
  };

  /* ---------- particles.js functions - end ------------ */

  /* ---------- particles.js interactions - start ------------ */

  /* canvas interaction */
  pJS.canvas.el.onmousemove = function(e){

    /* get point on canvas from mouse */
    var point = {
      x: e.offsetX || e.clientX,
      y: e.offsetY || e.clientY
    };

    /* check each particle */
    for(var i = 0; i < pJS.particles.array.length; i++){
      var p = pJS.particles.array[i];

      /* calculate distance between particle and mouse */
      var dist = Math.sqrt((p.x - point.x)*(p.x - point.x) + (p.y - point.y)*(p.y - point.y));

      /* hover effect */
      if(dist < pJS.interactivity.modes.bubble.distance){

        /* bubble effect */
        if(pJS.interactivity.events.onhover.mode == 'bubble'){

          /* check if particle is currently bubbling */
          if(!p.bubbling){
            p.bubbling = true;
            p.bubbledSize = p.size;
            p.bubbledOpacity = p.opacity;

            /* animate bubble */
            p.bubble = function(){
              if(p.bubbledSize < pJS.interactivity.modes.bubble.size){
                p.bubbledSize += 1;
                p.bubbledOpacity += 0.05;
              }

              p.size = p.bubbledSize;
              p.opacity = p.bubbledOpacity;

              if(p.bubbledSize >= pJS.interactivity.modes.bubble.size){
                clearInterval(p.bubbleInterval);
              }
            };

            /* set interval to animate bubble */
            p.bubbleInterval = setInterval(p.bubble, 50);
          }
        }

        /* repulse effect */
        if(pJS.interactivity.events.onhover.mode == 'repulse'){

          /* repulse particle */
          p.repulse = function(){
            var dx = p.x - point.x;
            var dy = p.y - point.y;

            var angle = Math.atan2(dy, dx);

            p.x += pJS.interactivity.modes.repulse.distance * Math.cos(angle);
            p.y += pJS.interactivity.modes.repulse.distance * Math.sin(angle);
          };

          /* repulse particle */
          p.repulse();
        }
      }else{

        /* reset bubble effect */
        if(p.bubbling){
          p.bubbling = false;

          /* animate reset */
          p.resetBubble = function(){
            if(p.bubbledSize > p.size){
              p.bubbledSize -= 1;
              p.bubbledOpacity -= 0.05;
            }

            p.size = p.bubbledSize;
            p.opacity = p.bubbledOpacity;

            if(p.bubbledSize <= p.size){
              clearInterval(p.resetBubbleInterval);
            }
          };

          /* set interval to animate reset */
          p.resetBubbleInterval = setInterval(p.resetBubble, 50);
        }
      }
    }
  };

  /* canvas click */
  pJS.canvas.el.onclick = function(e){

    /* get point on canvas from mouse */
    var point = {
      x: e.offsetX || e.clientX,
      y: e.offsetY || e.clientY
    };

    /* push effect */
    if(pJS.interactivity.events.onclick.mode == 'push'){
      for(var i = 0; i < pJS.interactivity.modes.push.particles_nb; i++){
        pJS.particles.array.push(new pJS.particle(pJS.particles.color, pJS.particles.opacity.value, pJS.particles.size.value));
      }
    }

    /* remove effect */
    if(pJS.interactivity.events.onclick.mode == 'remove'){
      for(var i = 0; i < pJS.interactivity.modes.remove.particles_nb; i++){
        pJS.particles.array.shift();
      }
    }
  };

  /* ---------- particles.js interactions - end ------------ */

  /* ---------- particles.js start ------------ */

  pJS.init();

};

/* particlesJS */
window.particlesJS = function(tag_id, params){

  /* no params provided */
  if(typeof params == 'undefined'){

    console.warn('particles.js: no parameters passed, using default configuration');

    params = {
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
          opacity: 1,
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
            rotateX: 3000,
            rotateY: 3000
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
            distance: 200,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 200,
            size: 80,
            duration: 0.4
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
      retina_detect: false
    }
  }

  /* launch particles.js */
  return new pJS(tag_id, params);
};
edit filepath: public/particles.json
content: {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#00c698"
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
      "color": "#00c698",
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
}
edit filepath: public/style.css
content: body {
    font-family: 'Arial', sans-serif;
    background-color: #000;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #fff;
    overflow: hidden; /* Hide scrollbars */
}

#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
}

.container {
    background-color: rgba(255, 255, 255, 0.05);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 200, 152, 0.5);
    text-align: center;
    width: 80%;
    max-width: 600px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
    color: #00c698;
    text-shadow: 0 0 10px #00c698;
}

#urlInput {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #00c698;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
}

#urlInput::placeholder {
    color: #ccc;
}

#proxyButton {
    padding: 10px 20px;
    background-color: #00c698;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 200, 152, 0.7);
}

#proxyButton:hover {
    background-color: #00a37d;
}

#content {
    margin-top: 20px;
    text-align: left;
    border: 1px solid #00c698;
    padding: 10px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        width: 95%;
    }

    #urlInput {
        width: calc(100% - 10px);
    }
}

.error {
    color: #ff4d4d;
}
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Encrypted Web Proxy</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div id="particles-js"></div>
    <div class="container">
        <h1>Encrypted Web Proxy</h1>
        <input type="text" id="urlInput" placeholder="Enter URL">
        <button id="proxyButton">Go</button>
        <div id="content"></div>
    </div>
    <script src="particles.js"></script>
    <script src="script.js"></script>
    <script>
        particlesJS.load('particles-js', 'particles.json', function() {
          console.log('callback - particles.js config loaded');
        });
    </script>
</body>
</html>