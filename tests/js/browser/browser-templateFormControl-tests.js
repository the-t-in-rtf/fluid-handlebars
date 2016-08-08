// Test "template aware" client-side components using `gpii-test-browser`.
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.registerNamespace("gpii.tests.handlebars.client.templateFormControl");

fluid.defaults("gpii.tests.handlebars.browser.templateFormControl.caseHolder", {
    gradeNames: ["gpii.test.webdriver.caseHolder"],
    rawModules: [{
        name: "Testing the `templateFormControl` client-side grade...",
        tests: [
            {
                name: "Confirm that the initial form is rendered...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onGetComplete",
                        listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
                        args:     [gpii.webdriver.until.elementLocated({ css: ".readyForSuccess"})]
                    },
                    {
                        event: "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
                        listener: "{gpii.test.handlebars.browser.environment}.webdriver.findElement",
                        args: [{ css: "body" }]
                    },
                    {
                        event: "{gpii.test.handlebars.browser.environment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.elementMatches",
                        args: ["The body should contain rendered content that replaces the original source...", "{arguments}.0", "getText", "This content should not be visible", true] // message, element, elementFn, pattern, invert
                    }
                ]
            },
            // TODO:  Finish the rest of these
            // {
            //     name: "Submit a form that receives a successful AJAX response (as JSON)...",
            //     sequence: [
            //         {
            //             func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
            //             args: ["{gpii.test.handlebars.browser.environment}.options.url"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onGetComplete",
            //             // Give the page time to render to avoid intermittent errors
            //             // TODO: Fix this properly once this issue is resolved: https://issues.gpii.net/browse/GPII-1574
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     ["{testEnvironment}.options.waitAfterLoad"]
            //         },
            //         {
            //             event: "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.browser.click",
            //             args:     [".readyForSuccess input[type='submit']"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.browser.events.onClickComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     [500]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.executeScript",
            //             args:     [gpii.test.browser.elementMatches, ".readyForSuccess .success", "This was a triumph"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "jqUnit.assertTrue",
            //             args:     ["A success message should now be displayed...", "{arguments}.0"]
            //         },
            //         {
            //             func: "{gpii.test.handlebars.browser.environment}.webdriver.executeScript",
            //             args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "success.model.record"] // functionPath, fnArgs, environment
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "jqUnit.assertDeepEq",
            //             args:     ["AJAX results should have been appended to the model data as outlined in our rules...", "{gpii.test.handlebars.browser.environment}.options.expected.record", "{arguments}.0"]
            //         }
            //     ]
            // },
            // {
            //     name: "Submit a form that receives a successful AJAX response (as stringified JSON)...",
            //     sequence: [
            //         {
            //             func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
            //             args: ["{gpii.test.handlebars.browser.environment}.options.url"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onGetComplete",
            //             // Give the page time to render to avoid intermittent errors
            //             // TODO: Fix this properly once this issue is resolved: https://issues.gpii.net/browse/GPII-1574
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     ["{testEnvironment}.options.waitAfterLoad"]
            //         },
            //         {
            //             event: "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.browser.click",
            //             args:     [".readyForStringifySuccess input[type='submit']"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.browser.events.onClickComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     [500]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.executeScript",
            //             args:     [gpii.test.browser.elementMatches, ".readyForStringifySuccess .success", "This was a triumph"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "jqUnit.assertTrue",
            //             args:     ["A success message should now be displayed...", "{arguments}.0"]
            //         },
            //         {
            //             func: "{gpii.test.handlebars.browser.environment}.webdriver.executeScript",
            //             args: [gpii.test.webdriver.invokeGlobal, "fluid.getGlobalValue", "successStringify.model.record"] // functionPath, fnArgs, environment
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "jqUnit.assertDeepEq",
            //             args:     ["AJAX results should have been appended to the model data as outlined in our rules...", "{gpii.test.handlebars.browser.environment}.options.expected.record", "{arguments}.0"]
            //         }
            //     ]
            // },
            // {
            //     name: "Submit a form that receives a successful AJAX response (as a raw string)...",
            //     sequence: [
            //         {
            //             func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
            //             args: ["{gpii.test.handlebars.browser.environment}.options.url"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onGetComplete",
            //             // Give the page time to render to avoid intermittent errors
            //             // TODO: Fix this properly once this issue is resolved: https://issues.gpii.net/browse/GPII-1574
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     ["{testEnvironment}.options.waitAfterLoad"]
            //         },
            //         {
            //             event: "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.browser.click",
            //             args:     [".readyForStringSuccess input[type='submit']"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.browser.events.onClickComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     [500]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.executeScript",
            //             args:     [gpii.test.browser.elementMatches, ".readyForStringSuccess .alert-box.success", "This was a triumph"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "jqUnit.assertTrue",
            //             args:     ["A success message should now be displayed...", "{arguments}.0"]
            //         }
            //     ]
            // },
            // {
            //     name: "Submit a form that receives an unsuccessful AJAX response (as JSON)...",
            //     sequence: [
            //         {
            //             func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
            //             args: ["{gpii.test.handlebars.browser.environment}.options.url"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onGetComplete",
            //             // Give the page time to render to avoid intermittent errors
            //             // TODO: Fix this properly once this issue is resolved: https://issues.gpii.net/browse/GPII-1574
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     ["{testEnvironment}.options.waitAfterLoad"]
            //         },
            //         {
            //             event: "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.browser.click",
            //             args:     [".readyForFailure input[type='submit']"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.browser.events.onClickComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     [500]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.executeScript",
            //             args:     [gpii.test.browser.elementMatches, ".readyForFailure", "Something went wrong"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "jqUnit.assertTrue",
            //             args:     ["A failure message should now be displayed...", "{arguments}.0"]
            //         }
            //     ]
            // },
            // {
            //     name: "Submit a form that receives an unsuccessful AJAX response (as stringified JSON)...",
            //     sequence: [
            //         {
            //             func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
            //             args: ["{gpii.test.handlebars.browser.environment}.options.url"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onGetComplete",
            //             // Give the page time to render to avoid intermittent errors
            //             // TODO: Fix this properly once this issue is resolved: https://issues.gpii.net/browse/GPII-1574
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     ["{testEnvironment}.options.waitAfterLoad"]
            //         },
            //         {
            //             event: "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.browser.click",
            //             args:     [".readyForStringifyFailure input[type='submit']"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.browser.events.onClickComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     [500]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.executeScript",
            //             args:     [gpii.test.browser.elementMatches, ".readyForStringifyFailure", "Something went wrong"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "jqUnit.assertTrue",
            //             args:     ["A failure message should now be displayed...", "{arguments}.0"]
            //         }
            //     ]
            // },
            // {
            //     name: "Submit a form that receives an unsuccessful AJAX response (as a String)...",
            //     sequence: [
            //         {
            //             func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
            //             args: ["{gpii.test.handlebars.browser.environment}.options.url"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onGetComplete",
            //             // Give the page time to render to avoid intermittent errors
            //             // TODO: Fix this properly once this issue is resolved: https://issues.gpii.net/browse/GPII-1574
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     ["{testEnvironment}.options.waitAfterLoad"]
            //         },
            //         {
            //             event: "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.browser.click",
            //             args:     [".readyForStringFailure input[type='submit']"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.browser.events.onClickComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.wait",
            //             args:     [500]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onWaitComplete",
            //             listener: "{gpii.test.handlebars.browser.environment}.webdriver.executeScript",
            //             args:     [gpii.test.browser.elementMatches, ".readyForStringFailure", "Something went wrong"]
            //         },
            //         {
            //             event:    "{gpii.test.handlebars.browser.environment}.webdriver.events.onExecuteScriptComplete",
            //             listener: "jqUnit.assertTrue",
            //             args:     ["A failure message should now be displayed...", "{arguments}.0"]
            //         }
            //     ]
            // }
            // TODO:  Test the use of the tab, space and enter keys to submit the form.
        ]
    }]
});

fluid.defaults("gpii.tests.handlebars.browser.templateFormControl.testEnvironment", {
    gradeNames: ["gpii.test.handlebars.browser.environment"],
    port: 6993,
    path: "content/tests-templateFormControl.html",
    waitAfterLoad: 150,
    expected: {
        record: {
            foo: "bar",
            baz: "qux"
        }
    },
    successStringExpected: { "message": "A success string is still a success." },
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.templateFormControl.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.handlebars.browser.templateFormControl.testEnvironment"});
