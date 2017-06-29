/*

    Test for "live reloading" when templates are changed.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");

require("../../../index");

var copy   = require("recursive-copy");
var fs     = require("fs");
var jqUnit = require("node-jqunit");
var os     = require("os");
var path   = require("path");
var rimraf = require("rimraf");

require("gpii-express");
gpii.express.loadTestingSupport();

var kettle = require("kettle");
kettle.loadTestingSupport();

fluid.registerNamespace("gpii.tests.handlebars.live");

/**
 *
 * Confirm that a test string was added to the relevant template.
 * @param body {String} - The body of the document returned to the request.
 * @param expectedText {String} - The text to look for in the body.
 * @param invert {Boolean} - Whether to invert the comparison (used to confirm that the text is not initially present).
 *
 */
gpii.tests.handlebars.live.verifyResults = function (body, expectedText, invert) {
    var jqUnitFn = invert ? "assertFalse" : "assertTrue";
    var outcome = invert ? "should not" : "should";
    jqUnit[jqUnitFn]("The expected text " + outcome + " be found...", body && body.indexOf(expectedText) !== -1);
};

fluid.defaults("gpii.tests.handlebars.live.request", {
    gradeNames: ["kettle.test.request.http"],
    port:       "{testEnvironment}.options.port",
    path:       "{testEnvironment}.options.baseUrl"
});

/**
 *
 * Add text to a template, which we should be able to see in the rendered output after a "live" reload.
 *
 * @param templatedir {Strin} - The full relativeTemplatePath to the template directory.
 * @param relativeTemplatePath {String} - The relativeTemplatePath to the template, relative to the above.
 * @param textToAppend {String} - The text to append to the template.
 *
 */
gpii.tests.handlebars.live.updateTemplate = function (templateDir, relativeTemplatePath, textToAppend) {
    var fullPath = path.resolve(templateDir, relativeTemplatePath) + ".handlebars";
    fs.appendFileSync(fullPath, textToAppend);
};

