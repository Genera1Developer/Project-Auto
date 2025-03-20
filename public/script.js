document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('preloader-hidden');
        });
    }

    // Password Toggle
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function (e) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Captcha Refresh
    const captchaImage = document.getElementById('captchaImage');
    const refreshCaptchaButton = document.querySelector('button[onclick="refreshCaptcha()"]');

    function refreshCaptcha() {
        if (captchaImage) {
            captchaImage.src = '/api/captcha?' + new Date().getTime();
        }
    }

    if (refreshCaptchaButton) {
        refreshCaptchaButton.addEventListener('click', refreshCaptcha);
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const captcha = document.getElementById('captcha').value;
            const errorMessage = document.getElementById('error-message');
            const encryptionStatus = document.getElementById('encryption-status');
            const encryptionAnimation = document.getElementById('encryptionAnimation');

            if (!username || !password || !captcha) {
                errorMessage.textContent = 'Please enter all fields.';
                return;
            }

            if (encryptionAnimation) {
                encryptionAnimation.style.display = 'block';
            }
            errorMessage.textContent = '';
            encryptionStatus.textContent = 'Encrypting...';

            // Simulate encryption delay (for visual effect)
            setTimeout(() => {
                // Simulate client-side encryption (replace with actual encryption)
                const encryptedData = btoa(JSON.stringify({ username: username, password: password, captcha: captcha }));

                fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Encryption': 'true' // Indicate encryption
                    },
                    body: JSON.stringify({ data: encryptedData }) // Send encrypted data
                })
                .then(response => {
                    if (encryptionAnimation) {
                        encryptionAnimation.style.display = 'none';
                    }
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        errorMessage.textContent = '';
                        encryptionStatus.textContent = 'Encrypted connection established.';
                        window.location.href = '/index.html';
                         // Show success alert
                         showAlert('Login successful. Secure connection established.', 'success');
                    } else {
                        errorMessage.textContent = data.message || 'Invalid username or password.';
                        encryptionStatus.textContent = 'Login failed. Encryption in transit.';
                         // Show error alert
                         showAlert(data.message || 'Login failed. Check credentials and try again.', 'error');
                    }
                })
                .catch(error => {
                    if (encryptionAnimation) {
                        encryptionAnimation.style.display = 'none';
                    }
                    console.error('Error:', error);
                    errorMessage.textContent = 'An error occurred during login.';
                    encryptionStatus.textContent = 'Connection error.';
                     // Show error alert
                     showAlert('An error occurred during login. Please try again later.', 'error');
                });
            }, 1500); // Simulate 1.5 seconds of encryption
        });
    }

    // Particle.js Initialization
    if (typeof particlesJS === 'function') {
        particlesJS.load('particles-js', 'public/particles-config.json', function() {
            console.log('particles.js loaded - callback');
        });
    } else {
        console.warn('particlesJS function not found. Ensure particles.js is loaded.');
    }

    // Function to show a custom alert
    function showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `custom-alert ${type}`;
        alertContainer.textContent = message;
        document.body.appendChild(alertContainer);

        // Remove the alert after a few seconds
        setTimeout(() => {
            alertContainer.classList.add('fade-out'); // Add fade-out class
            setTimeout(() => {
                alertContainer.remove();
            }, 500); // Wait for fade-out animation
        }, 3000); // Adjust time as needed
    }
});
edit filepath: public/style.css
content: body {
    font-family: 'Arial', sans-serif;
    background-color: #000;
    color: #fff;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden; /* Hide scrollbars */
}

.login-container {
    background-color: rgba(0, 0, 0, 0.8);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    text-align: center;
    width: 400px;
    transition: all 0.3s ease;
}

.login-container:hover {
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
}

h2 {
    color: #00ffff;
    margin-bottom: 20px;
    text-shadow: 0 0 10px #00ffff;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    text-align: left;
    margin-bottom: 5px;
    color: #eee;
}

input[type="text"],
input[type="password"],
input[type="captcha"] {
    width: 100%;
    padding: 12px;
    border: none;
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="captcha"]:focus {
    background-color: rgba(255, 255, 255, 0.2);
    outline: none;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.captcha-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.captcha-image {
    border-radius: 5px;
}

button {
    padding: 12px 25px;
    border: none;
    background-color: #00ffff;
    color: #000;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

button:hover {
    background-color: #00bfff;
    color: #000;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

#error-message {
    color: #ff4d4d;
    margin-top: 10px;
    font-weight: bold;
}

#encryption-status {
    color: #00ffff;
    margin-top: 10px;
    font-style: italic;
}

#encryptionAnimation {
    display: none;
    margin-top: 10px;
}

.encryption-spinner {
    border: 5px solid rgba(0, 255, 255, 0.3);
    border-top: 5px solid #00ffff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Password Toggle Icon */
#togglePassword {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #aaa;
}

/* Custom Alert Styles */
.custom-alert {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 15px 30px;
    border-radius: 5px;
    z-index: 1000;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.custom-alert.error {
    background-color: #f44336;
}

.custom-alert.fade-out {
    opacity: 0;
}

/* Particles.js container */
#particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1; /* Behind all content */
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .login-container {
        width: 90%;
        padding: 20px;
    }

    input[type="text"],
    input[type="password"],
    input[type="captcha"] {
        padding: 10px;
    }

    button {
        padding: 10px 20px;
    }
}
edit filepath: public/particles-config.json
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
      "value": "#00ffff"
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
      "value": 0.7,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
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
      "color": "#00ffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "none",
      "random": true,
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
        "opacity": 8,
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