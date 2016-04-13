// Test "templateMessage" components using `gpii-test-browser`.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.defaults("gpii.handlebars.tests.browser.templateMessage.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.withExpress"],
    rawModules: [{
        tests: [
            {
                name: "Confirm that the templateMessage component is initialized and rendered correctly...",
                sequence: [
                    {
                        func: "{gpii.handlebars.tests.browser.environment}.browser.goto",
                        args: ["{gpii.handlebars.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.handlebars.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, "body", "{gpii.handlebars.tests.browser.environment}.options.notExpected"]
                    },
                    {
                        event: "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args: ["The placeholder text should no longer be present...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, "body", "{gpii.handlebars.tests.browser.environment}.options.expected.initialized"]
                    },
                    {
                        event: "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args: ["A component with initial model data should display as expected...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, "body", "{gpii.handlebars.tests.browser.environment}.options.expected.updated"]
                    },
                    {
                        event: "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args: ["A component with updated model data should display as expected...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.handlebars.tests.browser.environment({
    "port": 6924,
    "path": "content/tests-templateMessage.html",
    notExpected: "should not be visible",
    expected: {
        initialized: "born with silver model data in my mouth",
        updated:     "some have data thrust upon them"
    },
    components: {
        caseHolder: {
            type: "gpii.handlebars.tests.browser.templateMessage.caseHolder"
        }
    }
});
