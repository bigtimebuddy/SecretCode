#SecretCode

This small JavaScript utility is designed for creating secret keyboard codes to be entered on a page or website. For instance, triggering something with the Konami Code.

##Installation

You can install using Bower.

```bash
bower install SecretCode
```

##Usage

```js
var secret = new SecretCode(SecretCode.KONAMI);
secret.on('success', function(){
	alert('Code entered');
});
```

##License

Copyright (c) 2013 [Matt Karl](http://github.com/bigtimebuddy)

Released under the MIT License.