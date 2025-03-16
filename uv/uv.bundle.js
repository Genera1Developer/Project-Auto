!function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.uv = e() : t.uv = e();
}(this, function() {
    return function(t) {
        var e = {};
        function n(o) {
            if (e[o])
                return e[o].exports;
            var r = e[o] = {
                i: o,
                l: !1,
                exports: {}
            };
            return t[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports;
        }
        return n.m = t, n.c = e, n.d = function(t, e, o) {
            n.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: o
            });
        }, n.r = function(t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            });
        }, n.t = function(t, e) {
            if (1 & e && (t = n(t)), 8 & e)
                return t;
            if (4 & e && "object" == typeof t && t && t.__esModule)
                return t;
            var o = Object.create(null);
            if (n.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: t
            }), 2 & e && "string" != typeof t)
                for (var r in t)
                    n.d(o, r, function(e) {
                        return t[e];
                    }.bind(null, r));
            return o;
        }, n.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default;
            } : function() {
                return t;
            };
            return n.d(e, "a", e), e;
        }, n.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e);
        }, n.p = "", n(n.s = 1);
    }([ function(t, e) {
        t.exports = require("crypto-js");
    }, function(t, e, n) {
        "use strict";
        n.r(e);
        var o = n(0);
        const r = "Secret Passphrase";
        function i(t) {
            return o.AES.encrypt(t, r).toString();
        }
        function c(t) {
            try {
                const e = o.AES.decrypt(t, r).toString(o.enc.Utf8);
                return e;
            } catch (e) {
                return null;
            }
        }
        const u = {
            encode: i,
            decode: c
        };
        e.default = u;
    } ]);
});
//# sourceMappingURL=uv.bundle.js.map