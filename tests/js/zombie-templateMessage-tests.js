"use strict";
// Test "templateMessage" components using Zombie and filesystem content.
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.setLogging(true);

var Browser = require("zombie");
var jqUnit = require("jqUnit");

require("./zombie-test-harness");

fluid.registerNamespace("gpii.hb.tests.templateMessage");
gpii.hb.tests.templateMessage.runTests = function (that) {
    jqUnit.module("Testing template message components (non-networked renderer)...");
    jqUnit.asyncTest("Testing template message components...", function () {
        var browser = Browser.create();
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
        });

        browser.visit(that.options.url, function () {
            jqUnit.start();

            var body = browser.window.$("body");
            jqUnit.assertTrue("The placeholder text should no longer be present...", body.text().indexOf(that.options.notExpected) === -1);
            jqUnit.assertTrue("A component with initial model data should display as expected...", body.text().indexOf(that.options.expected.initialized) !== -1);
            jqUnit.assertTrue("A component with updated model data should display as expected...", body.text().indexOf(that.options.expected.updated) !== -1);
        });
    });
};

gpii.templates.hb.tests.client.harness({
    "expressPort" :   6904,
    "url":            "http://localhost:6904/content/tests-templateMessage.html",
    // This is "expected" data that must match the model data found in client-tests.js
    notExpected: "should not be visible",
    expected: {
        initialized: "born with silver model data in my mouth",
        updated:     "some have data thrust upon them"
    },
    listeners: {
        "{express}.events.onStarted": {
            funcName: "gpii.hb.tests.templateMessage.runTests",
            args:     ["{that}"]
        }
    }
});

