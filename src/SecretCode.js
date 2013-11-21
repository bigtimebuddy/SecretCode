(function(doc, global, undefined){
	
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
	SecretCode.VERSION = "${version}";
	
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
	*  The bound code input function
	*  @property _inputBind
	*  @private
	*/
	p._inputBind = null;
	
	/**
	*  The bound start input function
	*  @property _startBind
	*  @private
	*/
	p._startBind = null;
	
	/**
	*  The constructor 
	*/
	p.initialize = function(code, timeThreshold)
	{
		if (code === undefined)
		{
			throw "SecretCode requires a single attribute of an array of keyCodes";
		}
		
		this._inputBind = onCodeInput.bind(this);
		this._startBind = onStartCodeInput.bind(this);
		
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
			
			removeEvent(doc, 'keyup', this._inputBind);
			removeEvent(doc, 'keydown', this._startBind);
			
			clearTimer.call(this);
			
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
		removeEvent(doc, 'keyup', this._inputBind);
		addEvent(doc, 'keydown', this._startBind);
		this._keyRecord = [];
		clearTimer.call(this);
	};
	
	/**
	*  Destroy this class. Don't use after this
	*  @method destroy 
	*/
	p.destroy = function()
	{   
		this.reset();
		
		this.enabled = false;
		
		this._timeoutTimer = null;
		this._keyRecord = null;
		this._code = null;
	};
	
	/** 
	*   Entering the code has timed out from when you hit the first key
	*/
	var onTimeout = function()
	{
		this.trigger(SecretCode.TIMEOUT);
		this.reset();
	};

	/**
	*  When the user starts inputting on the keyboard
	*  @method onStartCodeInput
	*  @private
	*  @param {Event} ev Keyboard event key down
	*/
	var onStartCodeInput = function(ev)
	{
		// The first key must be entered correctly to start listening
		if (ev.keyCode != this._code[0]) return;
		
		addEvent(doc, 'keyup', this._inputBind);
		removeEvent(doc, 'keydown', this._startBind);
		
		this._timeoutTimer = setTimeout(
			onTimeout.bind(this), 
			this._timeThreshold
		);
	};
	
	/**
	*  Record the keyboard inputs
	*  @method onCodeInput
	*  @private
	*  @param {Event} ev Keyboard event key up
	*/
	var onCodeInput = function(ev)
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
	*  @method clearTimer 
	*  @private
	*/
	var clearTimer = function()
	{		
		if (this._timeoutTimer) 
		{
			clearTimeout(this._timeoutTimer);
		}
		this._timeoutTimer = null;
	};
	
	/**
	*  Local function for adding DOM event handler 
	*  @method addEvent
	*  @private
	*  @param {DOMElement} element The HTML element
	*  @param {String} event The type of event
	*  @param {Function} handler The function handler
	*/
	var addEvent = (function()
	{
		if (doc.addEventListener)
		{
			return function(element, event, handler)
			{
				element.addEventListener(event, handler, false);
			};
		}
		else
		{
			return function(element, event, handler)
			{
				element.attachEvent('on' + event, handler);
			};
		}
	}());
	
	/**
	*  Local function for removing DOM event handler 
	*  @method removeEvent
	*  @private
	*  @param {DOMElement} element The HTML element
	*  @param {String} event The type of event
	*  @param {Function} handler The function handler
	*/
	var removeEvent = (function()
	{
		if (doc.removeEventListener) 
		{
			return function(element, event, handler) 
			{
				doc.removeEventListener(event, handler, false);
			};
		}
		else 
		{
			return function(element, event, handler) 
			{
				doc.detachEvent('on' + event, handler);
			};
		}
	}());
	
	// Assign to the global space
	global.SecretCode = SecretCode;
	
}(document, window));