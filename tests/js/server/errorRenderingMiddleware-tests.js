// Tests for the "error rendering middleware".
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.require("%gpii-handlebars");

fluid.require("%gpii-express");
gpii.express.loadTestingSupport();

fluid.registerNamespace("gpii.tests.handlebars.errorRenderingMiddleware");
gpii.tests.handlebars.errorRenderingMiddleware.responseHasText = function (message, pattern, body) {
    jqUnit.assertTrue(message, body.match(pattern));
};

// A router that is born to lose, with a worried mind.
fluid.registerNamespace("gpii.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware");
gpii.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware.middleware = function (next) {
    next({ isError: true, message: "*sound of drums*"});
};

fluid.defaults("gpii.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware", {
    gradeNames: ["gpii.express.middleware"],
    path:       "/untemperedSchism",
    namespace:  "errorGeneratingMiddleware",
    invokers: {
        middleware: {
            funcName: "gpii.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware.middleware",
            args:     ["{arguments}.2"] // req, res, next
        }
    }
});

fluid.defaults("gpii.tests.templates.errorRenderingMiddleware.request", {
    gradeNames: ["gpii.test.express.request"],
    endpoint:   "untemperedSchism"
});

fluid.defaults("gpii.tests.templates.errorRenderingMiddleware.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    expected: {
        html: /There was an error:\r?\n\r?\n\*sound of drums\*/m,
        json: { isError: true, message: "*sound of drums*"}
    },
    rawModules: [
        {
            name: "Testing error rendering middleware...",
            tests: [
                {
                    name: "Confirm that an HTML error is rendered correctly...",
                    type: "test",
                    sequence: [
                        {
                            func: "{htmlRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.errorRenderingMiddleware.responseHasText",
                            event:    "{htmlRequest}.events.onComplete",
                            args:     ["The HTML error should be as expected...", "{that}.options.expected.html", "{arguments}.0"]
                        }
                    ]
                },
                {
                    name: "Confirm that a JSON error is handled correctly...",
                    type: "test",
                    sequence: [
                        {
                            func: "{jsonRequest}.send"
                        },
                        {
                            listener: "jqUnit.assertDeepEq",
                            event:    "{jsonRequest}.events.onComplete",
                            args:     ["The JSON error should be as expected...", "{that}.options.expected.json", "@expand:JSON.parse({arguments}.0)"]
                        }
                    ]
                },
                {
                    name: "Confirm that an error with no `accept` header is handled correctly...",
                    type: "test",
                    sequence: [
                        {
                            func: "{noAcceptHeaderRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.errorRenderingMiddleware.responseHasText",
                            event:    "{noAcceptHeaderRequest}.events.onComplete",
                            args:     ["The default error should be as expected...", "{that}.options.expected.html", "{arguments}.0"]
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        htmlRequest: {
            type: "gpii.tests.templates.errorRenderingMiddleware.request",
            options: {
                headers: {
                    accept: "text/html"
                }
            }
        },
        jsonRequest: {
            type: "gpii.tests.templates.errorRenderingMiddleware.request",
            options: {
                headers: {
                    accept: "application/json"
                }
            }
        },
        noAcceptHeaderRequest: {
            type: "gpii.tests.templates.errorRenderingMiddleware.request"
        }
    }
});

fluid.defaults("gpii.tests.templates.errorRenderingMiddleware.environment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port:       6494,
    components: {
        express: {
            options: {
                components: {
                    handlebars: {
                        type: "gpii.express.hb",
                        options: {
                            templateDirs:   ["%gpii-handlebars/tests/templates/primary"]
                        }
                    },
                    errorGeneratingMiddleware: {
                        type: "gpii.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware",
                        options: {
                            priority: "after:handlebars"
                        }
                    },
                    htmlErrorHandler: {
                        type: "gpii.handlebars.errorRenderingMiddleware",
                        options: {
                            templateKey: "pages/error",
                            priority: "after:errorGeneratingMiddleware"
                        }
                    },
                    defaultErrorHandler: {
                        type: "gpii.express.middleware.error",
                        options: {
                            priority: "after:errorRenderingMiddleware"
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.templates.errorRenderingMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.templates.errorRenderingMiddleware.environment");
