/* Copyright 2014 Tristian Flanagan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

'use strict';

/* Dependencies */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var crypto = require('crypto');

/* Main Class
 *
 * Based On: https://www.ietf.org/rfc/rfc4122.txt
*/

var RFC4122 = (function () {
	function RFC4122(prng) {
		_classCallCheck(this, RFC4122);

		this.prng = prng || Math;

		this.nodeId = crypto.randomBytes(16);
		this.nodeId[0] = this.nodeId[0] | 0x01;

		this.clockSeq = crypto.randomBytes(2);
		this.clockSeq = (this.clockSeq[0] | this.clockSeq[1] << 8) & 0x3fff;

		this.lastMTime = 0;
		this.lastNTime = 0;

		return this;
	}

	/* Auxilary Code */

	_createClass(RFC4122, [{
		key: 'v1',
		value: function v1() {
			var mTime = Date.now(),
			    nTime = this.lastNTime + 1;

			var delta = mTime - this.lastMTime + (nTime - this.lastNTime) / 10000;

			if (delta < 0) {
				this.clockSeq = this.clockSeq + 1 & 0x3fff;

				nTime = 0;
			} else if (mTime > this.lastMTime) {
				nTime = 0;
			} else if (nTime >= 10000) {
				return false;
			}

			this.lastMTime = mTime;
			this.lastNTime = nTime;

			mTime += 12219292800000;

			var buffer = new Buffer(10),
			    timeLow = ((mTime & 0xfffffff) * 10000 + nTime) % 0x100000000,
			    timeHigh = mTime / 0x100000000 * 10000 & 0xfffffff;

			buffer[0] = timeLow >>> 24 & 0xff;
			buffer[1] = timeLow >>> 16 & 0xff;
			buffer[2] = timeLow >>> 8 & 0xff;
			buffer[3] = timeLow & 0xff;

			buffer[4] = timeHigh >>> 8 & 0xff;
			buffer[5] = timeHigh & 0xff;

			buffer[6] = timeHigh >>> 24 & 0x0f | 0x10;
			buffer[7] = timeHigh >>> 16 & 0x3f | 0x80;

			buffer[8] = this.clockSeq >>> 8;
			buffer[9] = this.clockSeq & 0xff;

			return byteToHex[buffer[0]] + byteToHex[buffer[1]] + byteToHex[buffer[2]] + byteToHex[buffer[3]] + '-' + byteToHex[buffer[4]] + byteToHex[buffer[5]] + '-' + byteToHex[buffer[6]] + byteToHex[buffer[7]] + '-' + byteToHex[buffer[8]] + byteToHex[buffer[9]] + '-' + byteToHex[this.nodeId[0]] + byteToHex[this.nodeId[1]] + byteToHex[this.nodeId[2]] + byteToHex[this.nodeId[3]] + byteToHex[this.nodeId[4]] + byteToHex[this.nodeId[5]];
		}
	}, {
		key: 'v3',
		value: function v3(namespace, name) {
			return named('md5', 0x30, namespace, name);
		}
	}, {
		key: 'v4',
		value: function v4() {
			return bufferToHex(crypto.randomBytes(16), 0x40);
		}
	}, {
		key: 'v4f',
		value: function v4f() {
			var d0 = this.prng.random() * 0xffffffff | 0,
			    d1 = this.prng.random() * 0xffffffff | 0,
			    d2 = this.prng.random() * 0xffffffff | 0,
			    d3 = this.prng.random() * 0xffffffff | 0;

			return byteToHex[d0 & 0xff] + byteToHex[d0 >> 8 & 0xff] + byteToHex[d0 >> 16 & 0xff] + byteToHex[d0 >> 24 & 0xff] + '-' + byteToHex[d1 & 0xff] + byteToHex[d1 >> 8 & 0xff] + '-' + byteToHex[d1 >> 16 & 0x0f | 0x40] + byteToHex[d1 >> 24 & 0xff] + '-' + byteToHex[d2 & 0x3f | 0x80] + byteToHex[d2 >> 8 & 0xff] + '-' + byteToHex[d2 >> 16 & 0xff] + byteToHex[d2 >> 24 & 0xff] + byteToHex[d3 & 0xff] + byteToHex[d3 >> 8 & 0xff] + byteToHex[d3 >> 16 & 0xff] + byteToHex[d3 >> 24 & 0xff];
		}
	}, {
		key: 'v5',
		value: function v5(namespace, name) {
			return named('sha1', 0x50, namespace, name);
		}
	}]);

	return RFC4122;
})();

var byteToHex = [],
    hexToByte = {},
    i = 0,
    l = 256,
    hex = undefined;

for (; i < l; ++i) {
	hex = (i + 0x100).toString(16).substr(1);

	hexToByte[hex] = i;
	byteToHex[i] = hex;
}

/* Helpers */
var hexdec = function hexdec(s) {
	s = (s + '').replace(/[^a-f0-9]/gi, '');

	return parseInt(s, 16);
};

var named = function named(hash, version, namespace, name) {
	var nHex = namespace.replace(/[\-]/g, ''),
	    nStr = '',
	    i = 0,
	    l = nHex.length;

	for (; i < l; i += 2) {
		nStr += String.fromCharCode(hexdec(nHex[i] + nHex[i + 1]));
	}

	return bufferToHex(crypto.createHash(hash).update(nStr + name).digest(), version);
};

var bufferToHex = function bufferToHex(buffer, version) {
	return byteToHex[buffer[0]] + byteToHex[buffer[1]] + byteToHex[buffer[2]] + byteToHex[buffer[3]] + '-' + byteToHex[buffer[4]] + byteToHex[buffer[5]] + '-' + byteToHex[buffer[6] & 0x0f | version] + byteToHex[buffer[7]] + '-' + byteToHex[buffer[8] & 0x3f | 0x80] + byteToHex[buffer[9]] + '-' + byteToHex[buffer[10]] + byteToHex[buffer[11]] + byteToHex[buffer[12]] + byteToHex[buffer[13]] + byteToHex[buffer[14]] + byteToHex[buffer[15]];
};

/* Expose Helpers */
RFC4122.hexdec = hexdec;
RFC4122.named = named;

/* Export Module */
if (typeof module !== 'undefined' && module.exports) {
	module.exports = RFC4122;
} else if (typeof define === 'function' && define.amd) {
	define('RFC4122', [], function () {
		return RFC4122;
	});
}

if (typeof global !== 'undefined' && typeof window !== 'undefined' && global === window) {
	global.RFC4122 = RFC4122;
}

