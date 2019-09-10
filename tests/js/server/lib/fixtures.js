/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.defaults("gpii.test.handlebars.environment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port: 6984,
    path: "",
    url: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/%path", { port: "{that}.options.port", path: "{that}.options.path"}]
        }
    },
    components: {
        express: {
            type: "gpii.test.handlebars.harness"
        }
    }
});
