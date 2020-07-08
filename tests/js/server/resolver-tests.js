/*

    Tests for the "resolver" static function.

 */
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var jqUnit = require("node-jqunit");

fluid.require("%fluid-handlebars");

// We use these to confirm that paths are actually resolved.
var baseDir = fluid.module.resolvePath("%fluid-handlebars");
var srcDir  = fluid.module.resolvePath("%fluid-handlebars/src");

require("../../../src/js/server/lib/resolver");


fluid.registerNamespace("fluid.hb.tests.resolver");

fluid.hb.tests.resolver.singleTest = function (original, expected, hasException) {
    if (hasException) {
        jqUnit["throws"](function () { fluid.handlebars.resolvePrioritisedPaths(original); }, "An error should have been thrown.");
    }
    else {
        jqUnit.assertDeepEq("The results should be as expected", expected, fluid.handlebars.resolvePrioritisedPaths(original));
    }
};

fluid.defaults("fluid.tests.handlebars.resolver.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Unit tests for the resolver.",
        tests: [
            // Tests for map format, both "short" and "long" notation.
            {
                name: "A package root should resolve correctly (long form).",
                sequence: [{
                    func: "fluid.hb.tests.resolver.singleTest",
                    args: [{ packageRoot: { path: "%fluid-handlebars" } }, [baseDir]] // original, expected, hasException
                }]
            },
            {
                name: "A package root should resolve correctly (short form).",
                sequence: [{
                    func: "fluid.hb.tests.resolver.singleTest",
                    args: [["%fluid-handlebars"], [baseDir]] // original, expected, hasException
                }]
            },
            {
                name: "Prioritisation should work (long form only).",
                sequence: [{
                    func: "fluid.hb.tests.resolver.singleTest",
                    args: [{ second: { path: "/second", priority: "last"}, first: { path: "/first" }}, ["/first", "/second"]] // original, expected, hasException
                }]
            },
            {
                name: "Prioritisation should work (mix of long and short form).",
                sequence: [{
                    func: "fluid.hb.tests.resolver.singleTest",
                    args: [{long: { path: "/long", priority: "after:short" }, short: "/short", shorter: { path: "/shorter", priority: "before:short" }}, ["/shorter", "/short", "/long"]] // original, expected, hasException
                }]
            },
            // Tests for legacy array format.
            {
                name: "An array should resolve correctly.",
                sequence: [{
                    func: "fluid.hb.tests.resolver.singleTest",
                    args: [["%fluid-handlebars/src", "%fluid-handlebars"], [srcDir, baseDir]] // original, expected, hasException
                }]
            },
            {
                name: "An array of full paths should not be changed.",
                sequence: [{
                    func: "fluid.hb.tests.resolver.singleTest",
                    args: [["/this/works", "/this/also/works"], ["/this/works", "/this/also/works"]] // original, expected, hasException
                }]
            },
            {
                name: "`undefined` array values should result in an exception.",
                sequence: [{
                    func: "fluid.hb.tests.resolver.singleTest",
                    args: [[undefined, "/something/has/survived"], [], true] // original, expected, hasException
                }]
            },
            {
                name: "`null` array values should result in an exception.",
                sequence: [{
                    func: "fluid.hb.tests.resolver.singleTest",
                    args: [["/something/has/survived", null], [], true] // original, expected, hasException
                }]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.handlebars.resolver.environment", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.handlebars.resolver.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.handlebars.resolver.environment");
