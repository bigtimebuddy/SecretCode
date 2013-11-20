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