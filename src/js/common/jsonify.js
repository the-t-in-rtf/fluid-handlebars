// Handlebars helper to allow us to output JSON structures as part of rendered content.
//
// This can be accessed in your markup using syntax like:
//
// `{{{jsonify VARIABLE}}}`
//
// The triple braces are advisable to avoid escaping ampersands.
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.helper.jsonify");

gpii.handlebars.helper.jsonify.getJsonifyFunction = function () {
    return function (context) {
        if (context) {
            try {
                return JSON.stringify(context, null, 2);
            }
            catch (e) {
                fluid.fail("Can't convert JSON object to string: " + e);
            }
        }

        return context;
    };
};

fluid.defaults("gpii.handlebars.helper.jsonify", {
    gradeNames: ["gpii.handlebars.helper"],
    helperName: "jsonify",
    invokers: {
        "getHelper": {
            "funcName": "gpii.handlebars.helper.jsonify.getJsonifyFunction",
            "args":     ["{that}"]
        }
    }
});
