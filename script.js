file: script.js
content:

```js
// Module imports
import { loginForm, settingsForm, dashboard } from './modules/forms.js';
import { proxyConnection } from './modules/proxy.js';
import { errorHandler } from './modules/errors.js';

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
  loginForm.init();
  settingsForm.init();
  dashboard.init();
  proxyConnection.init();
});

// Error handling
window.addEventListener('error', (error) => {
  errorHandler.handle(error);
});
```