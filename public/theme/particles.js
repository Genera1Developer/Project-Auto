file: public/theme/particles.js

```javascript
import { createParticles, animateParticles } from '../src/utils/particles';
import { resetCanvas, resizeCanvas } from '../src/utils/canvas';

const initParticles = () => {
  let canvas = document.getElementById('canvas');
  if (!canvas) throw new Error('Canvas not found');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not found');

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('load', () => {
    resetCanvas(canvas);
    const particles = createParticles(ctx, 100, canvas.width, canvas.height);
    animateParticles(ctx, particles);
  });
};

export { initParticles };
```