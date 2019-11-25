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
          "{that}.options.templateKey",
          "{that}.model",
          "appendTo"
        ]
      }

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
            messages: "{that}.resources.messages.parsed",
            templates: "{that}.resources.templates.parsed.templates"
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
