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
fluid.registerNamespace("gpii.templates.hb.helper.jsonify");

gpii.templates.hb.helper.jsonify.getJsonifyFunction = function () {
    return function (context) {
        try {
            return JSON.stringify(context, null, 2);
        }
        catch (e) {
            fluid.log("Can't convert JSON object to string: " + e);
            return context;
        }
    };
};

gpii.templates.hb.helper.jsonify.getHelperName = function(that) {
    return that.name;
};

fluid.defaults("gpii.templates.hb.helper.jsonify", {
    gradeNames: ["gpii.templates.hb.helper", "autoInit"],
    members: {
        name: "jsonify"
    },
    invokers: {
        "getHelper": {
            "funcName": "gpii.templates.hb.helper.jsonify.getJsonifyFunction",
            "args":     ["{that}"]
        },
        "getHelperName": {
            "funcName": "gpii.templates.hb.helper.jsonify.getHelperName",
            "args":     ["{that}"]
        }
    }
});
