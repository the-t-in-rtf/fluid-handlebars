// Launch the test harness as a standalone server to assist in browser debugging.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");

require("./test-harness");

gpii.test.handlebars.client.harness({
    "expressPort" :   6904,
    "baseUrl":        "http://localhost:6904/"
});
