/*

    Tests for the "resolver" static function.

 */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

// We use these to confirm that paths are actually resolved.
var baseDir = fluid.module.resolvePath("%gpii-handlebars");
var path    = require("path");

require("../../../index");
require("../../../src/js/server/lib/resolver");


fluid.registerNamespace("gpii.hb.tests.resolver");

gpii.hb.tests.resolver.singleTest = function (test) {
    jqUnit.test(test.message, function () {
        if (test.hasException) {
            jqUnit["throws"](function () { gpii.express.hb.resolveAllPaths(test.original); }, test.message);
        }
        else {
            jqUnit.assertDeepEq(test.message, test.expected, gpii.express.hb.resolveAllPaths(test.original));
        }
    });
};


fluid.defaults("gpii.hb.tests.resolver", {
    gradeNames: ["fluid.component"],
    tests: [
        {
            message: "A string should resolve correctly...",
            original: "%gpii-handlebars/src",
            expected: [path.resolve(baseDir, "src")]
        },
        {
            message: "An array should resolve correctly...",
            original: ["%gpii-handlebars/src", "%gpii-handlebars"],
            expected: [path.resolve(baseDir, "src"), baseDir]
        },
        {
            message: "A full path passed as a string should not be changed...",
            original: "/this/should/work",
            expected: ["/this/should/work"]
        },
        {
            message: "An array of full paths should not be changed.",
            original: ["/this/works", "/this/also/works"],
            expected: ["/this/works", "/this/also/works"]
        },
        {
            message: "`undefined` as a single argument should result in an empty array...",
            original: undefined,
            expected: []
        },
        {
            message: "`null` as a single argument should result in an empty array...",
            original: null,
            expected: []
        },
        {
            message: "`undefined` array values should result in an exception...",
            original: [undefined, "/something/has/survived"],
            hasException: true
        },
        {
            message: "`null` array values should result in an exception...",
            original: ["/something/has/survived", null],
            hasException: true
        }
    ],
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.each",
            args:     ["{that}.options.tests", gpii.hb.tests.resolver.singleTest]
        }
    }
});

gpii.hb.tests.resolver();