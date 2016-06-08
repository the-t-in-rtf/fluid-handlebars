// Test "template aware" client-side components using `gpii-test-browser`.
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.defaults("gpii.tests.handlebars.browser.templateAware.standalone.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing the standalone `templateAware` grade...",
        tests: [
            {
                name: "Confirm that the view contains rendered content (including variable data)...",
                sequence: [
                    {
                        func: "{testEnvironment}.browser.goto",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event: "{testEnvironment}.browser.events.onLoaded",
                        func:  "{testEnvironment}.browser.evaluate",
                        args:  [gpii.test.browser.getElementHtml, ".templateAware-standalone-viewport"]
                    },
                    {
                        event:    "{testEnvironment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The view should contain rendered content...", "This is our rendered template content.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.handlebars.browser.templateAware.standalone.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    path: "%gpii-handlebars/tests/static/tests-templateAware-standalone.html",
    url: "@expand:gpii.test.browser.resolveFileUrl({that}.options.path)",
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.templateAware.standalone.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.handlebars.browser.templateAware.standalone.testEnvironment");
