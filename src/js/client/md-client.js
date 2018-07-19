// A client-side module that provides the ability to parse markdown in handlebars.
// This is intended to be added as a child component of a grade that wires in helpers, such as `gpii.handlebars.renderer`
//
/* global fluid */
/* eslint-env browser */
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.handlebars.helper.md.client");

    gpii.handlebars.helper.md.client.initConverter = function (that) {
        that.renderer = window.markdownit(that.options.markdownItOptions);
        that.events.rendererAvailable.fire();
    };

    fluid.defaults("gpii.handlebars.helper.md.client", {
        gradeNames: ["gpii.handlebars.helper.md"],
        listeners: {
            onCreate: [
                {
                    funcName: "gpii.handlebars.helper.md.client.initConverter",
                    args:     ["{that}"]
                }
            ]
        }
    });
})(fluid);
