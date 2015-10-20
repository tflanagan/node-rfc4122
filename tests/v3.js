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
const assert = require('assert');
const RFC4122 = require('../');

/* Globals */
const rfc4122 = new RFC4122();

/* Main */
module.exports = function(pass, fail){
	try {
		let i = 0, l = 20000,
			base = rfc4122.v3('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'test string');

		console.log('Testing RFC4122.v3() %d times...', l);

		for(; i < l; ++i){
			let uuid = rfc4122.v3('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'test string');

			assert.equal(uuid, base);
		}
	}catch(err){
		return fail(err);
	}

	pass();
};
