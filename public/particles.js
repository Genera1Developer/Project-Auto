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
                    value: ""
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: ""
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
                    color: "",
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
                    var localStorageKeyPrefix = "particlesJS_";
                    var sessionKeyPrefix = "sessionParticlesJS_";
                    var colorUpdateInterval = 5000;
                    var useSessionStorage = false;
                    var encryptionKeySalt = "particle_salt";
                    var aesKeySize = 256;
                    var hmacKey = CryptoJS.lib.WordArray.random(aesKeySize / 8).toString();
                    var colorData = {
                        color: initialColorSeed,
                        strokeColor: initialColorSeed
                    };
                    var linkedColorData = {
                        linkColor: initialLinkedColorSeed
                    };

                    var generateKey = function(seed) {
                      let keyMaterial = seed + encryptionKeySalt;
                      let shaObj = CryptoJS.algo.SHA256.create();
                      shaObj.update(keyMaterial);
                      return shaObj.finalize().toString().substring(0, aesKeySize / 4);
                    };

                    var encryptData = function(data, secret) {
                        try {
                           let key = CryptoJS.enc.Utf8.parse(secret);
                            let iv = CryptoJS.lib.WordArray.random(128 / 8);
                            let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(data)), key, {
                                iv: iv,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7
                            });
                            let hmac = CryptoJS.HmacSHA256(encrypted.ciphertext.toString(), hmacKey);
                            let ivString = iv.toString(CryptoJS.enc.Base64);
                            return {
                                ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
                                iv: ivString,
                                hmac: hmac.toString()
                            };
                        } catch (err) {
                            console.error("Encrypt error:", err);
                            return null;
                        }
                    };

                    var decryptData = function(encryptedData, secret) {
                        try {
                            let key = CryptoJS.enc.Utf8.parse(secret);
                            let iv = CryptoJS.enc.Base64.parse(encryptedData.iv);
                            let ciphertext = CryptoJS.enc.Base64.parse(encryptedData.ciphertext);
                            let hmac = encryptedData.hmac;

                            let calculatedHmac = CryptoJS.HmacSHA256(ciphertext.toString(), hmacKey).toString();
                            if (calculatedHmac !== hmac) {
                                console.error("HMAC verification failed!");
                                return null;
                            }

                            let decrypted = CryptoJS.AES.decrypt({
                                ciphertext: ciphertext
                            }, key, {
                                iv: iv,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7
                            });

                            let decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
                            return decryptedText ? JSON.parse(decryptedText) : null;
                        } catch (err) {
                            console.error("Decrypt error:", err);
                            return null;
                        }
                    };

                    var updateColors = function(decryptedColorData, decryptedLinkedColorData) {
                        try {
                            if (decryptedColorData && e.particles.color) {
                                e.particles.color.value = "#" + decryptedColorData.color;
                                if (e.particles.shape && e.particles.shape.stroke) {
                                    e.particles.shape.stroke.color = "#" + decryptedColorData.strokeColor;
                                }
                            }
                            if (decryptedLinkedColorData && e.particles.line_linked) {
                                e.particles.line_linked.color = "#" + decryptedLinkedColorData.linkColor;
                            }
                        } catch (updateColorsError) {
                            console.error("Color Update Error:", updateColorsError);
                        }
                    };

                    var retrieveEncryptedData = function(key, defaultValue) {
                        var storage = useSessionStorage ? sessionStorage : localStorage;
                        var storageKeyPrefixToUse = useSessionStorage ? sessionKeyPrefix : localStorageKeyPrefix;
                        try {
                            var storedData = storage.getItem(storageKeyPrefixToUse + key);
                            if (!storedData) return defaultValue;

                            try {
                                var parsedData = JSON.parse(storedData);
                                if (!parsedData || !parsedData.ciphertext || !parsedData.iv || !parsedData.hmac) {
                                    storage.removeItem(storageKeyPrefixToUse + key);
                                    return defaultValue;
                                }
                                return parsedData;
                            } catch (jsonError) {
                                console.warn("Invalid JSON in storage, removing:", key);
                                storage.removeItem(storageKeyPrefixToUse + key);
                                return defaultValue;
                            }

                        } catch (err) {
                            console.error("Retrieve error:", err);
                            storage.removeItem(storageKeyPrefixToUse + key);
                            return defaultValue;
                        }
                    };

                    var storeEncryptedData = function(key, data) {
                        var storage = useSessionStorage ? sessionStorage : localStorage;
                        var storageKeyPrefixToUse = useSessionStorage ? sessionKeyPrefix : localStorageKeyPrefix;
                        try {
                            if (!data || !data.ciphertext || !data.iv || !data.hmac) {
                                console.warn("Invalid data for storage:", data);
                                return;
                            }
                            storage.setItem(storageKeyPrefixToUse + key, JSON.stringify(data));
                        } catch (err) {
                            console.error("Store error:", err);
                        }
                    };

                    var getRandomHexColor = function() {
                        let color = Math.floor(Math.random() * 16777215).toString(16);
                        return color.length === 6 ? color : '0' + color;
                    };

                    var loadInitialColorData = function() {
                        var storedColorData = retrieveEncryptedData("colorData", null);
                        var colorSecret = generateKey(initialColorSeed);
                        var encryptedColorData = storedColorData || encryptData(colorData, colorSecret);
                        var decryptedColorData = encryptedColorData ? decryptData(encryptedColorData, colorSecret) : null;
                        return {encryptedColorData: encryptedColorData, decryptedColorData: decryptedColorData};
                    };

                    var loadInitialLinkedColorData = function() {
                        var storedLinkedColorData = retrieveEncryptedData("linkedLinkedColorData", null);
                        var linkedColorSecret = generateKey(initialLinkedColorSeed);
                        var encryptedLinkedColorData = storedLinkedColorData || encryptData(linkedColorData, linkedColorSecret);
                        var decryptedLinkedColorData = encryptedLinkedColorData ? decryptData(encryptedLinkedColorData, linkedColorSecret) : null;
                        return {encryptedLinkedColorData: encryptedLinkedColorData, decryptedLinkedColorData: decryptedLinkedColorData};
                    };

                    var {encryptedColorData, decryptedColorData} = loadInitialColorData();
                    var {encryptedLinkedColorData, decryptedLinkedColorData} = loadInitialLinkedColorData();

                    updateColors(decryptedColorData, decryptedLinkedColorData);

                    var updateColorsAndSchedule = function() {
                        try {
                            var newColor = getRandomHexColor();
                            var newStrokeColor = getRandomHexColor();
                            var newLinkColor = getRandomHexColor();

                            var newColorData = {
                                color: newColor,
                                strokeColor: newStrokeColor
                            };
                            var newLinkedColorData = {
                                linkColor: newLinkColor
                            };

                            var colorDataToEncrypt = Object.assign({}, newColorData, {
                                timestamp: Date.now()
                            });
                            var linkedColorDataToEncrypt = Object.assign({}, newLinkedColorData, {
                                timestamp: Date.now()
                            });

                            var colorSecret = generateKey(newColor);
                            encryptedColorData = encryptData(colorDataToEncrypt, colorSecret);
                            storeEncryptedData("colorData", encryptedColorData);

                            var linkedColorSecret = generateKey(newLinkColor);
                            encryptedLinkedColorData = encryptData(linkedColorDataToEncrypt, linkedColorSecret);
                            storeEncryptedData("linkedLinkedColorData", encryptedLinkedColorData);

                            decryptedColorData = encryptedColorData ? decryptData(encryptedColorData, colorSecret) : null;
                            decryptedLinkedColorData = encryptedLinkedColorData ? decryptData(encryptedLinkedColorData, linkedColorSecret) : null;

                            if (decryptedColorData && decryptedLinkedColorData) {
                                updateColors(decryptedColorData, decryptedLinkedColorData);
                            } else {
                                console.warn("Decryption failed, using previous color data");
                                if (decryptedColorData) updateColors(decryptedColorData, null);
                                if (decryptedLinkedColorData) updateColors(null, decryptedLinkedColorData);
                            }

                            setTimeout(updateColorsAndSchedule, colorUpdateInterval);
                        } catch (cryptoIntervalError) {
                            console.error("CryptoJS Interval Error:", cryptoIntervalError);
                            colorUpdateInterval = Math.min(colorUpdateInterval * 2, 60000);
                            setTimeout(updateColorsAndSchedule, colorUpdateInterval);
                        }
                    };

                     var firstColor = getRandomHexColor();
                     var firstStrokeColor = getRandomHexColor();
                     var firstLinkColor = getRandomHexColor();

                     var firstColorData = {
                         color: firstColor,
                         strokeColor: firstStrokeColor
                     };
                     var firstLinkedColorData = {
                         linkColor: firstLinkColor
                     };

                    var colorDataToEncrypt = Object.assign({}, firstColorData, {
                        timestamp: Date.now()
                    });
                    var linkedColorDataToEncrypt = Object.assign({}, firstLinkedColorData, {
                        timestamp: Date.now()
                    });

                    var colorSecret = generateKey(firstColor);
                    encryptedColorData = encryptData(colorDataToEncrypt, colorSecret);
                    storeEncryptedData("colorData", encryptedColorData);

                    var linkedColorSecret = generateKey(firstLinkColor);
                    encryptedLinkedColorData = encryptData(linkedColorDataToEncrypt, linkedColorSecret);
                    storeEncryptedData("linkedLinkedColorData", encryptedLinkedColorData);

                    decryptedColorData = encryptedColorData ? decryptData(encryptedColorData, colorSecret) : null;
                    decryptedLinkedColorData = encryptedLinkedColorData ? decryptData(encryptedLinkedColorData, linkedColorSecret) : null;
                    updateColors(decryptedColorData, decryptedLinkedColorData);

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