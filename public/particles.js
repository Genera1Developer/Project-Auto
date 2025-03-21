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
            var loadParticles = function() {
                try {
                    window.particlesJS ? window.particlesJS("particles-js", e) : setTimeout(loadParticles, 500);
                } catch (n) {
                    console.error("particlesJS init error:", n);
                    setTimeout(loadParticles, 500);
                }
            };

            if (typeof CryptoJS === 'undefined') {
                var script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
                script.integrity = 'sha384-xxxx';
                script.crossOrigin = 'anonymous';
                script.onload = function () {
                  try {
                    loadParticles();
                  } catch (n) {
                    console.error("CryptoJS Load Error:", n);
                    loadParticles();
                  }
                };
                script.onerror = function() {
                    var backupData = {
                        color: "f0f0f0",
                        strokeColor: "f0f0f0",
                        linkColor: "f0f0f0"
                    };
                    try {
                      var encryptionKey = CryptoJS.SHA256("fallback_key").toString();
                      var encrypted = CryptoJS.AES.encrypt(JSON.stringify(backupData), encryptionKey).toString();
                      try {
                        var bytes  = CryptoJS.AES.decrypt(encrypted, encryptionKey);
                        var decrypted = bytes.toString(CryptoJS.enc.Utf8);
                        if (decrypted) {
                           backupData = JSON.parse(decrypted);
                        } else {
                          backupData = {
                              color: "cccccc",
                              strokeColor: "cccccc",
                              linkColor: "cccccc"
                          };
                        }
                      } catch (decryptError) {
                        console.error("CryptoJS Decrypt Backup Error:", decryptError);
                         backupData = {
                              color: "dddddd",
                              strokeColor: "dddddd",
                              linkColor: "dddddd"
                          };
                      }
                    } catch (cryptoError) {
                      console.error("CryptoJS Backup Error:", cryptoError);
                      backupData = {
                            color: "cccccc",
                            strokeColor: "cccccc",
                            linkColor: "cccccc"
                        };
                    }
                    e.particles.color.value = "#"+backupData.color;
                     if (e.particles.shape && e.particles.shape.stroke) {
                        e.particles.shape.stroke.color = "#"+backupData.strokeColor;
                    }
                    if (e.particles.line_linked) {
                        e.particles.line_linked.color = "#"+backupData.linkColor;
                    }
                    loadParticles();
                }
                document.head.appendChild(script);
            } else {
                try {
                    var initialColorSeed = "f5c3bb";
                    var initialLinkedColorSeed = "9b59b6";
                    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
                    var masterKey = CryptoJS.SHA256("master_key_" + salt).toString();

                    var encryptData = function(data, key) {
                      try {
                        var iv = CryptoJS.lib.WordArray.random(128/8);
                        var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });
                         var combinedData = iv.toString() + encrypted.toString();
                        var hmac = CryptoJS.HmacSHA256(combinedData, masterKey).toString();
                        return hmac + combinedData;
                      } catch (err) {
                        console.error("Encrypt error:", err);
                        return null;
                      }
                    };

                    var decryptData = function(encryptedData, key) {
                      try {
                        var hmac = encryptedData.substring(0, 64);
                        var combinedData = encryptedData.substring(64);
                        var calculatedHmac = CryptoJS.HmacSHA256(combinedData, masterKey).toString();

                        if (hmac !== calculatedHmac) {
                            console.error("HMAC verification failed!");
                            return null;
                        }
                        var iv = CryptoJS.enc.Hex.parse(combinedData.substring(0, 32));
                        var encrypted = combinedData.substring(32);
                        var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });

                        var decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
                        return decryptedText ? JSON.parse(decryptedText) : null;
                      } catch (err) {
                        console.error("Decrypt error:", err);
                        return null;
                      }
                    };

                    var colorData = { color: initialColorSeed, strokeColor: initialColorSeed };
                    var linkedColorData = { linkColor: initialLinkedColorSeed };

                    var encryptedColorData = encryptData(colorData, masterKey);
                    var encryptedLinkedColorData = encryptData(linkedColorData, masterKey);

                    var updateColors = function(encryptedColorData, encryptedLinkedColorData) {
                      var decryptedColorData = decryptData(encryptedColorData, masterKey);
                      var decryptedLinkedColorData = decryptData(encryptedLinkedColorData, masterKey);

                      if (decryptedColorData) {
                        if(e.particles.color) e.particles.color.value = "#" + CryptoJS.MD5(decryptedColorData.color).toString().substring(0,6);
                        if (e.particles.shape && e.particles.shape.stroke) {
                          e.particles.shape.stroke.color = "#" + CryptoJS.MD5(decryptedColorData.strokeColor).toString().substring(0,6);
                        }
                      }
                      if (decryptedLinkedColorData) {
                        if (e.particles.line_linked) {
                          e.particles.line_linked.color = "#" + CryptoJS.MD5(decryptedLinkedColorData.linkColor).toString().substring(0,6);
                        }
                      }
                    };

                    updateColors(encryptedColorData, encryptedLinkedColorData);

                    var colorUpdateInterval = 5000;

                    var updateColorsAndSchedule = function() {
                        try {
                            var newSalt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
                            var keyMaterial = initialColorSeed + Date.now() + newSalt;
                            var derivedKey = CryptoJS.SHA256(keyMaterial).toString();

                            colorData = { color: derivedKey.substring(0,6), strokeColor: derivedKey.substring(6,12) };
                            encryptedColorData = encryptData(colorData, masterKey);

                            newSalt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
                            keyMaterial = initialLinkedColorSeed + Date.now() + newSalt;
                            derivedKey = CryptoJS.SHA256(keyMaterial).toString();
                            linkedColorData = { linkColor: derivedKey.substring(0,6) };
                            encryptedLinkedColorData = encryptData(linkedColorData, masterKey);

                            updateColors(encryptedColorData, encryptedLinkedColorData);

                            setTimeout(updateColorsAndSchedule, colorUpdateInterval);
                        } catch (cryptoIntervalError) {
                            console.error("CryptoJS Interval Error:", cryptoIntervalError);
                            colorUpdateInterval = Math.min(colorUpdateInterval * 2, 60000);
                            setTimeout(updateColorsAndSchedule, colorUpdateInterval);
                        }
                    };

                     setTimeout(updateColorsAndSchedule, colorUpdateInterval);

                 } catch (cryptoUpdateError) {
                    console.error("CryptoJS Update Error:", cryptoUpdateError);
                 }
                loadParticles();
            }
        };

        var instance = t();

        return instance;
    }
});