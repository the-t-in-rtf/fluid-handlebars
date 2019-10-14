/*
    Test harness common to all Zombie tests.  Loads all required server-side components.
 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%gpii-handlebars");
fluid.require("%gpii-express");

require("../../");

require("./lib/test-router-error");

// A common "base" grade that is also suitable for use with Testem.
fluid.defaults("gpii.test.handlebars.harness.base", {
    gradeNames:  ["gpii.express"],
    port: 6994,
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{that}.options.port"}]
        }
    },
    templateDirs: {
        primary: "%gpii-handlebars/tests/templates/primary",
        secondary: {
            path: "%gpii-handlebars/tests/templates/secondary",
            priority: "before:primary"
        }
    },
    messageDirs: {
        secondary: "%gpii-handlebars/tests/messages/secondary",
        primary: "%gpii-handlebars/tests/messages/primary"
    },
    contextToOptionsRules: {
        model: {
            "":       "notfound",
            req:      "req",
            myvar:    "myvar",
            markdown: "markdown",
            json:     "json"
        }
    },
    distributeOptions: {
        source: "{that}.options.contextToOptionsRules",
        target: "{that gpii.handlebars.helper.initBlock}.options.contextToOptionsRules"
    },
    components: {
        handlebars: {
            type: "gpii.express.hb",
            options: {
                templateDirs: "{gpii.test.handlebars.harness.base}.options.templateDirs",
                model: {
                    messageBundles: "{messageBundleLoader}.model.messageBundles"
                }
            }
        },
        dispatcher: {
            type: "gpii.handlebars.dispatcherMiddleware",
            options: {
                priority: "after:handlebars",
                path: ["/dispatcher/:template", "/dispatcher"],
                templateDirs: "{gpii.test.handlebars.harness.base}.options.templateDirs",
                rules: {
                    contextToExpose: {
                        myvar:    { literalValue: "modelvariable" },
                        markdown: { literalValue: "*this works*" },
                        json:     { literalValue: { foo: "bar", baz: "quux", qux: "quux" } },
                        req:      { params: "req.params", query: "req.query"}
                    }
                }
            }
        },
        templates: {
            type: "gpii.handlebars.inlineTemplateBundlingMiddleware",
            options: {
                templateDirs: "{gpii.test.handlebars.harness.base}.options.templateDirs"
            }
        },
        messageBundleLoader: {
            type: "gpii.handlebars.i18n.messageBundleLoader",
            options: {
                messageDirs: "{gpii.test.handlebars.harness.base}.options.messageDirs"
            }
        },
        messages: {
            type: "gpii.handlebars.inlineMessageBundlingMiddleware",
            options: {
                messageDirs: "{gpii.test.handlebars.harness.base}.options.messageDirs",
                model: {
                    messageBundles: "{messageBundleLoader}.model.messageBundles"
                }
            }
        },
        error: {
            type: "gpii.test.handlebars.jsonErrorPitcher"
        },
        errorJsonString: {
            type: "gpii.test.handlebars.jsonErrorPitcher",
            options: {
                path: "/errorJsonString",
                body: JSON.stringify({ok: false, message: "There was a problem.  I'm telling you about it using a stringified JSON response.  Hope that's OK with you."})
            }
        },
        errorString: {
            type: "gpii.test.handlebars.jsonErrorPitcher",
            options: {
                path: "/errorString",
                body: "There was a problem.  I'm telling you about it with a string response, hopefully this doesn't cause another problem."
            }
        }
    }
});

// A more fully fleshed out grade that has its own express instance and additional error handling components.
fluid.defaults("gpii.test.handlebars.harness", {
    gradeNames:  ["gpii.express", "gpii.test.handlebars.harness.base"],
    components: {
        error: {
            type: "gpii.test.handlebars.jsonErrorPitcher"
        },
        errorJsonString: {
            type: "gpii.test.handlebars.jsonErrorPitcher",
            options: {
                path: "/errorJsonString",
                body: JSON.stringify({ok: false, message: "There was a problem.  I'm telling you about it using a stringified JSON response.  Hope that's OK with you."})
            }
        },
        errorString: {
            type: "gpii.test.handlebars.jsonErrorPitcher",
            options: {
                path: "/errorString",
                body: "There was a problem.  I'm telling you about it with a string response, hopefully this doesn't cause another problem."
            }
        }
    }
});
