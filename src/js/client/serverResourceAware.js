/*

    A grade that loads all required templates and message bundles, then creates a client-side renderer.

    For an example of using this in depth, check out the provided `templateFormControl` grade or the client side tests.

 */
/* eslint-env browser */
(function (fluid) {
    "use strict";

    fluid.defaults("gpii.handlebars.serverResourceAware", {
        gradeNames: ["fluid.resourceLoader", "fluid.modelComponent"],
        events: {
            onRendererAvailable: null
        },
        resources: {
            messages: {
                url: "/messages",
                dataType: "json"
            },
            templates: {
                url: "/templates",
                dataType: "json"
            }
        },
        model: {
            // TODO: Review after it's possible to drill deeper into "parsed" material.
            messages: "{that}.resources.messages.parsed",
            templates: "{that}.resources.templates.parsed"
        },
        components: {
            renderer: {
                type: "gpii.handlebars.renderer",
                createOnEvent: "{gpii.handlebars.serverResourceAware}.events.onResourcesLoaded",
                options: {
                    model: {
                        messages:  "{gpii.handlebars.serverResourceAware}.model.messages",
                        templates: "{gpii.handlebars.serverResourceAware}.model.templates"
                    },
                    listeners: {
                        "onCreate.notifyParent": {
                            func: "{gpii.handlebars.serverResourceAware}.events.onRendererAvailable.fire"
                        }
                    }
                }
            }
        }
    });
})(fluid);
