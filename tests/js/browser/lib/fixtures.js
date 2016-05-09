/*

    The test fixtures used for browser testing.

 */
"use strict";
var fluid = require("infusion");

require("../../test-harness");

// A standard express + Browser environment from the `gpii-test-browser` package, with our harness options wired
// into the standard express component.
//
fluid.defaults("gpii.test.handlebars.browser.environment", {
    gradeNames: ["gpii.test.browser.environment.withExpress"],
    port: 6984,
    path: "",
    components: {
        express: {
            type: "gpii.test.handlebars.client.harness"
        }
    }
});