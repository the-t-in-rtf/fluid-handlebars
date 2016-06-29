/*

    A helper component that adds additional block helpers to a `gpii.express.hb` instance.  See the docs for details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/helper.md

 */
/* eslint-env node */
"use strict";
// Base gradeName for handlebars "helper" modules, which can be used on both the client and server side handlebars stacks.
var fluid = fluid || require("infusion");
fluid.registerNamespace("gpii.handlebars.helper");



fluid.defaults("gpii.handlebars.helper", {
    gradeNames: ["fluid.modelComponent", "gpii.hasRequiredOptions"],
    requiredOptions: {
        helperName: true
    },
    invokers: {
        getHelper: {
            funcName: "fluid.fail",
            args:     ["You must implement getHelper in your grade before it will function properly as a helper."]
        }
    }
});
