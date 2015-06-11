// Test "template aware" client-side components from within a simulated browser.
//
// The client-side template handling requires a server to provide the template content.
//
// TODO:  Sit down with Antranig to make Zombie components, so that these tests can use the Kettle test infrastructure.
"use strict";
var fluid = fluid || require("infusion");
//fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");

var jqUnit  = fluid.require("jqUnit");
var Browser = require("zombie");

require("gpii-express");

require("../../");
require("./zombie-test-harness");
require("./test-router-error");

fluid.registerNamespace("gpii.templates.hb.tests.client.templateFormControl");

gpii.templates.hb.tests.client.templateFormControl.runTests = function (that) {

    jqUnit.module("Testing templateFormControl component...");

    jqUnit.asyncTest("Use Zombie.js to verify the initial form rendering...", function () {
        var browser = Browser.create();
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
            jqUnit.stop();
        });
        browser.visit(that.options.config.express.baseUrl + "content/tests-templateFormControl.html").then(function () {
            // The client side has already manipulated a bunch of stuff by the time we see it, we're just inspecting the results.
            jqUnit.start();

            // Testing the "replaceWith" DOM-manipulation function
            var body = browser.window.$("body");
            jqUnit.assertTrue("The body should contain rendered content that replaces the original source.", body.text().indexOf("This content should not be visible") === -1);
        });
    });

    jqUnit.asyncTest("Use Zombie.js to submit a form that receives a successful AJAX response...", function () {
        var browser = Browser.create();
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
            jqUnit.stop();
        });
        browser.visit(that.options.config.express.baseUrl + "content/tests-templateFormControl.html").then(function () {
            browser.pressButton("Succeed", function () {
                jqUnit.start();
                var successElement = browser.window.$(".readyForSuccess");
                jqUnit.assertTrue("The component should now contain a 'success' message...", successElement.html().indexOf("This was a triumph") !== -1);

                var jsonElement = successElement.find(".json");
                var jsonData = JSON.parse(jsonElement.text());
                jqUnit.assertDeepEq("AJAX results should have been appended to the model data as outlined in our rules...", that.options.expected, jsonData);
            });
        });
    });

    jqUnit.asyncTest("Use Zombie.js to submit a form that receives an unsuccessful AJAX response...", function () {
        var browser = Browser.create();
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
            jqUnit.stop();
        });
        browser.visit(that.options.config.express.baseUrl + "content/tests-templateFormControl.html").then(function () {
            browser.pressButton("Fail", function () {
                jqUnit.start();
                var failureElement = browser.window.$(".readyForFailure");
                jqUnit.assertTrue("The component should now contain a 'fail' message...", failureElement.text().indexOf("Something went wrong") !== -1);
            });
        });
    });

    jqUnit.asyncTest("Use Zombie.js to submit a form that is sent an error with a 200 status code...", function () {
        var browser = Browser.create();
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
            jqUnit.stop();
        });
        browser.visit(that.options.config.express.baseUrl + "content/tests-templateFormControl.html").then(function () {
            browser.pressButton("Dither", function () {
                jqUnit.start();
                var ambiguityElement = browser.window.$(".readyForAmbiguity");
                jqUnit.assertTrue("The component should now contain a 'fail' message...", ambiguityElement.text().indexOf("Things seemed to go well") !== -1);
            });
        });
    });

    // TODO:  Find a way to simulate keyboard input from within Zombie or an alternative.
    //jqUnit.asyncTest("Use Zombie.js to submit a form by pressing 'enter' in a text field...", function () {
    //    var browser = Browser.create();
    //    browser.on("error", function (error) {
    //        jqUnit.start();
    //        jqUnit.fail("There should be no errors:" + error);
    //    });
    //    browser.visit(that.options.config.express.baseUrl + "content/tests-templateFormControl.html").then(function () {
    //        // Zombie lacks the ability to simulate keyboard events or form submits, but we can do it through jQuery.
    //        browser.window.$(".readyForKeys form").submit();
    //        setTimeout(function () {
    //            jqUnit.start();
    //            var keyedElement = browser.window.$(".readyForKeys");
    //            jqUnit.assertTrue("The component should now contain a 'success' message...", keyedElement.text().indexOf("You have succeeded") !== -1);
    //        }, 5000);
    //    });
    //});
};

gpii.templates.hb.tests.client.harness({
    "expressPort" :   6995,
    "baseUrl":        "http://localhost:6995/",
    expected: {
        message: "You have succeeded!",
        model: {
            record: {
                foo: "bar",
                baz: "qux"
            }
        }
    },
    listeners: {
        "{express}.events.onStarted": {
            funcName: "gpii.templates.hb.tests.client.templateFormControl.runTests",
            args:     ["{that}"]
        }
    }
});