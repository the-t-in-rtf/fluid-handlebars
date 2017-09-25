/*
    Common includes for all browser tests.
*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
fluid.require("%gpii-webdriver");
gpii.webdriver.loadTestingSupport();

fluid.require("%gpii-handlebars");
require("./lib/fixtures");
require("./lib/helpers");
