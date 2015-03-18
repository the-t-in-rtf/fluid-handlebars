// A base gradeName that provides a markdown-parsing helper for handlebars.
//
// NOTE:  This grade should not be used directly, you should add either the server or client appropriate gradeName to the appropriate list of components.
//
//  For your convenience, here are those grade names:
//  _server_: `gpii.templates.hb.helper.md.server`
//  _client_: `gpii.templates.hb.helper.md.client`

"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.templates.hb.helper.md");

gpii.templates.hb.helper.md.getMdFunction = function (that) {
    return function (context) {
        if (!context) {
            fluid.log("No context was provided, ignoring markdown helper call.");
        }
        else if (that && that.options && that.converter) {
            return that.converter.makeHtml(context);
        }
        else {
            fluid.log("Can't convert markdown content because the converter could not be found.");
        }

        // If we can't evolve the output, we just pass it through.
        return context;
    };
};

gpii.templates.hb.helper.md.configureConverter = function (that) {
    if (that.converter) {
        // Double all single carriage returns so that they result in new paragraphs, at least for now
        that.converter.hooks.chain("preConversion", function (text) { return text.replace(/[\r\n]+/g, "\n\n"); });
    }
    else {
        fluid.log("Could not initialize pagedown converter.  Markdown content will not be parsed.");
    }
};

gpii.templates.hb.helper.md.getHelperName = function(that) {
    return that.name;
};

fluid.defaults("gpii.templates.hb.helper.md", {
    gradeNames: ["gpii.templates.hb.helper", "autoInit"],
    members: {
        converter: null,
        name:      "md"
    },
    invokers: {
        "getHelper": {
            "funcName": "gpii.templates.hb.helper.md.getMdFunction",
            "args":     ["{that}"]
        },
        "getHelperName": {
            "funcName": "gpii.templates.hb.helper.md.getHelperName",
            "args":     ["{that}"]
        }
    },
    events: {
        "converterAvailable": null
    },
    listeners: {
        "converterAvailable": {
            funcName: "gpii.templates.hb.helper.md.configureConverter",
            args:     ["{that}"]
        }
    }
});
