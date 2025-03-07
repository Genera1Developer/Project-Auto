(() => {
  "use strict";
  const e = {
    NOT_SUPPORTED: "NOT_SUPPORTED",
    UNAUTHORIZED: "UNAUTHORIZED",
    PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
    NOT_ACCEPTABLE: "NOT_ACCEPTABLE",
    PROXY_AUTHENTICATION_REQUIRED: "PROXY_AUTHENTICATION_REQUIRED",
    REQUEST_TIMEOUT: "REQUEST_TIMEOUT",
    CONFLICT: "CONFLICT",
    GONE: "GONE",
    LENGTH_REQUIRED: "LENGTH_REQUIRED",
    PRECONDITION_FAILED: "PRECONDITION_FAILED",
    PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
    URI_TOO_LONG: "URI_TOO_LONG",
    UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",
    RANGE_NOT_SATISFIABLE: "RANGE_NOT_SATISFIABLE",
    EXPECTATION_FAILED: "EXPECTATION_FAILED",
    I_AM_A_TEAPOT: "I_AM_A_TEAPOT",
    MISDIRECTED_REQUEST: "MISDIRECTED_REQUEST",
    UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
    LOCKED: "LOCKED",
    FAILED_DEPENDENCY: "FAILED_DEPENDENCY",
    TOO_EARLY: "TOO_EARLY",
    UPGRADE_REQUIRED: "UPGRADE_REQUIRED",
    PRECONDITION_REQUIRED: "PRECONDITION_REQUIRED",
    TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
    REQUEST_HEADER_FIELDS_TOO_LARGE: "REQUEST_HEADER_FIELDS_TOO_LARGE",
    UNAVAILABLE_FOR_LEGAL_REASONS: "UNAVAILABLE_FOR_LEGAL_REASONS",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
    BAD_GATEWAY: "BAD_GATEWAY",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    GATEWAY_TIMEOUT: "GATEWAY_TIMEOUT",
    HTTP_VERSION_NOT_SUPPORTED: "HTTP_VERSION_NOT_SUPPORTED",
    VARIANT_ALSO_NEGOTIATES: "VARIANT_ALSO_NEGOTIATES",
    INSUFFICIENT_STORAGE: "INSUFFICIENT_STORAGE",
    LOOP_DETECTED: "LOOP_DETECTED",
    NOT_EXTENDED: "NOT_EXTENDED",
    NETWORK_AUTHENTICATION_REQUIRED: "NETWORK_AUTHENTICATION_REQUIRED"
  }, t = {
    [e.NOT_SUPPORTED]: 501,
    [e.UNAUTHORIZED]: 401,
    [e.PAYMENT_REQUIRED]: 402,
    [e.FORBIDDEN]: 403,
    [e.NOT_FOUND]: 404,
    [e.METHOD_NOT_ALLOWED]: 405,
    [e.NOT_ACCEPTABLE]: 406,
    [e.PROXY_AUTHENTICATION_REQUIRED]: 407,
    [e.REQUEST_TIMEOUT]: 408,
    [e.CONFLICT]: 409,
    [e.GONE]: 410,
    [e.LENGTH_REQUIRED]: 411,
    [e.PRECONDITION_FAILED]: 412,
    [e.PAYLOAD_TOO_LARGE]: 413,
    [e.URI_TOO_LONG]: 414,
    [e.UNSUPPORTED_MEDIA_TYPE]: 415,
    [e.RANGE_NOT_SATISFIABLE]: 416,
    [e.EXPECTATION_FAILED]: 417,
    [e.I_AM_A_TEAPOT]: 418,
    [e.MISDIRECTED_REQUEST]: 421,
    [e.UNPROCESSABLE_ENTITY]: 422,
    [e.LOCKED]: 423,
    [e.FAILED_DEPENDENCY]: 424,
    [e.TOO_EARLY]: 425,
    [e.UPGRADE_REQUIRED]: 426,
    [e.PRECONDITION_REQUIRED]: 428,
    [e.TOO_MANY_REQUESTS]: 429,
    [e.REQUEST_HEADER_FIELDS_TOO_LARGE]: 431,
    [e.UNAVAILABLE_FOR_LEGAL_REASONS]: 451,
    [e.INTERNAL_SERVER_ERROR]: 500,
    [e.NOT_IMPLEMENTED]: 501,
    [e.BAD_GATEWAY]: 502,
    [e.SERVICE_UNAVAILABLE]: 503,
    [e.GATEWAY_TIMEOUT]: 504,
    [e.HTTP_VERSION_NOT_SUPPORTED]: 505,
    [e.VARIANT_ALSO_NEGOTIATES]: 506,
    [e.INSUFFICIENT_STORAGE]: 507,
    [e.LOOP_DETECTED]: 508,
    [e.NOT_EXTENDED]: 510,
    [e.NETWORK_AUTHENTICATION_REQUIRED]: 511
  };
  var r = /* @__PURE__ */ ((o) => (o.Open = "open", o.Close = "close", o.Error = "error", o.Message = "message", o.Drain = "drain", o))(r || {});
  const n = {
    parseUrl: (o) => {
      try {
        return new URL(o);
      } catch {
        return null;
      }
    },
    stringifyError: (o) => {
      if (o instanceof Error) {
        const s = {
          name: o.name,
          message: o.message,
          stack: o.stack
        };
        return JSON.stringify(s);
      }
      return String(o);
    },
    generateRandomId: (o = 16) => crypto.getRandomValues(new Uint8Array(o)).reduce((s, i) => s += i.toString(16).padStart(2, "0"), ""),
    /**
     * Encrypts data using AES-GCM.
     * @param {string} data The data to encrypt.
     * @param {CryptoKey} key The encryption key.
     * @param {Uint8Array} iv The initialization vector.
     * @returns {Promise<ArrayBuffer>} The encrypted data.
     */
    encrypt: async (data, key, iv) => {
      if (!data || !key || !iv) {
        throw new Error("Missing data, key, or IV for encryption.");
      }
      try {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        const cipher = await crypto.subtle.encrypt(
          {
            name: "AES-GCM",
            iv
          },
          key,
          encodedData
        );
        return cipher;
      } catch (error) {
        console.error("Encryption error:", error);
        throw new Error(`Encryption failed: ${error.message}`);
      }
    },
    /**
     * Decrypts data using AES-GCM.
     * @param {ArrayBuffer} data The data to decrypt.
     * @param {CryptoKey} key The encryption key.
     * @param {Uint8Array} iv The initialization vector.
     * @returns {Promise<string>} The decrypted data.
     */
    decrypt: async (data, key, iv) => {
      if (!data || !key || !iv) {
        throw new Error("Missing data, key, or IV for decryption.");
      }
      try {
        const decipher = await crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv
          },
          key,
          data
        );
        const decoder = new TextDecoder();
        return decoder.decode(decipher);
      } catch (error) {
        console.error("Decryption error:", error);
        throw new Error(`Decryption failed: ${error.message}`);
      }
    },

    /**
     * Generates a new AES-GCM key.
     * @param {boolean} extractable Whether the key is extractable. Defaults to false.
     * @param {Array<string>} keyUsages The usages for the key. Defaults to ["encrypt", "decrypt"].
     * @returns {Promise<CryptoKey>} The generated key.
     */
    generateKey: async (extractable = false, keyUsages = ["encrypt", "decrypt"]) => {
      try {
        return await crypto.subtle.generateKey(
          {
            name: "AES-GCM",
            length: 256
          },
          extractable,
          keyUsages
        );
      } catch (error) {
        console.error("Key generation error:", error);
        throw new Error(`Key generation failed: ${error.message}`);
      }
    },

    /**
     * Exports a CryptoKey to a JSON Web Key (JWK) format.
     * @param {CryptoKey} key The key to export.
     * @returns {Promise<JsonWebKey>} The exported key in JWK format.
     */
    exportKey: async (key) => {
      try {
        return await crypto.subtle.exportKey("jwk", key);
      } catch (error) {
        console.error("Key export error:", error);
        throw new Error(`Key export failed: ${error.message}`);
      }
    },

    /**
     * Imports a JSON Web Key (JWK) to a CryptoKey.
     * @param {JsonWebKey} jwk The key to import in JWK format.
     * @param {Array<string>} keyUsages The usages for the key. Defaults to ["encrypt", "decrypt"].
     * @returns {Promise<CryptoKey>} The imported key.
     */
    importKey: async (jwk, keyUsages = ["encrypt", "decrypt"]) => {
      try {
        return await crypto.subtle.importKey(
          "jwk",
          jwk,
          {
            name: "AES-GCM"
          },
          true,
          keyUsages
        );
      } catch (error) {
        console.error("Key import error:", error);
        throw new Error(`Key import failed: ${error.message}`);
      }
    },

    /**
     * Generates a new initialization vector (IV).
     * @param {number} length The length of the IV. Defaults to 12.
     * @returns {Uint8Array} The generated IV.
     */
    generateIV: (length = 12) => {
      return crypto.getRandomValues(new Uint8Array(length));
    },

    /**
     * Derives a key from a password using PBKDF2.
     * @param {string} password The password to derive the key from.
     * @param {ArrayBuffer} salt The salt.
     * @param {number} iterations The number of iterations.
     * @returns {Promise<CryptoKey>} The derived key.
     */
    deriveKey: async (password, salt, iterations = 100000) => {
      if (!password || !salt) {
        throw new Error("Missing password or salt for key derivation.");
      }

      try {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
          "raw",
          encoder.encode(password),
          "PBKDF2",
          false,
          ["deriveKey"]
        );

        return await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: salt,
            iterations: iterations,
            hash: "SHA-256"
          },
          keyMaterial,
          {
            name: "AES-GCM",
            length: 256
          },
          true,
          ["encrypt", "decrypt"]
        );
      } catch (error) {
        console.error("Key derivation error:", error);
        throw new Error(`Key derivation failed: ${error.message}`);
      }
    },
    /**
     * Generates a salt.
     * @param {number} length The length of the salt. Defaults to 16.
     * @returns {Uint8Array} The generated salt.
     */
    generateSalt: (length = 16) => {
      return crypto.getRandomValues(new Uint8Array(length));
    }
  };
  class i extends EventTarget {
    constructor() {
      super(...arguments), this.id = n.generateRandomId();
    }
    on(o, s) {
      this.addEventListener(o, s);
    }
    off(o, s) {
      this.removeEventListener(o, s);
    }
    emit(o, s) {
      const i = new Event(o);
      i.data = s, this.dispatchEvent(i);
    }
  }
  const a = "bare-server-protocol", c = "bare-server-error", l = "bare-server-message";
  class u extends i {
    constructor(s) {
      if (super(), this.socket = s, this.closed = false, this.id = n.generateRandomId(), typeof s == "string")
        try {
          this.socket = new WebSocket(s, a);
        } catch (p) {
          this.close(p);
          return;
        }
      this.socket.addEventListener("open", () => {
        this.emit(r.Open);
      }), this.socket.addEventListener("close", (p) => {
        this.closed = true, this.emit(r.Close, p);
      }), this.socket.addEventListener("error", (p) => {
        this.emit(r.Error, p);
      }), this.socket.addEventListener("message", (p) => {
        try {
          const f = JSON.parse(p.data);
          this.emit(r.Message, f);
        } catch (f) {
          this.close(f);
        }
      });
    }
    send(s) {
      if (this.socket.readyState !== WebSocket.OPEN)
        return false;
      try {
        this.socket.send(JSON.stringify(s));
        return true;
      } catch (p) {
        this.close(p);
        return false;
      }
    }
    close(s) {
      if (this.closed)
        return;
      this.closed = true;
      try {
        this.socket.close();
      } catch {
      }
      this.emit(r.Close, s);
    }
  }
  class d extends i {
    constructor(s) {
      super(), this.opts = s, this.origin = this.opts.origin || location.origin, this.path = this.opts.path || "/bare/", this.prefix = this.origin + this.path, this.url = n.parseUrl(this.prefix);
      if (!this.url)
        throw new Error("Invalid origin.");
    }
    async request(s) {
      try {
        const p = await fetch(this.prefix, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(s)
        });
        if (!p.ok) {
          const f = await p.text();
          throw new Error(`HTTP error! status: ${p.status}, body: ${f}`);
        }
        return await p.json();
      } catch (error) {
        console.error("Request error:", error);
        throw new Error(`Request failed: ${error.message}`);
      }
    }
    async ws(s) {
      const p = new u(this.url.href);
      p.on(r.Open, () => {
        p.send(s);
      });
      return new Promise((f, y) => {
        p.on(r.Message, (b) => {
          f(b.data);
        }), p.on(r.Error, (b) => {
          y(b.error);
        }), p.on(r.Close, (b) => {
          if (b.error) {
            y(b.error);
            return;
          }
          y(new Error("WebSocket closed."));
        });
      });
    }
  }
  const h = "https://github.com/tomphttp/bare-client";
  class m extends Error {
    constructor(s, p) {
      super(s), this.cause = p, this.name = "BareError";
    }
  }
  const g = {
    BareClient: d,
    BareError: m,
    constants: e,
    events: r,
    errors: {
      BareClientError: class extends m {
        constructor(s, p) {
          super(s, p), this.name = "BareClientError";
        }
      },
      InvalidBareError: class extends m {
        constructor(s, p) {
          super(s, p), this.name = "InvalidBareError";
        }
      },
      SocketError: class extends m {
        constructor(s, p) {
          super(s, p), this.name = "SocketError";
        }
      }
    },
    utils: n,
    version: "1.0.7",
    homepage: h
  };
  typeof window < "u" && (window.BareClient = g.BareClient, window.BareError = g.BareError), typeof globalThis < "u" && (globalThis.BareClient = g.BareClient, globalThis.BareError = g.BareError);
  const w = g;
  return w;
})();