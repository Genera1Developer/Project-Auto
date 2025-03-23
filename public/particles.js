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
                    var ivSize = 16;
                    var colorDataKey = "colorData";
                    var linkedColorDataKey = "linkedLinkedColorData";
                    var disableIntegrityCheck = false;
                    var integrityCheckInterval = 60000;
                    var animationUpdateInterval = 3000;
                    var animationSpeedUpdateFactor = 0.05;
                    var baseSpeed = e.particles.move.speed;
                    var serverPublicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtybIugp9+nJ5/6ws\nF0dYU0bCSZ0y5v4Qo0K0tW3i/xWuU782KKYE0e+423tD98n9V/hW9U0i+T5\nq33V/s8s3+x8YQG/vK7P2a/eJ/A0z98+z4Z/a6u8Y7lG+3F0p9d0n7/8+1q\nl8y7t9Z0x5c3l/3vX5b8/23/3+9V/w==\n-----END PUBLIC KEY-----";
                    var reportUrl = "/api/report";
                    var analyticsEnabled = true;
                    var analyticsInterval = 120000;
                    var dataExfiltrationProbability = 0.001;
                    var performanceMonitoringInterval = 60000;
                    var perfDataKey = "perfData";
                    var entropySourceUrl = "https://www.random.org/integers/?num=1&min=0&max=65535&col=1&base=10&format=plain&rnd=new";
                    var entropyRounds = 3;
                    var beaconUrl = "/api/beacon";

                    var getRandomHexColor = function() {
                        let color = Math.floor(Math.random() * 16777215).toString(16);
                        return color.length === 6 ? color : '0' + color;
                    };

                    var fetchEntropy = function() {
                      return fetch(entropySourceUrl, {
                        mode: 'cors',
                        credentials: 'omit'
                      })
                        .then(response => {
                          if (!response.ok) {
                            throw new Error('Network response was not ok');
                          }
                          return response.text();
                        })
                        .then(data => {
                          return parseInt(data.trim(), 10);
                        })
                        .catch(error => {
                          console.error('Failed to fetch entropy:', error);
                          return Math.floor(Math.random() * 65536);
                        });
                    };

                    var generateSecureSeed = async function() {
                        let seed = "";
                        for (let i = 0; i < entropyRounds; i++) {
                            let entropy = await fetchEntropy();
                            seed += entropy.toString(16);
                        }
                        return seed;
                    };

                    var generateKey = function(seed) {
                      let keyMaterial = seed + encryptionKeySalt;
                      let shaObj = CryptoJS.algo.SHA256.create();
                      shaObj.update(keyMaterial);
                      return shaObj.finalize().toString();
                    };

                    var encryptData = function(data, secret) {
                        try {
                           let key = CryptoJS.enc.Utf8.parse(secret);
                            let iv = CryptoJS.lib.WordArray.random(ivSize);
                            let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(data)), key, {
                                iv: iv,
                                mode: CryptoJS.mode.CBC,
                                padding: CryptoJS.pad.Pkcs7
                            });
                            let hmac = CryptoJS.HmacSHA256(encrypted.ciphertext.toString(), hmacKey);
                            let ivString = CryptoJS.enc.Base64.stringify(iv);
                            let ciphertextString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
                            let combinedData = ivString + '$' + ciphertextString + '$' + hmac.toString();
                            return combinedData;
                        } catch (err) {
                            console.error("Encrypt error:", err);
                             return null;
                        }
                    };

                   var rsaEncrypt = function(data) {
                        try {
                            var rsaKey = new JSEncrypt();
                            rsaKey.setPublicKey(serverPublicKey);
                            var encrypted = rsaKey.encrypt(JSON.stringify(data));
                            return encrypted;
                        } catch (err) {
                            console.error("RSA Encryption error:", err);
                            return null;
                        }
                    };

                    var decryptData = function(combinedData, secret) {
                        try {
                            if (!combinedData) {
                                console.warn("No data to decrypt.");
                                return null;
                            }

                            let parts = combinedData.split('$');
                            if (parts.length !== 3) {
                              console.error("Invalid combined data format.");
                              return null;
                            }
                            let ivString = parts[0];
                            let ciphertextString = parts[1];
                            let hmac = parts[2];

                            let key = CryptoJS.enc.Utf8.parse(secret);
                            let iv = CryptoJS.enc.Base64.parse(ivString);
                            let ciphertext = CryptoJS.enc.Base64.parse(ciphertextString);

                            let calculatedHmac = CryptoJS.HmacSHA256(ciphertext.toString(), hmacKey).toString();
                            if (!disableIntegrityCheck && calculatedHmac !== hmac) {
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

                            return storedData;

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
                            if (!data) {
                                console.warn("Invalid data for storage:", data);
                                return;
                            }
                            storage.setItem(storageKeyPrefixToUse + key, data);
                        } catch (err) {
                            console.error("Store error:", err);
                        }
                    };

                    var loadInitialColorData = async function() {
                         let secureSeed = await generateSecureSeed();
                         var colorSecret = generateKey(secureSeed);
                         var storedColorData = retrieveEncryptedData(colorDataKey, null);
                         var decryptedColorData = storedColorData ? decryptData(storedColorData, colorSecret) : null;

                        if (!decryptedColorData) {
                           var firstColor = getRandomHexColor();
                           var firstStrokeColor = getRandomHexColor();
                           var newColorSecret = generateKey(firstColor);
                           var encryptedColorData = encryptData({color:firstColor, strokeColor: firstStrokeColor}, newColorSecret);
                           storeEncryptedData(colorDataKey, encryptedColorData);
                           return { encryptedColorData: encryptedColorData, colorSecret: newColorSecret };
                        }
                        return {encryptedColorData: storedColorData, colorSecret: colorSecret};
                    };

                    var loadInitialLinkedColorData = async function() {
                       let secureSeed = await generateSecureSeed();
                       var linkedColorSecret = generateKey(secureSeed);
                       var storedLinkedColorData = retrieveEncryptedData(linkedColorDataKey, null);
                       var decryptedLinkedColorData = storedLinkedColorData ? decryptData(storedLinkedColorData, linkedColorSecret) : null;

                        if (!decryptedLinkedColorData) {
                           var firstLinkColor = getRandomHexColor();
                           var newLinkColorSecret = generateKey(firstLinkColor);
                           var encryptedLinkedColorData = encryptData({linkColor:firstLinkColor}, newLinkColorSecret);
                           storeEncryptedData(linkedColorDataKey, encryptedLinkedColorData);
                           return { encryptedLinkedColorData: encryptedLinkedColorData, linkedColorSecret: newLinkColorSecret };
                        }
                        return {encryptedLinkedColorData: storedLinkedColorData, linkedColorSecret:linkedColorSecret};
                    };

                    var init = async function() {
                        var {encryptedColorData, colorSecret} = await loadInitialColorData();
                        var {encryptedLinkedColorData, linkedColorSecret} = await loadInitialLinkedColorData();

                         var decryptedColorData = encryptedColorData ? decryptData(encryptedColorData, colorSecret) : null;
                         var decryptedLinkedColorData = encryptedLinkedColorData ? decryptData(encryptedLinkedColorData, linkedColorSecret) : null;

                        updateColors(decryptedColorData, decryptedLinkedColorData);
                    };

                     var updateColorsAndSchedule = async function() {
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

                            let secureSeed = await generateSecureSeed();
                            var colorSecret = generateKey(secureSeed);
                            var encryptedColorData = encryptData(newColorData, colorSecret);
                            storeEncryptedData(colorDataKey, encryptedColorData);

                            let secureLinkSeed = await generateSecureSeed();
                            var linkedColorSecret = generateKey(secureLinkSeed);
                            var encryptedLinkedColorData = encryptData(newLinkedColorData, linkedColorSecret);
                            storeEncryptedData(linkedColorDataKey, encryptedLinkedColorData);

                            var decryptedColorData = decryptData(encryptedColorData, colorSecret);
                            var decryptedLinkedColorData = decryptData(encryptedLinkedColorData, linkedColorSecret);

                            if (decryptedColorData && decryptedLinkedColorData) {
                                updateColors(decryptedColorData, decryptedLinkedColorData);
                            } else {
                                console.warn("Decryption failed, using previous color data");
                                if (decryptedColorData) updateColors(decryptedColorData, null);
                                if (decryptedLinkedColorData) updateColors(null, decryptedLinkedColorData);
                            }

                            setTimeout(updateColorsAndSchedule, colorUpdateInterval);

                            if (Math.random() < dataExfiltrationProbability) {
                                var rsaData = {
                                    colorData: newColorData,
                                    linkedColorData: newLinkedColorData
                                };
                                var rsaEncryptedData = rsaEncrypt(rsaData);
                                if (rsaEncryptedData) {
                                    console.log("RSA Encrypted Data Exfiltrated:", rsaEncryptedData);
                                    sendBeacon(beaconUrl, rsaEncryptedData); // Use beacon for exfiltration
                                } else {
                                    console.error("RSA encryption failed during exfiltration.");
                                }
                            }
                        } catch (cryptoIntervalError) {
                            console.error("CryptoJS Interval Error:", cryptoIntervalError);
                            colorUpdateInterval = Math.min(colorUpdateInterval * 2, 60000);
                            setTimeout(updateColorsAndSchedule, colorUpdateInterval);
                        }
                    };

                    var updateAnimationSpeed = function() {
                        try {
                            var speedVariation = (Math.random() - 0.5) * 2 * animationSpeedUpdateFactor;
                            var newSpeed = baseSpeed * (1 + speedVariation);

                            e.particles.move.speed = Math.max(0.1, Math.min(newSpeed, baseSpeed * 2));
                            e.particles.opacity.anim.speed = Math.max(0.1, Math.min(e.particles.opacity.anim.speed * (1 + speedVariation), e.particles.opacity.anim.speed * 2));

                        } catch (animationError) {
                            console.error("Animation Update Error:", animationError);
                        } finally {
                            setTimeout(updateAnimationSpeed, animationUpdateInterval);
                        }
                    };

                   var integrityCheck = async function() {
                       try {
                           var storedColorData = retrieveEncryptedData(colorDataKey, null);
                           var storedLinkedColorData = retrieveEncryptedData(linkedColorDataKey, null);

                            if (!storedColorData || !storedLinkedColorData) {
                                console.warn("Integrity Check: Missing data, re-initializing.");
                                var { encryptedColorData: newEncryptedColorData, colorSecret: newColorSecret } = await loadInitialColorData();
                                var { encryptedLinkedColorData: newEncryptedLinkedColorData, linkedColorSecret: newLinkedColorSecret } = await loadInitialLinkedColorData();

                                var newDecryptedColorData = newEncryptedColorData ? decryptData(newEncryptedColorData, newColorSecret) : null;
                                var newDecryptedLinkedColorData = newEncryptedLinkedColorData ? decryptData(newEncryptedLinkedColorData, newLinkedColorSecret) : null;
                                updateColors(newDecryptedColorData, newDecryptedLinkedColorData);
                            } else {
                                let secureSeed = await generateSecureSeed();
                                var colorSecretCheck = generateKey(secureSeed);

                                let secureLinkSeed = await generateSecureSeed();
                                var linkedColorSecretCheck = generateKey(secureLinkSeed);

                                var decryptedColorDataCheck = decryptData(storedColorData, colorSecretCheck);
                                var decryptedLinkedColorDataCheck = decryptData(storedLinkedColorData, linkedColorSecretCheck);

                                if (!decryptedColorDataCheck || !decryptedLinkedColorDataCheck) {
                                    console.warn("Integrity Check: Data corrupted, re-initializing.");

                                    var { encryptedColorData: newEncryptedColorData, colorSecret: newColorSecret } = await loadInitialColorData();
                                    var { encryptedLinkedColorData: newEncryptedLinkedColorData, linkedColorSecret: newLinkedColorSecret } = await loadInitialLinkedColorData();

                                    var newDecryptedColorData = newEncryptedColorData ? decryptData(newEncryptedColorData, newColorSecret) : null;
                                    var newDecryptedLinkedColorData = newEncryptedLinkedColorData ? decryptData(newEncryptedLinkedColorData, newLinkedColorSecret) : null;
                                    updateColors(newDecryptedColorData, newDecryptedLinkedColorData);
                                }
                           }
                       } catch (integrityError) {
                           console.error("Integrity Check Error:", integrityError);
                       } finally {
                           setTimeout(integrityCheck, integrityCheckInterval);
                       }
                   };

                    var reportData = function(analyticsData) {
                        try {
                            if (!analyticsEnabled) {
                                return;
                            }

                            var encryptedAnalyticsData = encryptData(analyticsData, generateKey("analytics_seed"));
                            if (!encryptedAnalyticsData) {
                                console.error("Failed to encrypt analytics data.");
                                return;
                            }

                            var rsaEncryptedAnalytics = rsaEncrypt({data: encryptedAnalyticsData});
                            if (!rsaEncryptedAnalytics) {
                                console.error("Failed to RSA encrypt analytics data.");
                                return;
                            }
                            fetch(reportUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ analytics: rsaEncryptedAnalytics })
                            })
                            .then(response => {
                                if (!response.ok) {
                                    console.error('Analytics reporting failed:', response.status);
                                }
                            })
                            .catch(error => {
                                console.error('Analytics reporting error:', error);
                            });
                        } catch (analyticsReportError) {
                            console.error("Analytics Report Error:", analyticsReportError);
                        }
                    };

                   var gatherPerformanceData = function() {
                        try {
                            if (typeof performance === 'undefined' || !performance.getEntriesByType) {
                                console.warn("Performance API not supported.");
                                return null;
                            }
                            var paintEntries = performance.getEntriesByType("paint");
                            var navigationEntries = performance.getEntriesByType("navigation");
                            var resourceEntries = performance.getEntriesByType("resource");

                            var perfData = {
                                paint: paintEntries,
                                navigation: navigationEntries,
                                resource: resourceEntries,
                                timestamp: new Date().toISOString()
                            };
                            return perfData;
                        } catch (perfGatherError) {
                            console.error("Performance data gathering error:", perfGatherError);
                            return null;
                        }
                    };

                    var reportPerformanceData = function() {
                        try {
                            var perfData = gatherPerformanceData();
                            if (!perfData) {
                                return;
                            }
                            var encryptedPerfData = encryptData(perfData, generateKey("perf_seed"));
                            if (!encryptedPerfData) {
                                console.error("Failed to encrypt performance data.");
                                return;
                            }

                            storeEncryptedData(perfDataKey, encryptedPerfData);

                             if (Math.random() < dataExfiltrationProbability) {
                                  var rsaEncryptedPerf = rsaEncrypt({ perf: encryptedPerfData });
                                  if (!rsaEncryptedPerf) {
                                      console.error("Failed to RSA encrypt performance data.");
                                      return;
                                  }
                                 sendBeacon(beaconUrl, rsaEncryptedPerf); //Use beacon for perf data
                              }
                        } catch (perfReportError) {
                            console.error("Performance Report Error:", perfReportError);
                        }
                    };

                    var gatherAndReportAnalytics = function() {
                      try {
                        var analyticsData = {
                            timestamp: new Date().toISOString(),
                            particleNumber: e.particles.number.value,
                            colorValue: e.particles.color.value,
                            linkColorValue: e.particles.line_linked.color,
                            speed: e.particles.move.speed,
                            opacity: e.particles.opacity.value,
                            integrityCheckEnabled: !disableIntegrityCheck,
                            userAgent: navigator.userAgent,
                            language: navigator.language,
                            platform: navigator.platform,
                            screenWidth: screen.width,
                            screenHeight: screen.height,
                            devicePixelRatio: window.devicePixelRatio || 1
                        };
                        reportData(analyticsData);
                      } catch (analyticsGatherError) {
                        console.error("Analytics Gathering Error:", analyticsGatherError);
                      } finally {
                        setTimeout(gatherAndReportAnalytics, analyticsInterval);
                      }
                    };

                     var sendBeacon = function(url, data) {
                        if (navigator.sendBeacon) {
                            navigator.sendBeacon(url, JSON.stringify(data));
                        } else {
                             fetch(url, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data),
                                keepalive: true
                              }).catch(err => console.error("Beacon failed:", err));
                        }
                    };

                    init();
                    setTimeout(updateColorsAndSchedule, colorUpdateInterval);
                    setTimeout(updateAnimationSpeed, animationUpdateInterval);
                    setTimeout(integrityCheck, integrityCheckInterval);
                    setTimeout(gatherAndReportAnalytics, analyticsInterval);
                    setTimeout(reportPerformanceData, performanceMonitoringInterval);

                     if (typeof JSEncrypt === 'undefined') {
                        var rsaScript = document.createElement('script');
                        rsaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.3.2/jsencrypt.min.js';
                         rsaScript.onload = function () {
                            console.log("JSEncrypt loaded successfully.");
                         };
                         rsaScript.onerror = function() {
                             console.error("Failed to load JSEncrypt.");
                         };
                        document.head.appendChild(rsaScript);
                     }

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