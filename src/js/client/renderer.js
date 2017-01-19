
/*
    A client-side Handlebars renderer.  Requires Handlebars.js and Pagedown (for markdown rendering).

    See the docs for more details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/jsonifyHelper.md

 */
/* global fluid, jQuery, Handlebars */
(function ($) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.handlebars.renderer");

    /**
     *
     * A function which wires a child "helper" component into this component.  This function is distributed to all
     * child components with the `gpii.handlebars.helper` grade.
     *
     * @param that {Object} The renderer component.
     * @param component {Object} The helper component to be wired into the renderer.
     */
    gpii.handlebars.renderer.addHelper = function (that, component) {
        var key = component.options.helperName;
        if (component.getHelper) {
            that.helpers[key] = component.getHelper();
        }
        else {
            fluid.fail("Can't register helper '" + key + "' because it doesn't have a getHelper() invoker.");
        }
    };

    /*

        Register all of the helper components that have added themselves to {that}.helpers with our internal copy of
        Handlebars.

     */
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

    /**
     *
     * Produce HTML output by rendering the named template with the supplied "context" data.
     *
     * @param that {Object} The renderer component itself.
     * @param templateName {String} The name of the template to render (should be a filename, minus extension).
     * @param context {Object} The optional "context" data to pass to the renderer, which will be available via tags like {{variable}}.
     * @returns {String} The output of the rendering process.
     */
    gpii.handlebars.renderer.render = function (that, templateName, context) {
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

    gpii.handlebars.renderer.passthrough = function (that, element, key, context, manipulator) {
        element[manipulator](that.render(key, context));
    };

    ["after", "append", "before", "prepend", "replaceWith", "html"].forEach(function (manipulator) {
        gpii.handlebars.renderer[manipulator] = function (that, element, key, context) {
            gpii.handlebars.renderer.passthrough(that, element, key, context, manipulator);
        };
    });

    /**
     *
     * Our internal handlebars instance needs to be made aware of each of our helpers.
     *
     * @param that {Object} The renderer component itself.
     *
     */
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
            "render": {
                funcName: "gpii.handlebars.renderer.render",
                args: ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
            },
            "replaceWith": {
                funcName: "gpii.handlebars.renderer.replaceWith",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // element, templateName, context
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

    // The "standalone" renderer grade.
    fluid.defaults("gpii.handlebars.renderer.standalone", {
        gradeNames: ["gpii.handlebars.renderer"],
        members: {
            templates: "{that}.options.templates"
        },
        mergePolicy: {
            // Templates contain lots of literal squiggly braces, which we cannot expand
            "templates.layouts":  "noexpand",
            "templates.pages":    "noexpand",
            "templates.partials": "noexpand"
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
            accepts: "application/json",
            success: that.cacheTemplates
        };

        $.ajax(settings);
    };

    // A "server aware" grade that depends on being able to communicate with an instance of
    // `gpii.handlebars.inlineTemplateBundlingMiddleware`.
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
