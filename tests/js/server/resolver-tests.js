/*

    Tests for the "resolver" static function.

 */
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.require("%gpii-handlebars");

// We use these to confirm that paths are actually resolved.
var baseDir = fluid.module.resolvePath("%gpii-handlebars");
var srcDir  = fluid.module.resolvePath("%gpii-handlebars/src");

require("../../../src/js/server/lib/resolver");


fluid.registerNamespace("gpii.hb.tests.resolver");

gpii.hb.tests.resolver.singleTest = function (original, expected, hasException) {
    if (hasException) {
        jqUnit["throws"](function () { gpii.handlebars.resolvePrioritisedPaths(original); }, "An error should have been thrown.");
    }
    else {
        jqUnit.assertDeepEq("The results should be as expected", expected, gpii.handlebars.resolvePrioritisedPaths(original));
    }
};

fluid.defaults("gpii.tests.handlebars.resolver.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Unit tests for the resolver.",
        tests: [
            // Tests for map format, both "short" and "long" notation.
            {
                name: "A package root should resolve correctly (long form).",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [{ packageRoot: { path: "%gpii-handlebars" } }, [baseDir]] // original, expected, hasException
                }]
            },
            {
                name: "A package root should resolve correctly (short form).",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [["%gpii-handlebars"], [baseDir]] // original, expected, hasException
                }]
            },
            {
                name: "Prioritisation should work (long form only).",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [{ second: { path: "/second", priority: "last"}, first: { path: "/first" }}, ["/first", "/second"]] // original, expected, hasException
                }]
            },
            {
                name: "Prioritisation should work (mix of long and short form).",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [{long: { path: "/long", priority: "after:short" }, short: "/short", shorter: { path: "/shorter", priority: "before:short" }}, ["/shorter", "/short", "/long"]] // original, expected, hasException
                }]
            },
            // Tests for legacy array format.
            {
                name: "An array should resolve correctly.",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [["%gpii-handlebars/src", "%gpii-handlebars"], [srcDir, baseDir]] // original, expected, hasException
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
                name: "`undefined` array values should result in an exception.",
                sequence: [{
                    func: "gpii.hb.tests.resolver.singleTest",
                    args: [[undefined, "/something/has/survived"], [], true] // original, expected, hasException
                }]
            },
            {
                name: "`null` array values should result in an exception.",
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
