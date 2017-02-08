/*

    Tests for the "resolver" static function.

 */
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

// We use these to confirm that paths are actually resolved.
var baseDir = fluid.module.resolvePath("%gpii-handlebars");
var srcDir  = fluid.module.resolvePath("%gpii-handlebars/src");

require("../../../index");
require("../../../src/js/server/lib/resolver");


fluid.registerNamespace("gpii.hb.tests.resolver");

gpii.hb.tests.resolver.singleTest = function (original, expected, hasException) {
    if (hasException) {
        jqUnit["throws"](function () { gpii.express.hb.resolveAllPaths(original); }, "An error should have been thrown...");
    }
    else {
        jqUnit.assertDeepEq("The results should be as expected", expected, gpii.express.hb.resolveAllPaths(original));
    }
};

fluid.defaults("gpii.tests.handlebars.resolver.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Unit tests for the resolver...",
        tests: [
            {
                name: "A string should resolve correctly...",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: ["%gpii-handlebars/src", [srcDir]] // original, expected, hasException
                }]
            },
            {
                name: "An array should resolve correctly...",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [["%gpii-handlebars/src", "%gpii-handlebars"], [srcDir, baseDir]] // original, expected, hasException
                }]
            },
            {
                name: "A full path passed as a string should not be changed...",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: ["/this/should/work", ["/this/should/work"]] // original, expected, hasException
                }]
            },
            {
                name: "An array of full paths should not be changed.",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [["/this/works", "/this/also/works"], ["/this/works", "/this/also/works"]] // original, expected, hasException
                }]
            },
            {
                name: "`undefined` as a single argument should result in an empty array...",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [undefined, []] // original, expected, hasException
                }]
            },
            {
                name: "`null` as a single argument should result in an empty array...",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [null, []] // original, expected, hasException
                }]
            },
            {
                name: "`undefined` array values should result in an exception...",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [[undefined, "/something/has/survived"], [], true] // original, expected, hasException
                }]
            },
            {
                name: "`null` array values should result in an exception...",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [["/something/has/survived", null], [], true] // original, expected, hasException
                }]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.handlebars.resolver.environment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.resolver.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.handlebars.resolver.environment");
