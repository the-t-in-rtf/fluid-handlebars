// Server-side wrapper to add a markdown parsing helper.
//
// This is designed to be included as a child component of `fluid.express.hb`
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.registerNamespace("fluid.handlebars.helper.md.server");

var MarkDownIt = require("markdown-it");

fluid.handlebars.helper.md.server.initConverter = function (that) {
    that.renderer = new MarkDownIt(that.options.markdownItOptions);
    that.events.rendererAvailable.fire();
};

fluid.defaults("fluid.handlebars.helper.md.server", {
    gradeNames: ["fluid.handlebars.helper.md"],
    listeners: {
        onCreate: [
            {
                funcName: "fluid.handlebars.helper.md.server.initConverter",
                args:     ["{that}"]
            }
        ]

    }
});
