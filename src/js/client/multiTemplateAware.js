/*

  A base grade for a templateAware component that contains other templateAware components.  This grade's sole job is to
  ensure that a complex panel uses a single template renderer instance.

  For an example of using this in depth, check out the provided `templateFormControl` grade or the client side tests.

 */
/* global fluid, jQuery */
(function () {
    "use strict";
    fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.templates.hb.client.multiTemplateAware.singularRenderer");
    fluid.defaults("gpii.templates.hb.client.multiTemplateAware.singularRenderer", {
        components: {
            renderer: {
                type: "gpii.templates.hb.client",
                options: {
                    templateUrl: "{templateAware}.options.templateUrl",
                    listeners: {
                        "onTemplatesLoaded.renderMarkup": {
                            func: "{templateAware}.renderInitialMarkup"
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.templates.hb.client.multiTemplateAware", {
        gradeNames: ["gpii.templates.hb.client.templateAware", "autoInit"],
        distributeOptions: [
            {
                // Any child components of this one should use our renderer.
                record: "gpii.templates.hb.client.multiTemplateAware.singularRenderer",
                target: "{that templateAware}.options.gradeNames"
            }
        ]
    });
})(jQuery);