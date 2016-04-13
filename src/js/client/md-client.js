// A client-side module that provides the ability to parse markdown in handlebars.
// This is intended to be added as a child component of a grade that wires in helpers, such as `gpii.handlebars.renderer`
//
// Requires Pagedown (for markdown rendering)
/* global fluid, jQuery, Markdown */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.handlebars.helper.md.client");

    gpii.handlebars.helper.md.client.initConverter = function (that) {
        if (Markdown && Markdown.getSanitizingConverter) {
            that.converter = Markdown.getSanitizingConverter();
            that.events.converterAvailable.fire();
        }
        else {
            fluid.fail("Pagedown or one of its dependencies is not available, so markdown will be passed on without any changes.");
        }
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
})(jQuery);


