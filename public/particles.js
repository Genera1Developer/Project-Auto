!function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.particlesJS = t() : e.particlesJS = t()
}(this, function() {
    return function() {
        "use strict";
        var e = {
            particles: {
                number: {
                    value: 100,
                    density: {
                        enable: !0,
                        value_area: 700
                    }
                },
                color: {
                    value: "#" + (typeof CryptoJS !== 'undefined' ? CryptoJS.MD5("f5c3bb").toString().substring(0,6) : "2ecc71")
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#" + (typeof CryptoJS !== 'undefined' ? CryptoJS.MD5("f5c3bb").toString().substring(0,6) : "2ecc71")
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: .5,
                    random: !0,
                    anim: {
                        enable: !0,
                        speed: 0.5,
                        opacity_min: .1,
                        sync: !1
                    }
                },
                size: {
                    value: 3,
                    random: !0,
                    anim: {
                        enable: !1,
                        speed: 40,
                        size_min: .1,
                        sync: !1
                    }
                },
                line_linked: {
                    enable: !0,
                    distance: 150,
                    color: "#" + (typeof CryptoJS !== 'undefined' ? CryptoJS.MD5("9b59b6").toString().substring(0,6) : "3498db"),
                    opacity: .4,
                    width: 1
                },
                move: {
                    enable: !0,
                    speed: 3,
                    direction: "none",
                    random: !0,
                    straight: !1,
                    out_mode: "out",
                    bounce: !1,
                    attract: {
                        enable: !1,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: !0,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: !0,
                        mode: "push"
                    },
                    resize: !0
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
                        opacity: .8,
                        speed: 3
                    },
                    repulse: {
                        distance: 150,
                        duration: .4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: !0
        },
        t = function() {
            if (typeof CryptoJS === 'undefined') {
                var script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
                script.integrity = 'sha384-xxxx';
                script.crossOrigin = 'anonymous';
                script.onload = function () {
                  try {
                    window.particlesJS ? window.particlesJS("particles-js", e) : setTimeout(t, 500);
                  } catch (n) {
                    console.error("particlesJS init error:", n);
                    setTimeout(t, 500);
                  }
                };
                script.onerror = function() {
                    var backupColor = CryptoJS.MD5("backup").toString().substring(0,6);
                    var backupColorEncrypted = CryptoJS.AES.encrypt(backupColor, "secret").toString();
                    var decryptedBackupColor = CryptoJS.AES.decrypt(backupColorEncrypted, "secret").toString(CryptoJS.enc.Utf8);
                    e.particles.color.value = "#"+decryptedBackupColor;
                    e.particles.shape.stroke.color = "#"+decryptedBackupColor;
                    e.particles.line_linked.color = "#"+decryptedBackupColor;
                    try {
                        window.particlesJS ? window.particlesJS("particles-js", e) : setTimeout(t, 500);
                    } catch (n) {
                        console.error("particlesJS init error:", n);
                        setTimeout(t, 500);
                    }
                }
                document.head.appendChild(script);
            } else {
                try {
                    window.particlesJS ? window.particlesJS("particles-js", e) : setTimeout(t, 500);
                } catch (n) {
                    console.error("particlesJS init error:", n);
                    setTimeout(t, 500);
                }
            }
        };
        return t()
    }
});