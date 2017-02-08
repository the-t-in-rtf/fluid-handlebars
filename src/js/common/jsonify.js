/*

    A handlebars helper to allow us to safely output object content from within a template.  See the docs for details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/jsonifyHelper.md

 */
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.helper.jsonify");

gpii.handlebars.helper.jsonify.getJsonifyFunction = function (that) {
    return function (contentToStringify, options) {
        if (contentToStringify) {
            var combinedOptions = fluid.copy(that.options);
            if (options && options.hash) {
                fluid.each(options.hash, function (value, key) {
                    combinedOptions[key] = value;
                });
            }

            if (typeof contentToStringify !== "string" || combinedOptions.stringifyStrings) {
                try {
                    return JSON.stringify(contentToStringify, combinedOptions.replacer, combinedOptions.space);
                }
                catch (e) {
                    fluid.fail("Can't convert JSON object to string: " + e);
                }
            }
        }

        return contentToStringify;
    };
};

fluid.defaults("gpii.handlebars.helper.jsonify", {
    gradeNames: ["gpii.handlebars.helper"],
    helperName: "jsonify",
    replacer: null,
    stringifyStrings: false,
    space:    2,
    invokers: {
        "getHelper": {
            "funcName": "gpii.handlebars.helper.jsonify.getJsonifyFunction",
            "args":     ["{that}"]
        }
    }
});
