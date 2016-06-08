/*
    Common includes for all browser tests.
*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
require("gpii-test-browser");
gpii.test.browser.loadTestingSupport();

require("../../../index");
require("./lib/fixtures");
require("./lib/helpers");
