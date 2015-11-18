"use strict";
var sequence = require("when/sequence");
var tests = [
    "./dispatcher-and-inline-tests.js",
    // TODO:  I cannot get this to play nicely with the promise-based Zombie tests.  Discuss with Antranig.
    //"./singleTemplateRouter-tests",
    "./standaloneRenderer-tests"
];

var promises = [];
tests.forEach(function (testFile) {
    promises.push(require(testFile));
});

module.exports = sequence(promises);