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
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

/* Helpers */
let getTests = () => {
	return new Promise((resolve, reject) => {
		fs.readdir(__dirname, (err, tests) => {
			if(err){
				return reject(err);
			}

			tests = tests.reduce((tests, test) => {
				if(test.indexOf('.') !== 0 && test !== 'runAll.js'){
					tests.push(test);
				}

				return tests;
			}, []);

			resolve(tests);
		});
	});
};

let runTest = (test) => {
	return new Promise((resolve, reject) => {
		require(path.join(__dirname, test))(resolve, reject);
	});
};

/* Main */
getTests().map((test) => {
	return runTest(test)
		.then(() => {
			console.log('Test Complete: %s', test);
		})
		.catch((err) => {
			console.error('Test Failed: %s', test);

			throw err;
		});
}, {
	concurrency: 1
});
