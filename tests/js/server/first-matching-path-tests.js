/*

    Tests for the "first matching path" function generator.

 */
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var jqUnit = require("node-jqunit");

var baseDir = fluid.module.resolvePath("%fluid-handlebars");
var srcDir  = fluid.module.resolvePath("%fluid-handlebars/src");
var testDir = fluid.module.resolvePath("%fluid-handlebars/tests");

require("../../../src/js/server/lib/first-matching-path");

var path = require("path");

jqUnit.module("Testing the 'first matching path' function generator...");

jqUnit.test("A directory that exists should be found...", function () {
    var matches = fluid.find([baseDir], fluid.express.hb.getPathSearchFn(["tests"]));
    jqUnit.assertTrue("The directory should be found...", matches);
});

// A directory that doesn't exist shouldn't be found
jqUnit.test("A directory that doesn't exists shouldn't be found...", function () {
    var matches = fluid.find([baseDir], fluid.express.hb.getPathSearchFn(["bogus"]));
    jqUnit.assertUndefined("The path should not be found...", matches);
});

jqUnit.test("A path that exists in a later entry should be found...", function () {
    var matches = fluid.find([srcDir, testDir], fluid.express.hb.getPathSearchFn(["html"]));
    jqUnit.assertEquals("The path should be found...", path.resolve(baseDir, "tests/html"), matches);
});

jqUnit.test("A path that doesn't exist in any entry should not be found...", function () {
    var matches = fluid.find([srcDir, testDir], fluid.express.hb.getPathSearchFn(["bogus"]));
    jqUnit.assertUndefined("The path should not be found...", matches);
});

jqUnit.test("Multiple path segments should be usable to find a match...", function () {
    var matches = fluid.find([baseDir], fluid.express.hb.getPathSearchFn(["tests", "js", "server"]));
    jqUnit.assertEquals("The path should be found...", path.resolve(baseDir, "tests/js/server"), matches);
});

jqUnit.test("Multiple bogus path segments should not result in a match...", function () {
    var matches = fluid.find([srcDir, testDir], fluid.express.hb.getPathSearchFn(["tests", "bogus", "more"]));
    jqUnit.assertUndefined("The path should not be found...", matches);
});

jqUnit.test("A string should be useable in a search...", function () {
    var matches = fluid.find([baseDir], fluid.express.hb.getPathSearchFn("tests"));
    jqUnit.assertEquals("The path should be found...", path.resolve(baseDir, "tests"), matches);
});

jqUnit.test("A bogus string should not result in a match...", function () {
    var matches = fluid.find([srcDir, testDir], fluid.express.hb.getPathSearchFn("bogus"));
    jqUnit.assertUndefined("The path should not be found...", matches);
});
