(function() {
    "use strict";
    Function.prototype.bind || (Function.prototype.bind = function(that) {
        var args, bound, target = this;
        if ("function" != typeof target) throw new TypeError();
        return args = Array.prototype.slice.call(arguments, 1), bound = function() {
            if (this instanceof bound) {
                var F, self, result;
                return F = function() {}, F.prototype = target.prototype, self = new F(), result = target.apply(self, args.concat(Array.prototype.slice.call(arguments))), 
                Object(result) === result ? result : self;
            }
            return target.apply(that, args.concat(Array.prototype.slice.call(arguments)));
        };
    });
})(), function(global, undefined) {
    "use strict";
    function type(value) {
        return null === value ? value + "" : "object" == typeof value || "function" == typeof value ? Object.prototype.toString.call(value).match(/\s([a-z]+)/i)[1].toLowerCase() || "object" : typeof value;
    }
    var EventDispatcher = function() {}, p = EventDispatcher.prototype;
    p._listeners = [], p.trigger = function(type, params) {
        if (this._listeners[type] !== undefined) for (var listeners = this._listeners[type], i = 0; listeners.length > i; i++) listeners[i](params);
    }, p.on = function(name, callback) {
        if ("object" === type(name)) for (var key in name) name.hasOwnProperty(key) && this.on(key, name[key]); else if ("function" === type(callback)) for (var names = name.split(" "), n = null, i = 0, nl = names.length; nl > i; i++) n = names[i], 
        this._listeners[n] = this._listeners[n] || [], -1 === this._callbackIndex(n, callback) && this._listeners[n].push(callback); else if ("array" === type(callback)) for (var f = 0, fl = callback.length; fl > f; f++) this.on(name, callback[f]);
        return this;
    }, p.off = function(name, callback) {
        if (name === undefined) this._listeners = []; else if ("array" === type(callback)) for (var f = 0, fl = callback.length; fl > f; f++) this.off(name, callback[f]); else for (var names = name.split(" "), n = null, i = 0, nl = names.length; nl > i; i++) if (n = names[i], 
        this._listeners[n] = this._listeners[n] || [], callback === undefined) this._listeners[n].length = 0; else {
            var index = this._callbackIndex(n, callback);
            -1 !== index && this._listeners[name].splice(index, 1);
        }
        return this;
    }, p._callbackIndex = function(name, callback) {
        for (var i = 0, l = this._listeners[name].length; l > i; i++) if (this._listeners[name][i] === callback) return i;
        return -1;
    }, global.EventDispatcher = EventDispatcher;
}(window), function(global) {
    "use strict";
    global.Keyboard = {
        BACKSPACE: 8,
        ENTER: 13,
        CTRL: 17,
        ALT: 18,
        CAPSLOCK: 20,
        ESC: 27,
        SPACEBAR: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        INSERT: 45,
        DELETE: 46,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NUMLOCK: 144,
        SEMICOLON: 186,
        EQUAL: 187,
        COMMA: 188,
        DASH: 189,
        PERIOD: 190,
        FORWARDSLASH: 191,
        OPENBRACKET: 219,
        BACKSLASH: 220,
        CLOSEBRACKET: 221,
        SINGLEQUOTE: 222
    };
}(window), function(doc, global, undefined) {
    "use strict";
    var SecretCode = function(code, timeThreshold) {
        this.initialize(code, timeThreshold);
    }, p = SecretCode.prototype = new EventDispatcher();
    SecretCode.VERSION = "1.0.0", SecretCode.SUCCESS = "success", SecretCode.FAILED = "failed", 
    SecretCode.TIMEOUT = "timeout", SecretCode.KONAMI = [ Keyboard.UP, Keyboard.UP, Keyboard.DOWN, Keyboard.DOWN, Keyboard.LEFT, Keyboard.RIGHT, Keyboard.LEFT, Keyboard.RIGHT, Keyboard.B, Keyboard.A ], 
    p._stage = null, p._code = null, p._timeoutTimer = null, p._timeThreshold = 3e3, 
    p._keyRecord = [], p._enabled = !0, p._inputBind = null, p._startBind = null, p.initialize = function(code, timeThreshold) {
        if (code === undefined) throw "SecretCode requires a single attribute of an array of keyCodes";
        this._inputBind = onCodeInput.bind(this), this._startBind = onStartCodeInput.bind(this), 
        this._code = code, this._timeThreshold = timeThreshold || 3e3, this._timeoutTimer = null, 
        this.enabled = !0;
    }, Object.defineProperty(p, "enabled", {
        get: function() {
            return this._enabled;
        },
        set: function(enabled) {
            this._enabled = enabled, removeEvent(doc, "keyup", this._inputBind), removeEvent(doc, "keydown", this._startBind), 
            clearTimer.call(this), enabled && this.reset();
        }
    }), p.reset = function() {
        removeEvent(doc, "keyup", this._inputBind), addEvent(doc, "keydown", this._startBind), 
        this._keyRecord = [], clearTimer.call(this);
    }, p.destroy = function() {
        this.reset(), this.enabled = !1, this._timeoutTimer = null, this._keyRecord = null, 
        this._code = null;
    };
    var onTimeout = function() {
        this.trigger(SecretCode.TIMEOUT), this.reset();
    }, onStartCodeInput = function(ev) {
        ev.keyCode == this._code[0] && (addEvent(doc, "keyup", this._inputBind), removeEvent(doc, "keydown", this._startBind), 
        this._timeoutTimer = setTimeout(onTimeout.bind(this), this._timeThreshold));
    }, onCodeInput = function(ev) {
        return this._keyRecord.push(ev.keyCode), this._keyRecord.length < this._code.length ? undefined : this._keyRecord.length > this._code.length ? (this.trigger(SecretCode.FAILED), 
        this.reset(), undefined) : "" + this._keyRecord == "" + this._code ? (this.trigger(SecretCode.SUCCESS), 
        this.reset(), undefined) : undefined;
    }, clearTimer = function() {
        this._timeoutTimer && clearTimeout(this._timeoutTimer), this._timeoutTimer = null;
    }, addEvent = function() {
        return doc.addEventListener ? function(element, event, handler) {
            element.addEventListener(event, handler, !1);
        } : function(element, event, handler) {
            element.attachEvent("on" + event, handler);
        };
    }(), removeEvent = function() {
        return doc.removeEventListener ? function(element, event, handler) {
            doc.removeEventListener(event, handler, !1);
        } : function(element, event, handler) {
            doc.detachEvent("on" + event, handler);
        };
    }();
    global.SecretCode = SecretCode;
}(document, window);