// Server-side wrapper to add a markdown parsing helper.
//
// This is designed to be included as a child component of `gpii.express.hb`
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.helper.md.server");

var pagedown = require("pagedown");

gpii.handlebars.helper.md.server.initConverter = function (that) {
    var converter = pagedown.getSanitizingConverter();
    that.converter = converter;
    that.events.converterAvailable.fire();
};

fluid.defaults("gpii.handlebars.helper.md.server", {
    gradeNames: ["gpii.handlebars.helper.md"],
    listeners: {
        onCreate: [
            {
                funcName: "gpii.handlebars.helper.md.server.initConverter",
                args:     ["{that}"]
            }
        ]

    }
});
