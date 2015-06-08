/*

  A base grade for components that make use of the Handlebars client to render their content.  To use this in a
  component, you will need to:

  1. Replace the `renderMarkup` invoker with your own implementation, that should replace selected view content using
     the `templates` component.

  2. Pass in a `templateUrl` option that points to a REST interface from which the template content can be retrieved.
     See the `inline` server-side component for an example of the output required.

  For an example of using this in depth, check out the provided `templateFormControl` grade or the client side tests.
 */
/* global fluid, jQuery */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.templates.hb.client.templateAware");

    gpii.templates.hb.client.templateAware.checkRequirements = function (that) {
        if (!that.options.templateUrl) {
            fluid.fail("You must supply a template URL in order to use this component.");
        }
    };

    // When overriding this, you should fire an `onMarkupRendered` event to ensure that bindings can be applied.
    gpii.templates.hb.client.templateAware.renderMarkup = function () {
        fluid.fail("You are expected to implement a renderMarkup invoker when implementing a templateAware component");
    };

    fluid.defaults("gpii.templates.hb.client.templateAware", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        templateUrl: "/hbs",
        components: {
            renderer: {
                type: "gpii.templates.hb.client",
                options: {
                    templateUrl: "{templateAware}.options.templateUrl",
                    listeners: {
                        "onTemplatesLoaded.renderMarkup": {
                            func: "{templateAware}.renderMarkup"
                        }
                    }
                }
            }
        },
        events: {
            refresh: null,
            onMarkupRendered: null
        },
        listeners: {
            "onCreate.checkRequirements": {
                funcName: "gpii.templates.hb.client.templateAware.checkRequirements",
                args:     ["{that}"]
            },
            "refresh.renderMarkup": {
                func: "{that}.renderMarkup"
            },
            "onMarkupRendered.applyBinding": {
                funcName: "gpii.templates.binder.applyBinding",
                args:     ["{that}"]
            }
        }
    });
})(jQuery);