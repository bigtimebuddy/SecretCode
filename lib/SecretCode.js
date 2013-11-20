(function(){
	
	"use strict";
	
	// If there's already a bind, ignore
	if (Function.prototype.bind) return;
	
	/**
	*  Designed to provide utility related to functions, the
	*  most important of which is the Bind function, used to properly scope callbacks.
	*  Add the bind functionality to the Function prototype
	*  this allows passing a reference in the function callback
	*  
	*	callback.bind(this)
	*	callback.bind(this, arg1)
	*  
	*  @class Function.prototype.bind
	*  @constructor
	*  @param {Object} that The reference to the function.
	*  @param {mixed} [args*] Additional arguments
	*  @return {Function} The new function binding.
	*/
	Function.prototype.bind = function(that) 
	{
		var target = this, 
			args,
			bound;

		if (typeof target != "function") 
		{
			throw new TypeError();
		}

		args = Array.prototype.slice.call(arguments, 1);
		bound = function()
		{
			if (this instanceof bound) 
			{
				var F, self, result;
				F = function(){};
				F.prototype = target.prototype;
				self = new F();

				result = target.apply(self, args.concat(Array.prototype.slice.call(arguments)));
				
				if (Object(result) === result)
				{
					return result;
				}
				return self;
			}
			else 
			{
				return target.apply(that, args.concat(Array.prototype.slice.call(arguments)));
			}
		};
		return bound;
	};
	
}());
(function(global, undefined){
	
	"use strict";
	
	/**
	*  The EventDispatcher mirrors the functionality of AS3 and CreateJS's EventDispatcher, 
	*  but is more robust in terms of inputs for the `on()` and `off()` methods.
	*  
	*  @class EventDispatcher
	*/
	var EventDispatcher = function(){},
	
	// Reference to the prototype 
	p = EventDispatcher.prototype;
	
	/**
	* The collection of listeners
	* @property {Array} _listeners
	* @private
	*/
	p._listeners = [];
	
	/**
	*  Dispatch an event
	*  @method trigger
	*  @param {String} type The event string name, 
	*  @param {*} params Additional parameters
	*/
	p.trigger = function(type, params)
	{
		if (this._listeners[type] !== undefined) 
		{	
			var listeners = this._listeners[type];
			
			for(var i = 0; i < listeners.length; i++) 
			{
				listeners[i](params);
			}
		}
	};
	
	/**
	*  Add an event listener
	*  
	*  @method on
	*  @param {String|object} name The type of event (can be multiple events separated by spaces), 
	*          or a map of events to handlers
	*  @param {Function|Array*} callback The callback function when event is fired or an array of callbacks.
	*  @return {cloudkid.EventDispatcher} Return this EventDispatcher
	*/
	p.on = function(name, callback)
	{
		// Callbacks map
		if (type(name) === 'object')
		{
			for (var key in name)
			{
				if (name.hasOwnProperty(key))
				{
					this.on(key, name[key]);
				}
			}
		}
		// Callback
		else if (type(callback) === 'function')
		{
			var names = name.split(' '), n = null;
			for (var i = 0, nl = names.length; i < nl; i++)
			{
				n = names[i];
				this._listeners[n] = this._listeners[n] || [];
				
				if (this._callbackIndex(n, callback) === -1)
				{
					this._listeners[n].push(callback);
				}
			}
		}
		// Callbacks array
		else if (type(callback) === 'array')
		{
			for (var f = 0, fl = callback.length; f < fl; f++)
			{
				this.on(name, callback[f]);
			}
		}
		return this;
	};
	
	/**
	*  Remove the event listener
	*  
	*  @method off
	*  @param {String*} name The type of event string separated by spaces, if no name is specifed remove all listeners.
	*  @param {function|Array*} callback The listener function or collection of callback functions
	*/
	p.off = function(name, callback)
	{	
		// remove all 
		if (name === undefined)
		{
			this._listeners = [];
		}
		// remove multiple callbacks
		else if (type(callback) === 'array')
		{
			for (var f = 0, fl = callback.length; f < fl; f++) 
			{
				this.off(name, callback[f]);
			}
		}
		else
		{
			var names = name.split(' '), n = null;
			for (var i = 0, nl = names.length; i < nl; i++)
			{
				n = names[i];
				this._listeners[n] = this._listeners[n] || [];
				
				// remove all by time
				if (callback === undefined)
				{
					this._listeners[n].length = 0;
				}
				else
				{
					var index = this._callbackIndex(n, callback);
					if (index !== -1)
					{
						this._listeners[name].splice(index, 1);
					}
				}
			}
		}
		return this;
	};
	
	/**
	* Return type of the value.
	*
	* @private
	* @method type
	* @param  {*} value
	* @return {String} The type
	*/
	function type(value)
	{
		if (value === null)
		{
			return String(value);
		}
		if (typeof value === 'object' || typeof value === 'function')
		{
			return Object.prototype.toString.call(value).match(/\s([a-z]+)/i)[1].toLowerCase() || 'object';
		}
		return typeof value;
	}
	
	/**
	 * Returns callback array index.
	 *
	 * @method _callbackIndex
	 * @private
	 * @param  {String}   name Event name.
	 * @param  {Function} callback   Function
	 * @return {Int} Callback array index, or -1 if isn't registered.
	 */
	p._callbackIndex = function(name, callback)
	{		
		for (var i = 0, l = this._listeners[name].length; i < l; i++)
		{
			if (this._listeners[name][i] === callback)
			{
				return i;
			}
		}
		return -1;
	};
	
	// Assign to the global spacing
	global.EventDispatcher = EventDispatcher;
	
}(window));
(function(global){
	
	"use strict";
	
	/**
	*  Common keyboard codes
	*  @class Keyboard 
	*/
	global.Keyboard = {
		BACKSPACE : 8,
		ENTER : 13,
		CTRL : 17,
		ALT : 18,
		CAPSLOCK : 20,
		ESC : 27,
		SPACEBAR : 32,
		PAGEUP : 33,
		PAGEDOWN : 34,
		END : 35,
		HOME : 36,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		INSERT : 45,
		DELETE : 46,
		A : 65,
		B : 66,
		C : 67,
		D : 68,
		E : 69,
		F : 70,
		G : 71,
		H : 72,
		I : 73,
		J : 74,
		K : 75,
		L : 76,
		M : 77,
		N : 78,
		O : 79,
		P : 80,
		Q : 81,
		R : 82,
		S : 83,
		T : 84,
		U : 85,
		V : 86,
		W : 87,
		X : 88,
		Y : 89,
		Z : 90,
		F1 : 112,
		F2 : 113,
		F3 : 114,
		F4 : 115,
		F5 : 116,
		F6 : 117,
		F7 : 118,
		F8 : 119,
		F9 : 120,
		F10 : 121,
		F11 : 122,
		F12 : 123,
		NUMLOCK : 144,
		SEMICOLON : 186,
		EQUAL : 187,
		COMMA : 188,
		DASH : 189,
		PERIOD : 190,
		FORWARDSLASH : 191,
		OPENBRACKET : 219,
		BACKSLASH : 220,
		CLOSEBRACKET : 221,
		SINGLEQUOTE : 222
	};
	
}(window));
(function(global, undefined){
	
	"use strict";
	
	/**
	*  This class is for creating secret codes entered on the keyboard (e.g. Konami Code)
	*  @class SecretCode
	*  @extends EventDispatcher
	*  @constructor 
	*  @param {Array} code The array of keyCodes to checkfor
	*  @param {int} [timeThreshold=3000] The number of ms you have to enter the code
	*/
	var SecretCode = function(code, timeThreshold)
	{
		this.initialize(code, timeThreshold);
	};
	
	/** Extend the prototype */
	var p = SecretCode.prototype = new EventDispatcher();
	
	/** 
	*  The current version of the API
	*  @property {String} VERSION
	*  @static
	*  @final
	*/
	SecretCode.VERSION = "1.0.0";
	
	/** 
	*  Event when the code entered has succeeded 
	*  @property {String} SUCCESS
	*  @static
	*  @final
	*  @default success
	*/
	SecretCode.SUCCESS = "success";
	
	/** 
	*  Event when the code has been entered bad 
	*  @property {String} FAILED
	*  @static
	*  @final
	*  @default failed
	*/
	SecretCode.FAILED = "failed";
	
	/** 
	*  Event dispatched when the code listening times out
	*  @property {String} TIMEOUT
	*  @static
	*  @final
	*  @default timeout
	*/
	SecretCode.TIMEOUT = "timeout";
	
	/** 
	*  We'll save the konami code, this is the default
	*  @property {Array} KONAMI
	*  @static
	*  @final
	*/
	SecretCode.KONAMI = [
		Keyboard.UP, 
		Keyboard.UP,
		Keyboard.DOWN, 
		Keyboard.DOWN,
		Keyboard.LEFT, 
		Keyboard.RIGHT,
		Keyboard.LEFT, 
		Keyboard.RIGHT,
		Keyboard.B, 
		Keyboard.A, 
	];

	/** 
	*  The stage to listen to keystrokes 
	*  @property {Document} _stage
	*  @protected
	*/
	p._stage = null;

	/** 
	*  The secret code (default here is Konami) 
	*  @property {Array} _code
	*  @protected
	*/
	p._code = null;

	/** 
	*  The limit input timer, code times out 
	*  @property {int} _timeoutTimer
	*  @protected
	*/
	p._timeoutTimer = null;
	
	/**
	*  The total time in milliseconds you have to enter the code
	*  @property {int} _timeThreshold
	*  @protected
	*  @default 3000
	*/
	p._timeThreshold = 3000;

	/** 
	*  Record the key inputs 
	*  @property {Array} _keyRecord
	*  @protected
	*/
	p._keyRecord = [];

	/** 
	*  Whether this is enabled or not 
	*  @property {Boolean} _enabled
	*  @protected
	*/
	p._enabled = true;
	
	/**
	*  The constructor 
	*/
	p.initialize = function(code, timeThreshold)
	{
		if (code === undefined)
		{
			throw "SecretCode requires a single attribute of an array of keyCodes";
		}
		
		this._stage = document;
		this._code = code;
		this._timeThreshold = timeThreshold || 3000;
		this._timeoutTimer = null;
		this.enabled = true;
	};
	
	/**
	*  The current state URI
	*  @property {Boolean} enabled
	*/
	Object.defineProperty(p, "enabled", {
		get: function()
		{
			return this._enabled;
		},
		set: function(enabled)
		{
			this._enabled = enabled;
			this._stage.onkeyup = null;
			this._stage.onkeydown = null;
			this._clearTimer();
			
			if (enabled)
			{
				this.reset();
			}
		}
	});
	
	/**
	*  Reset the object to it's original listening state
	*  @method reset
	*/
	p.reset = function()
	{
		this._stage.onkeyup = null;
		this._stage.onkeydown = this._onStartCodeInput.bind(this);
		this._keyRecord = [];
		this._clearTimer();
	};
	
	/** 
	*   Entering the code has timed out from when you hit the first key
	*/
	p._onTimeout = function()
	{
		this.trigger(SecretCode.TIMEOUT);
		this.reset();
	};

	/**
	*  When the user starts inputting on the keyboard
	*  @method _onStartCodeInput
	*  @protected
	*  @param {Event} ev Keyboard event key down
	*/
	p._onStartCodeInput = function(ev)
	{
		// The first key must be entered correctly to start listening
		if (ev.keyCode != this._code[0]) return;
		
		this._stage.onkeydown = null;
		this._stage.onkeyup = this._onCodeInput.bind(this);
		
		this._timeoutTimer = setTimeout(
			this._onTimeout.bind(this), 
			this._timeThreshold
		);
	};
	
	/**
	*  Record the keyboard inputs
	*  @method _onCodeInput
	*  @protected
	*  @param {Event} ev Keyboard event key up
	*/
	p._onCodeInput = function(ev)
	{
		this._keyRecord.push(ev.keyCode);
		
		if (this._keyRecord.length < this._code.length)
		{
			return;
		}
		
		if (this._keyRecord.length > this._code.length)
		{
			this.trigger(SecretCode.FAILED);
			this.reset();
			return;
		}
		
		if (this._keyRecord.toString() == this._code.toString())
		{
			this.trigger(SecretCode.SUCCESS);
			this.reset();
			return;
		}
	};

	/**
	*  Clear the current timer
	*  @method _clearTimer 
	*  @protected
	*/
	p._clearTimer = function()
	{		
		if (this._timeoutTimer) 
		{
			clearTimeout(this._timeoutTimer);
		}
		this._timeoutTimer = null;
	};
	
	/**
	*  Destroy this class. Don't use after this
	*  @method destroy 
	*/
	p.destroy = function()
	{   
		this.reset();
		
		this._timeoutTimer = null;
		this._keyRecord = null;
		this._code = null;
		this._stage.onkeyup = null;
		this._stage.onkeydown = null;
		this._stage = null;
	};
	
	// Assign to the global space
	global.SecretCode = SecretCode;
	
}(window));
