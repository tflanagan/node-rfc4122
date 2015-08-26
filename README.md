node-rfc4122
==============

[![npm license](https://img.shields.io/npm/l/rfc4122.svg)](https://www.npmjs.com/package/rfc4122) [![npm version](https://img.shields.io/npm/v/rfc4122.svg)](https://www.npmjs.com/package/rfc4122) [![npm downloads](https://img.shields.io/npm/dm/rfc4122.svg)](https://www.npmjs.com/package/rfc4122)

JavaScript implementation of RFC4122: A Universally Unique IDentifier (UUID) URN Namespace

Install
-------
```
# Latest Stable Release
$ npm install rfc4122

# Latest Commit
$ npm install tflanagan/node-rfc4122
```

Browserify
----------
This library works out of the box with Browserify.
```
$ npm install rfc4122
$ npm install -g browserify
$ browserify node_modules/rfc4122 > rfc4122.browserify.js
```
The file Browserify creates is ~522KB. It exposes the RFC4122 object to the global namespace.

Minifying the file results in a ~283KB file.

```
$ npm install -g minifier
$ minify --output rfc4122.browserify.min.js rfc4122.browserify.js
```

The use is the same as in Nodejs, but there is no need to ```require('rfc4122')```.

```html
<script type="text/javascript" src="rfc4122.browserify.js"></script>
<script type="text/javascript">
	var rfc4122 = new RFC4122();

	...
</script>
```

Example
-------
```javascript
var RFC4122 = require('rfc4122');

var rfc4122 = new RFC4122();

rfc4122.v1();
// ebc386d0-4c07-11a5-0ea7-f1d320998c65

rfc4122.v3('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'string');
// 01ab89a5-ffc7-35b0-89b4-440e5d0949ca

rfc4122.v4();
// b58029b3-4f28-400a-968d-82d6f8def2ab

/* Faster version of V4 */
rfc4122.v4f();
// aad2c1d7-66f1-4b7e-946a-d56ac9da5f48

rfc4122.v5('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'string');
// fbb6b6b4-f910-5516-b5d9-8967c4835c76
```

License
-------

Copyright 2014 Tristian Flanagan

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
