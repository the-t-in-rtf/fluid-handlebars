// A client-side module that provides various template handling capabilities, and which wires in any
// child components with the grade `gpii.handlebars.helper` as handlebars helpers.
//
// For tests and other simple uses, you can directly use the `gpii.handlebars.renderer` grade.  If you are working with
// templates provided by the `inline` router included with this package, you should add
// `gpii.handlebars.serverAware` to `options.gradeNames`.
//
// Requires Handlebars.js and Pagedown (for markdown rendering)

/* global fluid, jQuery, Handlebars */
(function ($) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.handlebars.renderer");

    /** @namespace gpii.handlebars.hb */
    gpii.handlebars.renderer.addHelper = function (that, component) {
        var key = component.options.helperName;
        if (component.getHelper) {
            that.helpers[key] = component.getHelper();
        }
        else {
            fluid.fail("Can't register helper '" + key + "' because it doesn't have a getHelper() invoker.");
        }
    };

    gpii.handlebars.renderer.registerHelpers = function (that) {
        if (Handlebars) {
            fluid.each(that.helpers, function (value, key) {
                Handlebars.registerHelper(key, value);
            });
        }
        else {
            fluid.fail("Handlebars is not available, so we cannot wire in our helpers.");
        }
    };

    gpii.handlebars.renderer.render = function (that, templateName, context) {
        var templateType = that.templates.partials[templateName] ? "partials" : that.templates.pages[templateName] ? "pages" : that.templates.layouts[templateName] ? "layouts" : null;
        if (!templateType) {
            fluid.fail("Can't find template '" + templateName + "'...");
        }

        // TODO:  Cleanly separate the caching responsibility into a new grade.
        // Cache each compiled template the first time we use it...
        if (!that.compiled[templateType][templateName]) {
            var compiledTemplate = Handlebars.compile(that.templates[templateType][templateName]);

            that.compiled[templateType][templateName] = compiledTemplate;
        }

        return that.compiled[templateType][templateName](context);
    };

    gpii.handlebars.renderer.passthrough = function (that, element, key, context, manipulator) {
        element[manipulator](gpii.handlebars.renderer.render(that, key, context));
    };

    ["after", "append", "before", "prepend", "replaceWith", "html"].forEach(function (manipulator) {
        gpii.handlebars.renderer[manipulator] = function (that, element, key, context) {
            gpii.handlebars.renderer.passthrough(that, element, key, context, manipulator);
        };
    });

    gpii.handlebars.renderer.loadPartials  = function (that) {
        fluid.each(that.templates.partials, function (value, key) {
            Handlebars.registerPartial(key, value);
        });
    };

    fluid.defaults("gpii.handlebars.renderer", {
        gradeNames: ["fluid.component"],
        components: {
            "md": {
                "type": "gpii.handlebars.helper.md.client"
            },
            "equals": {
                "type": "gpii.handlebars.helper.equals"
            },
            "jsonify": {
                "type": "gpii.handlebars.helper.jsonify"
            }
        },
        members: {
            helpers:   {},
            templates: {
                layouts:  {},
                pages:    {},
                partials: {}
            },
            compiled:  {
                layouts:  {},
                pages:    {},
                partials: {}
            }
        },
        distributeOptions: [
            {
                record: {
                    "funcName": "gpii.handlebars.renderer.addHelper",
                    "args": ["{gpii.handlebars.renderer}", "{gpii.handlebars.helper}"]
                },
                target: "{that gpii.handlebars.helper}.options.listeners.onCreate"
            }
        ],
        invokers: {
            "after": {
                funcName: "gpii.handlebars.renderer.after",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "append": {
                funcName: "gpii.handlebars.renderer.append",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "before": {
                funcName: "gpii.handlebars.renderer.before",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "html": {
                funcName: "gpii.handlebars.renderer.html",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "prepend": {
                funcName: "gpii.handlebars.renderer.prepend",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "replaceWith": {
                funcName: "gpii.handlebars.renderer.replaceWith",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            }
        },
        listeners: {
            "onCreate.registerHelpers": {
                funcName: "gpii.handlebars.renderer.registerHelpers",
                args:     ["{that}", "{arguments}.0"]
            },
            "onCreate.loadPartials": {
                funcName: "gpii.handlebars.renderer.loadPartials",
                args:     ["{that}"]
            }
        }
    });


    fluid.registerNamespace("gpii.handlebars.renderer.serverAware");
    gpii.handlebars.renderer.serverAware.cacheTemplates = function (that, data) {
        ["layouts", "pages", "partials"].forEach(function (key) {
            if (data.templates[key]) {
                that.templates[key] = data.templates[key];
            }
        });

        gpii.handlebars.renderer.loadPartials(that);

        // Fire a "templates loaded" event so that components can wait for their markup to appear.
        that.events.onTemplatesLoaded.fire(that);
    };

    gpii.handlebars.renderer.serverAware.retrieveTemplates = function (that) {
        var settings = {
            url:     that.options.templateUrl,
            success: that.cacheTemplates
        };

        $.ajax(settings);
    };

    fluid.defaults("gpii.handlebars.renderer.serverAware", {
        gradeNames: ["gpii.handlebars.renderer"],
        templateUrl: "/hbs",
        invokers: {
            "cacheTemplates": {
                funcName: "gpii.handlebars.renderer.serverAware.cacheTemplates",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            "retrieveTemplates": {
                funcName: "gpii.handlebars.renderer.serverAware.retrieveTemplates",
                args: ["{that}", "{arguments}.0"]
            }
        },
        events: {
            "onTemplatesLoaded": null
        },
        listeners: {
            "onCreate.loadTemplates": {
                func: "{that}.retrieveTemplates"
            }
        }
    });
})(jQuery);


