/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-testem");
fluid.require("%fluid-handlebars");

require("./js/test-harness");

fluid.defaults("fluid.test.handlebars.coverageServer", {
    gradeNames: ["fluid.testem.coverage.express", "fluid.test.handlebars.harness.base"]
});

var testemComponent = fluid.testem.instrumentation({
    reportsDir: "reports",
    coverageDir: "coverage",
    testPages:   [
        "tests/browser-fixtures/all-tests.html"
    ],
    sourceDirs: {
        src: "%fluid-handlebars/src"
    },
    contentDirs: {
        "tests": "%fluid-handlebars/tests",
        "node_modules": "%fluid-handlebars/node_modules"
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
            type: "fluid.test.handlebars.coverageServer",
            options: {
                templateDirs: "{fluid.testem.instrumentation}.options.templateDirs",
                messageDirs:  "{fluid.testem.instrumentation}.options.messageDirs"
            }
        }
    }
});

module.exports = testemComponent.getTestemOptions();
