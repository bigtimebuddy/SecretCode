#SecretCode

This small JavaScript utility is designed for creating secret keyboard codes to be entered on a website. For instance, when the user enters the Konami Code, they could get a hidden easter egg.

##Installation

Install is available using [Bower](http://bower.io).

```bash
bower install SecretCode
```

##Usage

```js
// Create the code to listen for and how long the user has to
// enter is before it times out
var secret = new SecretCode(SecretCode.KONAMI, 2500);

// Listen for the success event
secret.on('success', function(){
	// Do something special here
	alert('You found me!');
});
```

##Documentation

###Methods

####SecretCode ( code, [timeThreshold=3000] )

__Parameters__

* __code__ *Array* - The array of keyCodes which constitutes a secret code
* __[timeThreshold=3000]__ *int* - The number of milliseconds the user has to enter the code, the default is 3 seconds.

__Example__

```js
var secret = new SecretCode([
	Keyboard.UP,
    Keyboard.UP,
    Keyboard.SPACEBAR
    Keyboard.HOME], 2000);
```

####on ( name, [callback] )

Add an event listener.

__Parameters__

* __name__ *String|Dictionary* - The type of event (can be multiple events separated by spaces), or a dictionary of event string to function handlers.
* __[callback]__ *Function|Array* - The callback function when event is fired or an array of callbacks.

__Example__

```js

// Using a single string as the event handler
secret.on('success', function(){
	alert('YUP!');
});

// Using a dictionary map for the events
secret.on({
	success : function(){ alert('YUP!'); ),
    timeout : function(){ alert('Oops!'); ),
    failed : function(){ alert('Bummer!'); )
})
```

####off ( [name], [callback] )

Remove an event listener.

__Parameters__

* __[name]__ *String|Object* - The type of event string separated by spaces, if no name is specifed remove all listeners.
* __[callback]__ *Function|Array* - The listener function or collection of callback functions. If no callback is defined, removes all listeners by name.

__Example__

```js
// Remove all success and timeout handlers
secret.off('success timeout');
```

####trigger ( type, [params] )

Dispatch an event.

__Parameters__

* __type__ *String* - The event string name.
* __params__ - Additional parameters to pass with the event.


####reset ()

Reset the object to it's original listening state.

####destroy ()

Destroy the object and remove all references and does any internal cleanup. Don't use after calling this.

----

###Events

* __success__ `SecretCode.SUCCESS` The secret code was entered successfully.
* __failed__ `SecretCode.FAILED` The secret code failed to match.
* __timeout__ `SecretCode.TIMEOUT` The code was not entered within `timeThreshold` parameter in the constructor.

----

###Properties

* __SecretCode.KONAMI__ *Array* - Built-in code. A colleciton of keyboard codes matching: up, up, down, down, left, right, left, right, B, A.

##Rebuilding

Rebuilding the source code is fairly straightforward, but requires some additional tools. Here are the dependencies. Note: everything but Ant can be installed easily with [npm](https://npmjs.org/).

* [Apache Ant](https://ant.apache.org/)
* [jshint](http://www.jshint.com/)
* [uglifyjs](https://github.com/mishoo/UglifyJS)
* [yuidocs](http://yui.github.io/yuidoc/) *[optional]* Only required if rebuilding the docs

From the Terminal or the command-line run the task `ant buildAll`. This will rebuild the minified, uncompressed and debug versions.

##License

Copyright (c) 2013 [Matt Karl](http://github.com/bigtimebuddy)

Released under the MIT License.