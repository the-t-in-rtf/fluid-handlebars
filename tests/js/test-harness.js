/*
    Test harness common to all Zombie tests.  Loads all required server-side components.
 */
"use strict";
var fluid = require("infusion");
var path  = require("path");

require("gpii-express");

require("../../");
require("./lib/test-router-error");

// Test content (HTML, JS, templates)
var testDir    = path.resolve(__dirname, "..");
var contentDir = path.join(testDir, "static");

var views = [
    path.join(testDir, "templates/primary"),
    path.join(testDir, "templates/secondary")
];

// Dependencies
var bcDir      = path.resolve(__dirname, "../../bower_components");
var modulesDir = path.resolve(__dirname, "../../node_modules");

// Main source to be tested
var srcDir     = path.resolve(__dirname, "../../src");

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
            baseUrl: "{that}.options.baseUrl",
            views:   views
        }
    },
    components: {
        dispatcher: {
            type: "gpii.express.dispatcher",
            options: {
                path: ["/dispatcher/:template", "/dispatcher"],
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
                path: "/hbs"
            }
        },
        bc: {
            type: "gpii.express.router.static",
            options: {
                path:    "/bc",
                content: bcDir
            }
        },
        js: {
            type: "gpii.express.router.static",
            options: {
                path:    "/src",
                content: srcDir
            }
        },
        modules: {
            type: "gpii.express.router.static",
            options: {
                path:    "/modules",
                content: modulesDir
            }
        },
        content: {
            type: "gpii.express.router.static",
            options: {
                path:    "/content",
                content: contentDir
            }
        },
        handlebars: {
            type: "gpii.express.hb",
            options: {
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