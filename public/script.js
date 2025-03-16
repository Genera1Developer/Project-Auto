document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('urlForm');
    const urlInput = document.getElementById('url');
    const proxyOutput = document.getElementById('proxyOutput');
    const particlesContainer = document.getElementById('particles-js');

    // Function to update the particles theme based on URL input
    const updateParticlesTheme = (url) => {
        let theme = 'default';
        if (url.includes('secure')) {
            theme = 'secure';
        } else if (url.includes('danger')) {
            theme = 'danger';
        }

        // Modify particles.js config based on the theme
        if (theme === 'secure') {
            particlesContainer.style.backgroundColor = '#003366'; // Deep blue for secure
            // Example: Change particle color to green
            window.particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#00FF00" // Green for secure
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
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
                        "color": "#00FF00", // Green for secure
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
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
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
                    "background_color": "#000000",
                    "background_image": "",
                    "source_code": false,
                    "start_paused": false,
                    "fps_limit": 60,
                    "open_selector": false,

                }
            });
        } else if (theme === 'danger') {
            particlesContainer.style.backgroundColor = '#8B0000'; // Dark red for danger
            // Example: Change particle color to red
             window.particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#FF0000" // Red for danger
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
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
                        "color": "#FF0000", // Red for danger
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
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
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
                    "background_color": "#000000",
                    "background_image": "",
                    "source_code": false,
                    "start_paused": false,
                    "fps_limit": 60,
                    "open_selector": false,

                }
            });
        } else {
            particlesContainer.style.backgroundColor = '#222222'; // Default dark gray
            // Default particle configuration
             window.particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff" // Default white
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
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
                        "color": "#ffffff", // Default white
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
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
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
                    "background_color": "#000000",
                    "background_image": "",
                    "source_code": false,
                    "start_paused": false,
                    "fps_limit": 60,
                    "open_selector": false,

                }
            });
        }
    };

    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value;
        updateParticlesTheme(url); // Update particles based on URL
        try {
            const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const encryptedData = await response.text();

            // Decrypt the data (call decrypt function from decryption.js)
            const decryptedData = await decryptData(encryptedData);

            proxyOutput.textContent = decryptedData;
        } catch (error) {
            console.error('Error fetching proxy content:', error);
            proxyOutput.textContent = 'An error occurred while fetching the content.';
        }
    });

    // Initial particles setup
    window.particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
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
                "color": "#ffffff",
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
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
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
            "background_color": "#000000",
            "background_image": "",
            "source_code": false,
            "start_paused": false,
            "fps_limit": 60,
            "open_selector": false,

        }
    });
});

// Decryption function (assumed to be defined in decryption.js)
async function decryptData(encryptedData) {
    try {
        const response = await fetch('/api/decrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: encryptedData })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const decryptedData = await response.text();
        return decryptedData;
    } catch (error) {
        console.error('Decryption error:', error);
        return 'Decryption failed.';
    }
}
edit filepath: api/decrypt.js
content: const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'), 'hex'); // Use environment variable, generate if absent, store securely

function decrypt(encryptedData) {
    try {
        const parts = encryptedData.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        const authTag = Buffer.from(parts.shift(), 'hex');
        const encryptedText = parts.join(':');

        const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        return null; // Or throw the error if you prefer
    }
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { data } = JSON.parse(body);
                if (!data) {
                    res.status(400).send('No data provided for decryption.');
                    return;
                }

                const decryptedData = decrypt(data);

                if (decryptedData === null) {
                    res.status(500).send('Decryption failed.');
                    return;
                }

                res.status(200).send(decryptedData);
            } catch (error) {
                console.error('Error processing decryption request:', error);
                res.status(400).send('Invalid request body.');
            }
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
edit filepath: public/index.css
content: body {
    font-family: Arial, sans-serif;
    background-color: #222;
    color: #fff;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
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

h1 {
    margin-top: 20px;
    color: #00bcd4;
}

#urlForm {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

input[type="text"] {
    padding: 10px;
    margin-bottom: 10px;
    border: none;
    border-radius: 5px;
    width: 300px;
    background-color: #444;
    color: #fff;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #00bcd4;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #008ba7;
}

#proxyOutput {
    margin-top: 20px;
    padding: 15px;
    border: 1px solid #555;
    border-radius: 5px;
    width: 80%;
    min-height: 100px;
    text-align: left;
    background-color: #333;
    overflow-wrap: break-word;
}