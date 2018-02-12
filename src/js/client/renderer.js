
/*
    A client-side Handlebars renderer.  Requires Handlebars.js and Pagedown (for markdown rendering).

    See the docs for more details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/jsonifyHelper.md

 */
/* global fluid, jQuery, Handlebars */
(function (fluid, $, Handlebars) {
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
     * @return {String} The output of the rendering process.
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

        // Combine the passed context with any component material that needs to be accessed from within a template or helper, such as message bundles.
        var componentContext = fluid.model.transformWithRules(that, that.options.rules.componentToRendererContext, {});
        var combinedContext = fluid.merge({}, componentContext, context);
        return that.compiled[templateType][templateName](combinedContext);
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
            },
            "messageHelper": {
                "type": "gpii.handlebars.helper.messageHelper"
            }
        },
        members: {
            helpers:   {},
            messages: {},
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
        mergePolicy: {
            "rules.componentToRendererContext": "nomerge"
        },
        rules: {
            componentToRendererContext: {}
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
        messages: {},
        members: {
            templates: "{that}.options.templates",
            messages: "{that}.options.messages"
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

    gpii.handlebars.renderer.serverAware.retrieveResource = function (url, callback) {
        var settings = {
            url:     url,
            accepts: "application/json",
            success: callback
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
            }
        },
        events: {
            "onTemplatesLoaded": null
        },
        listeners: {
            "onCreate.loadTemplates": {
                funcName: "gpii.handlebars.renderer.serverAware.retrieveResource",
                args: ["{that}.options.templateUrl", "{that}.cacheTemplates"] // url, callback
            }
        }
    });

    fluid.registerNamespace("gpii.handlebars.renderer.serverMessageAware");
    gpii.handlebars.renderer.serverMessageAware.cacheMessages = function (that, data) {
        that.messages = data;

        // Fire a "messages loaded" event so that components can render once they are available.
        that.events.onMessagesLoaded.fire(that);
    };

    fluid.defaults("gpii.handlebars.renderer.serverMessageAware", {
        gradeNames: ["gpii.handlebars.renderer.serverAware"],
        messageUrl: "/messages",
        invokers: {
            "cacheMessages": {
                funcName: "gpii.handlebars.renderer.serverMessageAware.cacheMessages",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            }
        },
        rules: {
            componentToRendererContext: {
                "messages": "messages"
            }
        },
        events: {
            "onMessagesLoaded": null,
            "onAllResourcesLoaded": {
                events: {
                    onMessagesLoaded: "onMessagesLoaded",
                    onTemplatesLoaded: "onTemplatesLoaded"
                }
            }
        },
        listeners: {
            "onCreate.loadMessages": {
                funcName: "gpii.handlebars.renderer.serverAware.retrieveResource",
                args: ["{that}.options.messageUrl", "{that}.cacheMessages"] // url, callback
            }
        }
    });
})(fluid, jQuery, Handlebars);
