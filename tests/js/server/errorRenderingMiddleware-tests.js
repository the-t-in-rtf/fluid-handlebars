// Tests for the "error rendering middleware".
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");

var jqUnit = require("node-jqunit");

fluid.require("%fluid-handlebars");

fluid.require("%fluid-express");
fluid.express.loadTestingSupport();

fluid.registerNamespace("fluid.tests.handlebars.errorRenderingMiddleware");
fluid.tests.handlebars.errorRenderingMiddleware.responseHasText = function (message, pattern, body) {
    jqUnit.assertTrue(message, body.match(pattern));
};

// A router that is born to lose, with a worried mind.
fluid.registerNamespace("fluid.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware");
fluid.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware.middleware = function (next) {
    next({ isError: true, message: "*sound of drums*"});
};

fluid.defaults("fluid.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware", {
    gradeNames: ["fluid.express.middleware"],
    path:       "/untemperedSchism",
    namespace:  "errorGeneratingMiddleware",
    invokers: {
        middleware: {
            funcName: "fluid.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware.middleware",
            args:     ["{arguments}.2"] // req, res, next
        }
    }
});

fluid.defaults("fluid.tests.templates.errorRenderingMiddleware.request", {
    gradeNames: ["fluid.test.express.request"],
    endpoint:   "untemperedSchism"
});

fluid.defaults("fluid.tests.templates.errorRenderingMiddleware.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
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
                            listener: "fluid.tests.handlebars.errorRenderingMiddleware.responseHasText",
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
                            listener: "fluid.tests.handlebars.errorRenderingMiddleware.responseHasText",
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
            type: "fluid.tests.templates.errorRenderingMiddleware.request",
            options: {
                headers: {
                    accept: "text/html"
                }
            }
        },
        jsonRequest: {
            type: "fluid.tests.templates.errorRenderingMiddleware.request",
            options: {
                headers: {
                    accept: "application/json"
                }
            }
        },
        noAcceptHeaderRequest: {
            type: "fluid.tests.templates.errorRenderingMiddleware.request"
        }
    }
});

fluid.defaults("fluid.tests.templates.errorRenderingMiddleware.environment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    port:       6494,
    components: {
        express: {
            options: {
                components: {
                    handlebars: {
                        type: "fluid.express.hb",
                        options: {
                            templateDirs:   ["%fluid-handlebars/tests/templates/primary"]
                        }
                    },
                    errorGeneratingMiddleware: {
                        type: "fluid.tests.handlebars.errorRenderingMiddleware.errorGeneratingMiddleware",
                        options: {
                            priority: "after:handlebars"
                        }
                    },
                    htmlErrorHandler: {
                        type: "fluid.handlebars.errorRenderingMiddleware",
                        options: {
                            templateKey: "pages/error",
                            priority: "after:errorGeneratingMiddleware"
                        }
                    },
                    defaultErrorHandler: {
                        type: "fluid.express.middleware.error",
                        options: {
                            priority: "after:htmlErrorHandler"
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "fluid.tests.templates.errorRenderingMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.tests.templates.errorRenderingMiddleware.environment");
