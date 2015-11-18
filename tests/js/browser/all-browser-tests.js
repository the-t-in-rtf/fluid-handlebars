"use strict";
var sequence = require("when/sequence");
var tests = [
    "./browser-binder-tests.js",
    "./browser-initBlock-tests.js",
    "./browser-inline-tests.js",
    "./browser-rendering-tests.js",
    "./browser-templateAware-tests.js",
    "./browser-templateFormControl-tests.js",
    "./browser-templateMessage-tests.js"
];
var promises = [];
tests.forEach(function (testFile) {
    promises.push(require(testFile));
});

module.exports = sequence(promises);