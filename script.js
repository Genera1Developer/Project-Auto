file path: script.js
content: 
```javascript
// Import required modules
import { fetch, btoa } from 'whatwg-fetch';
import { set, get } from 'idb-keyval';

// Proxy settings
const proxy = {
  host: 'localhost',
  port: 8080,
  protocol: 'http',
  auth: false,
  username: '',
  password: '',
  bandwidthLimit: 0,
  bandwidthUsage: 0
};

// DOM elements
const form = document.getElementById('form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const statusIndicator = document.getElementById('status-indicator');
const connectionStatus = document.getElementById('connection-status');
const errorMessage = document.getElementById('error-message');

// Event listeners
form.addEventListener('submit', login);

// Functions
async function login(e) {
  e.preventDefault();

  // Clear error message
  errorMessage.textContent = '';

  // Get form data
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Basic authentication
  const authHeader = btoa(`${username}:${password}`);

  // Set proxy settings
  proxy.auth = authHeader;

  // Connect to proxy
  try {
    const res = await fetch('https://whatismyipaddress.com/api/v1/ip-address');
    const data = await res.json();
    connectionStatus.textContent = `Connected: ${data.country}`;
  } catch (err) {
    errorMessage.textContent = err.message;
  }
}

// Initialize proxy settings from IndexedDB
async function loadSettings() {
  const settings = await get('proxy-settings');
  if (settings) {
    Object.assign(proxy, settings);
    updateProxySettings();
  }
}

// Update proxy settings in UI
function updateProxySettings() {
  document.getElementById('proxy-host').value = proxy.host;
  document.getElementById('proxy-port').value = proxy.port;
  document.getElementById('proxy-protocol').value = proxy.protocol;
  document.getElementById('proxy-auth').checked = proxy.auth;
  document.getElementById('proxy-username').value = proxy.username;
  document.getElementById('proxy-password').value = proxy.password;
  document.getElementById('proxy-bandwidth-limit').value = proxy.bandwidthLimit;
}

// Save proxy settings to IndexedDB
async function saveSettings() {
  const settings = {
    host: document.getElementById('proxy-host').value,
    port: document.getElementById('proxy-port').value,
    protocol: document.getElementById('proxy-protocol').value,
    auth: document.getElementById('proxy-auth').checked,
    username: document.getElementById('proxy-username').value,
    password: document.getElementById('proxy-password').value,
    bandwidthLimit: document.getElementById('proxy-bandwidth-limit').value
  };

  await set('proxy-settings', settings);
  proxy = settings;
  updateProxySettings();
}

// Load settings on page load
loadSettings();
```