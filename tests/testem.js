/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-testem");
fluid.require("%gpii-handlebars");

require("./js/test-harness");

fluid.defaults("gpii.test.handlebars.coverageServer", {
    gradeNames: ["gpii.testem.coverage.express", "gpii.test.handlebars.harness.base"]
});

var testemComponent = gpii.testem.instrumentation({
    reportsDir: "reports",
    coverageDir: "coverage",
    testPages:   [
        "tests/browser-fixtures/all-tests.html"
    ],
    sourceDirs: {
        src: "%gpii-handlebars/src"
    },
    contentDirs: {
        "tests": "%gpii-handlebars/tests",
        "node_modules": "%gpii-handlebars/node_modules"
    },
    additionalProxies: {
        dispatcher:      "/dispatcher",
        messages:        "/messages",
        templates:       "/templates",
        error:           "/error",
        errorJsonString: "/errorJsonString",
        errorString:     "/errorString"
    },
    // Force Firefox to run headless as a temporary fix for Firefox issues on Windows:
    // https://github.com/testem/testem/issues/1377
    "browserArgs": {
        "Firefox": [
            "--no-remote",
            "--headless"
        ]
    },
    testemOptions: {
        skip: "PhantomJS,Safari,IE,Headless Chrome" // "Headless Chrome" throws GPU errors at the moment, so just use Chrome.
    },
    components: {
        express: {
            type: "gpii.test.handlebars.coverageServer",
            options: {
                templateDirs: "{gpii.testem.instrumentation}.options.templateDirs",
                messageDirs:  "{gpii.testem.instrumentation}.options.messageDirs"
            }
        }
    }
});

module.exports = testemComponent.getTestemOptions();
