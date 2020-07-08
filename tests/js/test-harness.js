/*
    Test harness common to all Zombie tests.  Loads all required server-side components.
 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-handlebars");
fluid.require("%fluid-express");

require("../../");

require("./lib/test-router-error");

// A common "base" grade that is also suitable for use with Testem.
fluid.defaults("fluid.test.handlebars.harness.base", {
    gradeNames:  ["fluid.express"],
    port: 6994,
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{that}.options.port"}]
        }
    },
    templateDirs: {
        primary: "%fluid-handlebars/tests/templates/primary",
        secondary: {
            path: "%fluid-handlebars/tests/templates/secondary",
            priority: "before:primary"
        }
    },
    messageDirs: {
        secondary: "%fluid-handlebars/tests/messages/secondary",
        primary: "%fluid-handlebars/tests/messages/primary"
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
        target: "{that fluid.handlebars.helper.initBlock}.options.contextToOptionsRules"
    },
    components: {
        handlebars: {
            type: "fluid.express.hb",
            options: {
                templateDirs: "{fluid.test.handlebars.harness.base}.options.templateDirs",
                model: {
                    messageBundles: "{messageBundleLoader}.model.messageBundles"
                }
            }
        },
        dispatcher: {
            type: "fluid.handlebars.dispatcherMiddleware",
            options: {
                priority: "after:handlebars",
                path: ["/dispatcher/:template", "/dispatcher"],
                templateDirs: "{fluid.test.handlebars.harness.base}.options.templateDirs",
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
            type: "fluid.handlebars.inlineTemplateBundlingMiddleware",
            options: {
                templateDirs: "{fluid.test.handlebars.harness.base}.options.templateDirs"
            }
        },
        messageBundleLoader: {
            type: "fluid.handlebars.i18n.messageBundleLoader",
            options: {
                messageDirs: "{fluid.test.handlebars.harness.base}.options.messageDirs"
            }
        },
        messages: {
            type: "fluid.handlebars.inlineMessageBundlingMiddleware",
            options: {
                messageDirs: "{fluid.test.handlebars.harness.base}.options.messageDirs",
                model: {
                    messageBundles: "{messageBundleLoader}.model.messageBundles"
                }
            }
        },
        error: {
            type: "fluid.test.handlebars.jsonErrorPitcher"
        },
        errorJsonString: {
            type: "fluid.test.handlebars.jsonErrorPitcher",
            options: {
                path: "/errorJsonString",
                body: JSON.stringify({isError: true, message: "There was a problem.  I'm telling you about it using a stringified JSON response.  Hope that's OK with you."})
            }
        },
        errorString: {
            type: "fluid.test.handlebars.jsonErrorPitcher",
            options: {
                path: "/errorString",
                body: "There was a problem.  I'm telling you about it with a string response, hopefully this doesn't cause another problem."
            }
        }
    }
});

// A more fully fleshed out grade that has its own express instance and additional error handling components.
fluid.defaults("fluid.test.handlebars.harness", {
    gradeNames:  ["fluid.express", "fluid.test.handlebars.harness.base"],
    components: {
        error: {
            type: "fluid.test.handlebars.jsonErrorPitcher"
        },
        errorJsonString: {
            type: "fluid.test.handlebars.jsonErrorPitcher",
            options: {
                path: "/errorJsonString",
                body: JSON.stringify({isError: true, message: "There was a problem.  I'm telling you about it using a stringified JSON response.  Hope that's OK with you."})
            }
        },
        errorString: {
            type: "fluid.test.handlebars.jsonErrorPitcher",
            options: {
                path: "/errorString",
                body: "There was a problem.  I'm telling you about it with a string response, hopefully this doesn't cause another problem."
            }
        }
    }
});
