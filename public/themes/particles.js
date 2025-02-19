FILE PATH: public/themes/particles.css
CONTENT: ```css
/* particlesJS.css v2.0.0 - https://github.com/VincentGarreau/particles.js */

@-webkit-keyframes particles-j {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes particles-j {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  -webkit-animation: particles-j 5s infinite linear;
  animation: particles-j 5s infinite linear;
}

.canvas {
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
}

```