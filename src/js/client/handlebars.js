// A client-side module that provides various template handling capabilities, and which wires in any
// child components with the grade `gpii.templates.hb.helper` as handlebars helpers.
//
// Requires Handlebars.js and Pagedown (for markdown rendering)

/* global fluid, jQuery, Handlebars */
(function ($) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.templates.hb.client");

    gpii.templates.hb.client.addHelper = function (that, component) {
        var key = component.getHelperName();
        if (component.getHelper) {
            that.helpers[key] = component.getHelper();
        }
        else {
            fluid.log("Can't register helper '" + key + "' because it doesn't have a getHelper() invoker.");
        }
    };

    gpii.templates.hb.client.init = function(that) {
        if (Handlebars) {
            Object.keys(that.helpers).forEach(function(key){
                Handlebars.registerHelper(key, that.helpers[key]);
            });
        }
        else {
            fluid.fail("Handlebars is not available, so we cannot wire in our helpers.");
        }
    };

    gpii.templates.hb.client.render = function (that, key, context) {
        // TODO:  Convert to "that-ism" where we use locate() instead of $(selector)
        // If a template exists, load that.  Otherwise, try to load the partial.
        var element = $("#partial-" + key).length ? $("#partial-" + key) : $("#template-" + key);

        // Cache each compiled template the first time we use it...
        if (that.compiled[key]) {
            return that.compiled[key](context);
        }
        else {
            if (!element || !element.html()) {
                fluid.log("Template '" + key + "' does not have any content. Skipping");
                return;
            }

            var template = Handlebars.compile(element.html());
            that.compiled[key] = template;
            return template(context);
        }
    };

    gpii.templates.hb.client.passthrough = function (that, element, key, context, manipulator) {
        // TODO: Confirm whether that.function syntax works here
        element[manipulator](gpii.templates.hb.client.render(that, key, context));
    };

    ["after", "append", "before", "prepend", "replaceWith", "html"].forEach(function (manipulator) {
        // TODO: Confirm whether that.function syntax works here
        gpii.templates.hb.client[manipulator] = function (that, element, key, context) {
            gpii.templates.hb.client.passthrough(that, element, key, context, manipulator);
        };
    });

    gpii.templates.hb.client.appendToBody = function (that, data) {
        // TODO:  Replace this with a {that} reference?
        $("body").append(data);

        // TODO: Confirm whether that.function syntax works here
        gpii.templates.hb.client.loadPartials();

        // Fire a "templates loaded" event so that components can wait for their markup to appear.
        that.events.templatesLoaded.fire();
    };

    gpii.templates.hb.client.loadPartials  = function () {
        // load all partials so that we can use them in context
        $("[id^=partial-]").each(function (index, element) {
            var id = element.id;
            var key = id.substring(id.indexOf("-") + 1);
            Handlebars.registerPartial(key, $("#" + id).html());
        });
    };

    gpii.templates.hb.client.loadTemplates = function (that, callback) {
        var settings = {
            url:     that.options.templateUrl,
            success: that.appendToBody
        };
        if (callback) {
            $.ajax(settings).then(callback);
        }
        else {
            $.ajax(settings);
        }
    };

    fluid.defaults("gpii.templates.hb.client", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],
        components: {
            "md": {
                "type": "gpii.templates.hb.helper.md.client"
            },
            "jsonify": {
                "type": "gpii.templates.hb.helper.jsonify"
            }
        },
        members: {
            helpers:  {},
            compiled: {}
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
            "appendToBody": {
                funcName: "gpii.templates.hb.client.appendToBody",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
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
            "loadPartials": {
                funcName: "gpii.templates.hb.client.loadPartials"
            },
            "loadTemplates": {
                funcName: "gpii.templates.hb.client.loadTemplates",
                args: ["{that}", "{arguments}.0"]
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
        events: {
            "templatesLoaded": null
        },
        listeners: {
            onCreate: [
                {
                    funcName: "gpii.templates.hb.client.init",
                    args: ["{that}", "{arguments}.0"]
                }
            ]

        }
    });
})(jQuery);


