// A client-side module that provides various template handling capabilities, and which wires in any
// child components with the grade `gpii.templates.hb.helper` as handlebars helpers.
//
// For tests and other simple uses, you can directly use the `gpii.template.hb.client` grade.  If you are working with
// templates provided by the `inline` router included with this package, you should add
// `gpii.template.hb.client.serverAware` to `options.gradeNames`.
//
// Requires Handlebars.js and Pagedown (for markdown rendering)

/* global fluid, jQuery, Handlebars */
(function ($) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.templates.hb.client");

    /** @namespace gpii.templates.hb */
    gpii.templates.hb.client.addHelper = function (that, component) {
        var key = component.options.helperName;
        if (component.getHelper) {
            that.helpers[key] = component.getHelper();
        }
        else {
            fluid.fail("Can't register helper '" + key + "' because it doesn't have a getHelper() invoker.");
        }
    };

    gpii.templates.hb.client.registerHelpers = function (that) {
        if (Handlebars) {
            Object.keys(that.helpers).forEach(function (key) {
                Handlebars.registerHelper(key, that.helpers[key]);
            });
        }
        else {
            fluid.fail("Handlebars is not available, so we cannot wire in our helpers.");
        }
    };

    gpii.templates.hb.client.render = function (that, templateName, context) {
        var templateType = that.templates.partials[templateName] ? "partials" : that.templates.pages[templateName] ? "pages" : that.templates.layouts[templateName] ? "layouts" : null;
        if (!templateType) {
            fluid.fail("Can't find template '" + templateName + "'...");
        }

        // Cache each compiled template the first time we use it...
        if (!that.compiled[templateType][templateName]) {
            var compiledTemplate = Handlebars.compile(that.templates[templateType][templateName]);

            that.compiled[templateType][templateName] = compiledTemplate;
        }

        return that.compiled[templateType][templateName](context);
    };

    gpii.templates.hb.client.passthrough = function (that, element, key, context, manipulator) {
        element[manipulator](gpii.templates.hb.client.render(that, key, context));
    };

    ["after", "append", "before", "prepend", "replaceWith", "html"].forEach(function (manipulator) {
        gpii.templates.hb.client[manipulator] = function (that, element, key, context) {
            gpii.templates.hb.client.passthrough(that, element, key, context, manipulator);
        };
    });

    gpii.templates.hb.client.loadPartials  = function (that) {
        Object.keys(that.templates.partials).forEach(function (key) {
            Handlebars.registerPartial(key, that.templates.partials[key]);
        });
    };

    fluid.defaults("gpii.templates.hb.client", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        components: {
            "md": {
                "type": "gpii.templates.hb.helper.md.client"
            },
            "equals": {
                "type": "gpii.templates.hb.helper.equals"
            },
            "jsonify": {
                "type": "gpii.templates.hb.helper.jsonify"
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
                    "funcName": "gpii.templates.hb.client.addHelper",
                    "args": ["{gpii.templates.hb.client}", "{gpii.templates.hb.helper}"]
                },
                target: "{that > gpii.templates.hb.helper}.options.listeners.onCreate"
            }
        ],
        templateUrl: "/hbs",
        invokers: {
            "after": {
                funcName: "gpii.templates.hb.client.after",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "append": {
                funcName: "gpii.templates.hb.client.append",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "before": {
                funcName: "gpii.templates.hb.client.before",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "body": {
                funcName: "gpii.templates.hb.client.body",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "html": {
                funcName: "gpii.templates.hb.client.html",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "prepend": {
                funcName: "gpii.templates.hb.client.prepend",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            },
            "replaceWith": {
                funcName: "gpii.templates.hb.client.replaceWith",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            }
        },
        listeners: {
            "onCreate.registerHelpers": {
                funcName: "gpii.templates.hb.client.registerHelpers",
                args:     ["{that}", "{arguments}.0"]
            },
            "onCreate.loadPartials": {
                funcName: "gpii.templates.hb.client.loadPartials",
                args:     ["{that}"]
            }
        }
    });


    fluid.registerNamespace("gpii.templates.hb.client.serverAware");
    gpii.templates.hb.client.serverAware.cacheTemplates = function (that, data) {
        ["layout", "pages", "partials"].forEach(function (key) {
            if (data.templates[key]) {
                that.templates[key] = data.templates[key];
            }
        });

        gpii.templates.hb.client.loadPartials(that);

        // Fire a "templates loaded" event so that components can wait for their markup to appear.
        that.events.onTemplatesLoaded.fire(that);
    };

    gpii.templates.hb.client.serverAware.retrieveTemplates = function (that) {
        var settings = {
            url:     that.options.templateUrl,
            success: that.cacheTemplates
        };

        $.ajax(settings);
    };

    fluid.defaults("gpii.templates.hb.client.serverAware", {
        gradeNames: ["gpii.templates.hb.client", "autoInit"],
        templateUrl: "/hbs",
        invokers: {
            "cacheTemplates": {
                funcName: "gpii.templates.hb.client.serverAware.cacheTemplates",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            "retrieveTemplates": {
                funcName: "gpii.templates.hb.client.serverAware.retrieveTemplates",
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


