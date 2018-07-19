/*

  A component to standardize the retrieval of initial data from a REST endpoint, followed by a render cycle, by:

  1.  Retrieving the data once the renderer is ready.
  2.  Rendering the payload when the response is received.

  For more details on the request and response cycle, see the `ajaxCapable` grade.

 */
/* global fluid */
(function (fluid) {
    "use strict";
    fluid.defaults("gpii.handlebars.templateRequestAndRender", {
        gradeNames:    ["gpii.hasRequiredOptions", "gpii.handlebars.ajaxCapable"],
        requiredOptions: {
            templateKeys:           true,
            "templateKeys.error":   true,
            "templateKeys.success": true
        },
        ajaxOptions: {
            success: "{that}.handleSuccessFirst",
            error:   "{that}.handleErrorFirst"
        },
        components: {
            success: {
                type:          "gpii.handlebars.templateMessage",
                createOnEvent: "{renderer}.events.onRequestReceived",
                container:     "{templateRequestAndRender}.dom.success",
                options: {
                    template: "{templateRequestAndRender}.options.templateKeys.success",
                    model:  {
                        message: "{templateRequestAndRender}.successMessage"
                    }
                }
            },
            error: {
                type:          "gpii.handlebars.templateMessage",
                createOnEvent: "{renderer}.events.onRequestReceived",
                container:     "{templateRequestAndRender}.dom.error",
                options: {
                    template: "{templateRequestAndRender}.options.templateKeys.error",
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
                funcName: "gpii.handlebars.templateRequestAndRender.handleSuccessFirst",
                args:     ["{that}"]
            },
            handleErrorFirst: {
                funcName: "gpii.handlebars.templateRequestAndRender.handleErrorFirst",
                args:     ["{that}"]
            }
        },
        templates: {
            error:   "common-error"
        }
    });
})(fluid);
