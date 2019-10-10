
/*
    A client-side Handlebars renderer.  Requires Handlebars.js and Pagedown (for markdown rendering).

    See the docs for more details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/jsonifyHelper.md

 */
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.handlebars.renderer");

    gpii.handlebars.renderer.passthrough = function (that, element, key, context, manipulator) {
        element[manipulator](that.render(key, context));
    };

    ["after", "append", "before", "prepend", "replaceWith", "html"].forEach(function (manipulator) {
        gpii.handlebars.renderer[manipulator] = function (that, element, key, context) {
            gpii.handlebars.renderer.passthrough(that, element, key, context, manipulator);
        };
    });

    fluid.defaults("gpii.handlebars.renderer", {
        gradeNames: ["gpii.handlebars.renderer.common"],
        model: {
            templates: {},
            messages: {}
        },
        components: {
            "md": {
                "type": "gpii.handlebars.helper.md.client"
            },
            messageHelper: {
                type: "gpii.handlebars.helper.messageHelper.client",
                options: {
                    model: {
                        messages: "{gpii.handlebars.renderer.common}.model.messages"
                    }
                }
            }
        },
        invokers: {
            "after": {
                funcName: "gpii.handlebars.renderer.after",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "append": {
                funcName: "gpii.handlebars.renderer.append",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "before": {
                funcName: "gpii.handlebars.renderer.before",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "html": {
                funcName: "gpii.handlebars.renderer.html",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "prepend": {
                funcName: "gpii.handlebars.renderer.prepend",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            },
            "replaceWith": {
                funcName: "gpii.handlebars.renderer.replaceWith",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
            }
        }
    });
})(fluid);
