// Server-side wrapper to add a markdown parsing helper.
//
// This is designed to be included as a child component of `gpii.express.hb`
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.helper.md.server");

var MarkDownIt = require("markdown-it");

gpii.handlebars.helper.md.server.initConverter = function (that) {
    that.renderer = new MarkDownIt(that.options.markdownItOptions);
    that.events.rendererAvailable.fire();
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
