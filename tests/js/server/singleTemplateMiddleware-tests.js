// Tests for the "single template router".
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-handlebars");

var jqUnit = require("node-jqunit");
var fs     = require("fs");

// TODO: Update to the new JSDOM API or find a replacement.
var jsdom  = require("jsdom/lib/old-api");

var jqueryContent = fs.readFileSync(fluid.module.resolvePath("%infusion/src/lib/jquery/core/js/jquery.js"), "utf8");

fluid.require("%gpii-express");
gpii.express.loadTestingSupport();

var kettle = require("kettle");
kettle.loadTestingSupport();

fluid.registerNamespace("gpii.tests.handlebars.singleTemplateMiddleware");

// Verify the results of a request.  Accepts the following values:
//
// `response`: The native response returned by `kettle.request.http`.
//
// `body`: The request body returned by `kettle.request.http`
//
// `statusCode`: The numeric status code that is expected.
//
// `expected`: A map whose keys are jQuery selectors that correspond to a single element found in the page, and whose values
// are the expected trimmed output of the `text()` function for a given element, as in:
//
//  { "#myId": "These are my contents." }
//
// `notExpected`: An array of selectors that should either not be found or that should not contain any output.
//
gpii.tests.handlebars.singleTemplateMiddleware.verifyResults = function (response, body, statusCode, expected, notExpected) {
    jqUnit.assertEquals("The status code should be as expected...", statusCode, response.statusCode);


    jsdom.env({
        html: body,
        src:  [jqueryContent],
        done: function (err, window) {
            jqUnit.assertNull("There should be no errors...", err);

            if (expected) {
                fluid.each(expected, function (expectedValue, expectedSelector) {
                    var matchingElements = window.$(expectedSelector);
                    jqUnit.assertEquals("There should be exactly one matching element...", 1, matchingElements.length);

                    jqUnit.assertEquals("The text should be as expected...", expectedValue, matchingElements.text().trim());
                });
            }

            if (notExpected) {
                fluid.each(notExpected, function (notExpectedSelector) {
                    var matchingElements = window.$(notExpectedSelector);
                    jqUnit.assertTrue("The element should not be found...", matchingElements.length === 0);
                });
            }
        }
    });
};

fluid.defaults("gpii.tests.handlebars.singleTemplateMiddleware.request", {
    gradeNames: ["kettle.test.request.http"],
    port:       "{testEnvironment}.options.port",
    path:       "{testEnvironment}.options.baseUrl"
});

fluid.defaults("gpii.tests.handlebars.singleTemplateMiddleware.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [
        {
            name: "Testing single template middleware...",
            tests: [
                {
                    name: "Confirm that a template is rendered without request data...",
                    type: "test",
                    sequence: [
                        {
                            func: "{noDataRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.singleTemplateMiddleware.verifyResults",
                            event:    "{noDataRequest}.events.onComplete",
                            args:     ["{noDataRequest}.nativeResponse", "{arguments}.0", 200, false, ["#req-myvar"]]
                        }
                    ]
                },
                {
                    name: "Confirm that a template is rendered with request data...",
                    type: "test",
                    sequence: [
                        {
                            func: "{dataRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.singleTemplateMiddleware.verifyResults",
                            event:    "{dataRequest}.events.onComplete",
                            args:     ["{dataRequest}.nativeResponse", "{arguments}.0", 200, {"#req-myvar": "query data"}]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        noDataRequest: {
            type: "gpii.tests.handlebars.singleTemplateMiddleware.request"
        },
        dataRequest: {
            type: "gpii.tests.handlebars.singleTemplateMiddleware.request",
            options: {
                path: {
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args:     ["%baseUrl?myvar=query+data", { baseUrl: "{testEnvironment}.options.baseUrl"}]
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.handlebars.singleTemplateMiddleware.environment", {
    gradeNames:  ["gpii.test.express.testEnvironment"],
    port: 6494,
    components: {
        express: {
            options: {
                components: {
                    urlencoded: {
                        type: "gpii.express.middleware.bodyparser.urlencoded"
                    },
                    singleTemplateMiddleware: {
                        type: "gpii.express.singleTemplateMiddleware",
                        options: {
                            templateKey: "pages/singleTemplateMiddleware"
                        }
                    },
                    handlebars: {
                        type: "gpii.express.hb",
                        options: {
                            templateDirs:   ["%gpii-handlebars/tests/templates/primary"]
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.handlebars.singleTemplateMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.handlebars.singleTemplateMiddleware.environment");
