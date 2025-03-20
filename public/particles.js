// Initialize particles.js if the element exists
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": '#007bff' // Encryption-themed color
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": '#000000'
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
                    "color": '#007bff', // Encryption-themed color
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
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": 'canvas',
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": 'repulse'
                    },
                    "onclick": {
                        "enable": true,
                        "mode": 'push'
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
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
                        "distance": 200
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true,
            "config_demo": {
                "hide_card": false,
                "background_color": '#1e272e',
                "background_image": '',
                "background_position": '50% 50%',
                "background_repeat": 'no-repeat',
                "background_size": 'cover'
            }
        });
    }
});
edit filepath: public/style.css
content: body {
    font-family: 'Arial', sans-serif;
    background-color: #1e272e; /* Dark, encryption-themed background */
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #fff; /* Light text for contrast */
}

#particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1; /* Behind the content */
}

.container {
    background-color: rgba(30, 39, 46, 0.8); /* Semi-transparent background */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 80%;
    max-width: 600px;
}

h1 {
    color: #007bff; /* Encryption blue */
}

#urlInput {
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #555;
    border-radius: 4px;
    background-color: #333;
    color: #fff;
}

#proxyButton {
    padding: 10px 20px;
    background-color: #007bff; /* Encryption blue */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#proxyButton:hover {
    background-color: #0056b3;
}

#content {
    margin-top: 20px;
    text-align: left;
    border: 1px solid #555;
    padding: 10px;
    border-radius: 4px;
    background-color: #222;
    overflow-x: auto; /* Enable horizontal scrolling for long content */
}

/* Error messages */
.error {
    color: #ff4d4d;
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
edit filepath: public/index.html
content: <!DOCTYPE html>
<html>
<head>
    <title>Web Proxy - Secure Access</title>
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
</body>
</html>