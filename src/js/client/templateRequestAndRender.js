/*

  A component to standardize the retrieval of initial data from a REST endpoint, followed by a render cycle, by:

  1.  Retrieving the data once the renderer is ready.
  2.  Rendering the payload when the response is received.

  For more details on the request and response cycle, see the `templateRequestAndUpdate` grade.

 */
/* global fluid, jQuery */
(function () {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.templates.templateRequestAndRender");

    // TODO: Replace this with JSON Schema validation: https://issues.gpii.net/browse/GPII-1176
    gpii.templates.templateRequestAndRender.checkRequirements = function (that) {
        var errors = [];

        if (!that.options.templates || !that.options.templates.success || !that.options.templates.error) {
            errors.push("You have not configured any templates for use with this component.");
        }

        if (errors.length > 0) {
            fluid.fail(errors);
        }
    };

    fluid.defaults("gpii.templates.templateRequestAndRender", {
        gradeNames:    ["gpii.templates.ajaxCapable", "gpii.hasRequiredOptions", "autoInit"],
        requiredOptions: {
            templates:           true,
            "templates.error":   true,
            "templates.success": true
        },
        ajaxOptions: {
            success: "{that}.handleSuccessFirst",
            error:   "{that}.handleErrorFirst"
        },
        components: {
            success: {
                type:          "gpii.templates.templateMessage",
                createOnEvent: "{renderer}.events.onRequestReceived",
                container:     "{templateRequestAndRender}.dom.success",
                options: {
                    template: "{templateRequestAndRender}.options.templates.success",
                    model:  {
                        message: "{templateRequestAndRender}.successMessage"
                    }
                }
            },
            error: {
                type:          "gpii.templates.templateMessage",
                createOnEvent: "{renderer}.events.onRequestReceived",
                container:     "{templateRequestAndRender}.dom.error",
                options: {
                    template: "{templateRequestAndRender}.options.templates.error",
                    model:  {
                        message: "{templateRequestAndRender}.errorMessage"
                    }
                }
            }
        },
        rules: {
            success: {
                "": ""
            },
            error: {
                errorMessage: "message"
            }
        },
        selectors: {
            viewport: "",         // The container that will be updated on success
            error:    ".error"    // The error message controlled by our sub-component
        },
        invokers: {
            handleSuccessFirst: {
                funcName: "gpii.templates.templateRequestAndRender.handleSuccessFirst",
                args:     ["{that}"]
            },
            handleErrorFirst: {
                funcName: "gpii.templates.templateRequestAndRender.handleErrorFirst",
                args:     ["{that}"]
            }
        },
        templates: {
            error:   "common-error"
        }
    });
})(jQuery);