fluid.defaults("gpii.tests.handlebars.live.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder.base"],
    sequenceStart: [
        {
            func: "{testEnvironment}.events.cloneTemplates.fire"
        },
        {
            event: "{testEnvironment}.events.onTemplatesCloned",
            listener: "{testEnvironment}.events.constructFixtures.fire"
        },
        {
            event: "{testEnvironment}.events.onWatcherReady",
            listener: "fluid.identity"
        }
    ],
    sequenceEnd: [
        {
            func: "{testEnvironment}.events.cleanup.fire"
        },
        {
            event: "{testEnvironment}.events.onCleanupComplete",
            listener: "fluid.identity"
        }
    ],
    rawModules: [
        {
            name: "Testing live reloading of template content...",
            tests: [
                {
                    name: "The single template middleware should be able to handle reloads...",
                    type: "test",
                    sequence: [
                        {
                            func: "{initialSingleTemplateRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.live.verifyResults",
                            event:    "{initialSingleTemplateRequest}.events.onComplete",
                            args:     ["{arguments}.0", "I love single templates.", true] // body, expectedText, invert
                        },
                        {
                            func: "gpii.tests.handlebars.live.updateTemplate",
                            args: ["{testEnvironment}.options.templateDirs", "pages/singleTemplateMiddleware", "I love single templates."] // templateDir, path, textToAppend
                        },
                        {
                            event:    "{testEnvironment}.events.onTemplatesLoaded",
                            listener: "{postChangeSingleTemplateRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.live.verifyResults",
                            event:    "{postChangeSingleTemplateRequest}.events.onComplete",
                            args:     ["{arguments}.0", "I love single templates."] // body, expectedText, invert
                        }
                    ]
                },
                {
                    name: "The 'dispatcher' middleware should be able to handle reloads...",
                    type: "test",
                    sequence: [
                        {
                            func: "{initialDispatcherRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.live.verifyResults",
                            event:    "{initialDispatcherRequest}.events.onComplete",
                            args:     ["{arguments}.0", "I love dispatched templates.", true] // body, expectedText, invert
                        },
                        {
                            func: "gpii.tests.handlebars.live.updateTemplate",
                            args: ["{testEnvironment}.options.templateDirs", "pages/index", "I love dispatched templates."] // templateDir, path, textToAppend
                        },
                        {
                            event:    "{testEnvironment}.events.onTemplatesLoaded",
                            listener: "{postChangeDispatcherRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.live.verifyResults",
                            event:    "{postChangeDispatcherRequest}.events.onComplete",
                            args:     ["{arguments}.0", "I love dispatched templates."] // body, expectedText, invert
                        }
                    ]
                },
                {
                    name: "The error-rendering middleware should be able to handle reloads...",
                    type: "test",
                    sequence: [
                        {
                            func: "{initialErrorRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.live.verifyResults",
                            event:    "{initialErrorRequest}.events.onComplete",
                            args:     ["{arguments}.0", "I love error templates.", true] // body, expectedText, invert
                        },
                        {
                            func: "gpii.tests.handlebars.live.updateTemplate",
                            args: ["{testEnvironment}.options.templateDirs", "pages/error", "I love error templates."] // templateDir, path, textToAppend
                        },
                        {
                            event:    "{testEnvironment}.events.onTemplatesLoaded",
                            listener: "{postChangeErrorRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.live.verifyResults",
                            event:    "{postChangeErrorRequest}.events.onComplete",
                            args:     ["{arguments}.0", "I love error templates."] // body, expectedText, invert
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        initialSingleTemplateRequest: {
            type: "gpii.tests.handlebars.live.request",
            options: {
                path: "/singleTemplate"
            }
        },
        postChangeSingleTemplateRequest: {
            type: "gpii.tests.handlebars.live.request",
            options: {
                path: "/singleTemplate"
            }
        },
        initialDispatcherRequest: {
            type: "gpii.tests.handlebars.live.request",
            options: {
                path: "/dispatcher"
            }
        },
        postChangeDispatcherRequest: {
            type: "gpii.tests.handlebars.live.request",
            options: {
                path: "/dispatcher"
            }
        },
        initialErrorRequest: {
            type: "gpii.tests.handlebars.live.request",
            options: {
                path: "/error"
            }
        },
        postChangeErrorRequest: {
            type: "gpii.tests.handlebars.live.request",
            options: {
                path: "/error"
            }
        }
    }
});

gpii.tests.handlebars.live.generateUniqueTemplateDir = function (that) {
    return path.resolve(os.tmpdir(), "live-templates-" + that.id);
};

/**
 * As we don't want to make changes to our actual template content, copy them to a temp directory where we can safely
 * make changes.
 *
 * @param that - The testEnvironment component itself.
 *
 */
gpii.tests.handlebars.live.cloneTemplates = function (that) {
    var resolvedSourcePath = fluid.module.resolvePath(that.options.templateSource);
    var copyPromise = copy(resolvedSourcePath, that.options.templateDirs);
    copyPromise.then(that.events.onTemplatesCloned.fire);
    copyPromise["catch"](fluid.fail);
};

gpii.tests.handlebars.live.cleanup = function (that) {
    rimraf(that.options.templateDirs, function (error) {
        if (error) {
            fluid.log("Error removing cloned template content:", error);
        }
        else {
            fluid.log("Removed cloned template content....");
            that.events.onCleanupComplete.fire();
        }
    });
};

fluid.registerNamespace("gpii.tests.handlebars.live.errorRenderingMiddleware.errorGeneratingMiddleware");
gpii.tests.handlebars.live.errorRenderingMiddleware.errorGeneratingMiddleware.middleware = function (next) {
    next({ isError: true, message: "nothing good can come from this..."});
};

fluid.defaults("gpii.tests.handlebars.live.errorRenderingMiddleware.errorGeneratingMiddleware", {
    gradeNames: ["gpii.express.middleware"],
    path:       "/error",
    namespace:  "errorGeneratingMiddleware",
    invokers: {
        middleware: {
            funcName: "gpii.tests.handlebars.live.errorRenderingMiddleware.errorGeneratingMiddleware.middleware",
            args:     ["{arguments}.2"] // req, res, next
        }
    }
});

fluid.defaults("gpii.tests.handlebars.live.environment", {
    gradeNames:  ["gpii.test.express.testEnvironment"],
    port: 6484,
    events: {
        cloneTemplates:    null,
        cleanup:           null,
        onCleanupComplete: null,
        onWatcherReady:    null,
        onTemplatesCloned: null,
        onTemplatesLoaded: null
    },
    templateSource: "%gpii-handlebars/tests/templates/primary",
    templateDirs: "@expand:gpii.tests.handlebars.live.generateUniqueTemplateDir({that})",
    listeners: {
        "cloneTemplates.cloneTemplates": {
            funcName: "gpii.tests.handlebars.live.cloneTemplates",
            args:     ["{that}"]
        },
        "cleanup.cleanup": {
            funcName: "gpii.tests.handlebars.live.cleanup",
            args:     ["{that}"]
        }
    },
    components: {
        express: {
            options: {
                components: {
                    handlebars: {
                        type: "gpii.express.hb.live",
                        options: {
                            templateDirs: "{gpii.tests.handlebars.live.environment}.options.templateDirs",
                            listeners: {
                                "onTemplatesLoaded.notifyEnvironment": {
                                    func: "{testEnvironment}.events.onTemplatesLoaded.fire"
                                },
                                "onWatcherReady.notifyEnvironment": {
                                    func: "{testEnvironment}.events.onWatcherReady.fire"
                                }
                            }
                        }
                    },
                    dispatcher: {
                        type: "gpii.handlebars.dispatcherMiddleware",
                        options: {
                            path: ["/dispatcher/:template", "/dispatcher"],
                            templateDirs: "{gpii.tests.handlebars.live.environment}.options.templateDirs"
                        }
                    },
                    singleTemplateMiddleware: {
                        type: "gpii.express.singleTemplateMiddleware",
                        options: {
                            path: "/singleTemplate",
                            templateKey: "pages/singleTemplateMiddleware"
                        }
                    },
                    errorGeneratingMiddleware: {
                        type: "gpii.tests.handlebars.live.errorRenderingMiddleware.errorGeneratingMiddleware"
                    },
                    htmlErrorHandler: {
                        type: "gpii.handlebars.errorRenderingMiddleware",
                        options: {
                            templateKey: "pages/error",
                            priority: "after:errorGeneratingMiddleware"
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.handlebars.live.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.handlebars.live.environment");
