/*
    Test harness common to all Zombie tests.  Loads all required server-side components.
 */
"use strict";
var fluid = require("infusion");

require("gpii-express");

require("../../");
require("./lib/test-router-error");

fluid.defaults("gpii.templates.tests.client.harness", {
    gradeNames:  ["gpii.express"],
    port: 6994,
    baseUrl: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/", { port: "{that}.options.port"}]
        }
    },
    config:  {
        express: {
            port:    "{that}.options.port",
            baseUrl: "{that}.options.baseUrl"
        }
    },
    templateDirs: ["%gpii-handlebars/tests/templates/primary", "%gpii-handlebars/tests/templates/secondary"],
    components: {
        dispatcher: {
            type: "gpii.express.dispatcher",
            options: {
                path: ["/dispatcher/:template", "/dispatcher"],
                templateDirs: "{harness}.options.templateDirs",
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
        inline: {
            type: "gpii.express.hb.inline",
            options: {
                path: "/hbs",
                templateDirs: "{harness}.options.templateDirs"
            }
        },
        bc: {
            type: "gpii.express.router.static",
            options: {
                path:    "/bc",
                content: "%gpii-handlebars/bower_components"
            }
        },
        js: {
            type: "gpii.express.router.static",
            options: {
                path:    "/src",
                content: "%gpii-handlebars/src"
            }
        },
        modules: {
            type: "gpii.express.router.static",
            options: {
                path:    "/modules",
                content: "%gpii-handlebars/node_modules"
            }
        },
        content: {
            type: "gpii.express.router.static",
            options: {
                path:    "/content",
                content: "%gpii-handlebars/tests/static"
            }
        },
        handlebars: {
            type: "gpii.express.hb",
            options: {
                templateDirs: "{harness}.options.templateDirs",
                components: {
                    initBlock: {
                        options: {
                            contextToOptionsRules: {
                                model: {
                                    "":       "notfound",
                                    req:      "req",
                                    myvar:    "myvar",
                                    markdown: "markdown",
                                    json:     "json"
                                }
                            }
                        }
                    }
                }
            }
        },
        error: {
            type: "gpii.templates.tests.router.error"
        },
        errorJsonString: {
            type: "gpii.templates.tests.router.error",
            options: {
                path: "/errorJsonString",
                body: JSON.stringify({ok: false, message: "There was a problem.  I'm telling you about it using a stringified JSON response.  Hope that's OK with you."})
            }
        },
        errorString: {
            type: "gpii.templates.tests.router.error",
            options: {
                path: "/errorString",
                body: "There was a problem.  I'm telling you about it with a string response, hopefully this doesn't cause another problem."
            }
        }
    }
});