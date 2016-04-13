/*

  A base grade for components that make use of the Handlebars client to render their content.  To use this in a
  component, you will need to:

  1. Pass in a `templateUrl` option that points to a REST interface from which the template content can be retrieved.
     See the `inline` server-side component for an example of the output required.

  2. Replace the `renderInitialMarkup` invoker with your own implementation, that should replace selected view content
     using the `templates` component.  Replace this with an empty function if you want to disable the initial render
     once template content is loaded.

     This grade provides a convenience invoker that you can use when defining your `renderMarkup` controller, as in:

     renderInitialMarkup: {
        func: "{that}.renderMarkup",
        args: [
          "{that}",
          "{that}.options.selectors.selector",
          "{that}.options.templates.templates",
          "{that}.model",
          "appendTo"
        ]
      }

  For an example of using this in depth, check out the provided `templateFormControl` grade or the client side tests.
 */
/* global fluid, jQuery */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.handlebars.templateAware");

    // A convenience function that can be used to more easily define `renderInitialMarkup` invokers (see example above).
    gpii.handlebars.templateAware.renderMarkup = function (that, renderer, selector, template, data, manipulator) {
        manipulator = manipulator ? manipulator : "html";
        var element = that.locate(selector);
        if (renderer) {
            renderer[manipulator](element, template, data);
            that.events.onMarkupRendered.fire(that);
        }
        else {
            fluid.fail("I cannot render content without a renderer.");
        }
    };

    // When overriding this, you should fire an `onMarkupRendered` event to ensure that bindings can be applied.
    gpii.handlebars.templateAware.noRenderFunctionDefined = function () {
        fluid.fail("You are expected to define a renderInitialMarkup invoker when implementing a templateAware component.");
    };

    gpii.handlebars.templateAware.refreshDom = function (that) {
        // Adapted from: https://github.com/fluid-project/infusion/blob/master/src/framework/preferences/js/Panels.js#L147
        var userJQuery = that.container.constructor;
        that.container = userJQuery(that.container.selector, that.container.context);
        fluid.initDomBinder(that, that.options.selectors);
        that.events.onDomBind.fire(that);
    };

    fluid.defaults("gpii.handlebars.templateAware", {
        gradeNames: ["gpii.hasRequiredOptions", "fluid.viewComponent"],
        requiredOptions: {
            templates:           true,
            "templates.initial": true,
            "templates.error":   true,
            "templates.success": true
        },
        events: {
            refresh: null,
            onMarkupRendered: null,
            onDomBind: null
        },
        listeners: {
            "refresh.renderMarkup": {
                func: "{that}.renderInitialMarkup"
            },
            "onDomBind.applyBinding": {
                funcName: "gpii.binder.applyBinding",
                args:     ["{that}"]
            },
            "onMarkupRendered.refreshDom": {
                funcName: "gpii.handlebars.templateAware.refreshDom",
                args:     ["{that}"]
            }
        },
        invokers: {
            // TODO: Use `fluid.notImplemented` once it's available: https://issues.fluidproject.org/browse/FLUID-5733
            // TODO: Review with Antranig, for whatever reason I cannot override this successfully in child grades.
            //renderInitialMarkup: {
            //    funcName: "gpii.handlebars.templateAware.noRenderFunctionDefined"
            //},
            renderMarkup: {
                funcName: "gpii.handlebars.templateAware.renderMarkup",
                args:     ["{that}", "{renderer}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            }
        }
    });

    // A convenience grade which configured a `templateAware` component to render on startup.
    fluid.defaults("gpii.handlebars.templateAware.bornReady", {
        listeners: {
            "onCreate.renderMarkup": {
                func: "{that}.renderInitialMarkup"
            }
        }
    });

    fluid.defaults("gpii.handlebars.templateAware.serverAware", {
        gradeNames: ["gpii.handlebars.templateAware"],
        components: {
            renderer: {
                type: "gpii.handlebars.renderer.serverAware",
                options: {
                    listeners: {
                        "onTemplatesLoaded.renderMarkup": {
                            func: "{gpii.handlebars.templateAware.serverAware}.renderInitialMarkup"
                        }
                    }
                }
            }
        }
    });
})(jQuery);