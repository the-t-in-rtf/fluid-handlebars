// Test "template aware" client-side components using `gpii-test-browser`.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.registerNamespace("gpii.templates.tests.client.templateFormControl");

fluid.defaults("gpii.templates.tests.browser.templateFormControl.caseHolder", {
    gradeNames: ["gpii.templates.tests.browser.caseHolder"],
    rawModules: [{
        tests: [
            {
                name: "Confirm that the initial form is rendered...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, "body", "This content should not be visible"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args: ["The body should contain rendered content that replaces the original source...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Submit a form that receives a successful AJAX response (as JSON)...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".readyForSuccess input[type='submit']"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.wait",
                        args:     [500]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onWaitComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.elementMatches, ".readyForSuccess .success", "This was a triumph"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["A success message should now be displayed...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "success.model.record"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["AJAX results should have been appended to the model data as outlined in our rules...", "{gpii.templates.tests.browser.environment}.options.expected.record", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Submit a form that receives a successful AJAX response (as stringified JSON)...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".readyForStringifySuccess input[type='submit']"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.wait",
                        args:     [500]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onWaitComplete",                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.elementMatches, ".readyForStringifySuccess .success", "This was a triumph"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["A success message should now be displayed...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "successStringify.model.record"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["AJAX results should have been appended to the model data as outlined in our rules...", "{gpii.templates.tests.browser.environment}.options.expected.record", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Submit a form that receives a successful AJAX response (as a raw string)...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".readyForStringSuccess input[type='submit']"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.wait",
                        args:     [500]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onWaitComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.elementMatches, ".readyForStringSuccess .alert-box.success", "This was a triumph"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["A success message should now be displayed...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Submit a form that receives an unsuccessful AJAX response (as JSON)...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".readyForFailure input[type='submit']"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.wait",
                        args:     [500]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onWaitComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.elementMatches, ".readyForFailure", "Something went wrong"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["A failure message should now be displayed...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Submit a form that receives an unsuccessful AJAX response (as stringified JSON)...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".readyForStringifyFailure input[type='submit']"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.wait",
                        args:     [500]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onWaitComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.elementMatches, ".readyForStringifyFailure", "Something went wrong"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["A failure message should now be displayed...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Submit a form that receives an unsuccessful AJAX response (as a String)...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".readyForStringFailure input[type='submit']"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.wait",
                        args:     [500]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onWaitComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.elementMatches, ".readyForStringFailure", "Something went wrong"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["A failure message should now be displayed...", "{arguments}.0"]
                    }
                ]
            }
            // TODO:  Once Nightmare is updated to support keyboard events, test the use of the tab, space and enter keys to submit the form.
        ]
    }]
});

gpii.templates.tests.browser.environment({
    "port": 6993,
    "path": "content/tests-templateFormControl.html",
    expected: {
        record: {
            foo: "bar",
            baz: "qux"
        }
    },
    successStringExpected: { "message": "A success string is still a success." },
    components: {
        caseHolder: {
            type: "gpii.templates.tests.browser.templateFormControl.caseHolder"
        }
    }
});