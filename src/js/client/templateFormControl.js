/*

  A component to standardize handling of "simple" form data submitted via AJAX.  This component:

  1.  Performs an initial render of the component using the template specified in `options.templates.initial`
  2.  Binds a form submission that sends the `model` data formatted using `options.rules.request` using the options
      specified in `options.ajax`

  For more details on the request and response cycle, see the `templateRequestAndUpdate` grade.

 */
/* global fluid, jQuery */
(function ($) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.templates.hb.client.templateFormControl");


    // TODO: Replace this with JSON Schema validation: https://issues.gpii.net/browse/GPII-1176
    gpii.templates.hb.client.templateFormControl.checkRequirements = function (that) {
        var errors = [];

        if (!that.options.templates || !that.options.templates.initial || !that.options.templates.error || !that.options.templates.success) {
            errors.push("You have not configured any templates for use with this component.");
        }

        if (errors.length > 0) {
            fluid.fail(errors);
        }
    };

    gpii.templates.hb.client.templateFormControl.submitForm = function (that, event) {
        // We are handling this event and should prevent any further handling.
        if (event) { event.preventDefault(); }

        // Let the `ajaxCapable` grade handle the request and response.
        that.makeRequest();
    };

    gpii.templates.hb.client.templateFormControl.handleKeyPress = function (that, event) {
        if (event.keyCode === 13) { // Enter
            gpii.templates.hb.client.submitForm(that, event);
        }
    };

    fluid.defaults("gpii.templates.hb.client.templateFormControl", {
        gradeNames:    ["gpii.templates.hb.client.templateAware.serverAware", "gpii.template.hb.client.ajaxCapable", "autoInit"],
        hideOnSuccess: true, // Whether to hide our form if the results are successful
        components: {
            success: {
                type:     "gpii.templates.hb.client.templateMessage",
                createOnEvent: "{templateFormControl}.events.onMarkupRendered",
                container: "{templateFormControl}.dom.success",
                options: {
                    template: "{templateFormControl}.options.templates.success",
                    model:  {
                        message: "{templateFormControl}.successMessage"
                    }
                }
            },
            error: {
                type:          "gpii.templates.hb.client.templateMessage",
                createOnEvent: "{templateFormControl}.events.onMarkupRendered",
                container:     "{templateFormControl}.dom.error",
                options: {
                    template: "{templateFormControl}.options.templates.error",
                    model:  {
                        message: "{templateFormControl}.errorMessage"
                    }
                }
            }
        },
        // You are expected to add any data from the response you care about to the success and error rules.
        rules: {
            success: {
                successMessage: "message"
            },
            error: {
                errorMessage: "message"
            }
        },
        selectors: {
            initial: "",         // The container that will be updated with template content on startup and on a full refresh.
            form:    "form",     // The form element whose submission we will control
            error:   ".error",   // The error message controlled by our sub-component
            success: ".success", // The positive feedback controlled by our sub-component
            submit:  ".submit"   // Clicking or hitting enter on our submit button will launch our AJAX request
        },
        invokers: {
            renderInitialMarkup: {
                funcName: "gpii.templates.hb.client.templateAware.renderMarkup",
                args:     ["{that}", "initial", "{that}.options.templates.initial", "{that}.model", "html"]
            },
            submitForm: {
                funcName: "gpii.templates.hb.client.templateFormControl.submitForm",
                args:     ["{that}", "{arguments}.0"]
            },
            handleKeyPress: {
                funcName: "gpii.templates.hb.client.templateFormControl.handleKeyPress",
                args:     ["{that}", "{arguments}.0"]
            }
        },
        templates: {
            success: "common-success",
            error:   "common-error"
        },
        listeners: {
            "onMarkupRendered.wireControls": [
                {
                    "this": "{that}.dom.submit",
                    method: "on",
                    args:   ["keyup.handleKeyPress", "{that}.handleKeyPress"]
                },
                {
                    "this": "{that}.dom.submit",
                    method: "on",
                    args:   ["click.submitForm", "{that}.submitForm"]
                },
                {
                    "this": "{that}.dom.form",
                    method: "on",
                    args:   ["submit.submitForm", "{that}.submitForm"]
                }
            ]
        }
    });

    // An instance of this component that uses a single template renderer.  Please note, you should only have a single
    // component in your tree with the multiTemplateAware grade.  If you are building your own complex component using
    // `templateFormControl`, you should use the grade above and add `gpii.templates.hb.client.multiTemplateAware` to
    // your top-level component.
    fluid.defaults("gpii.templates.hb.client.templateFormControl.singleRenderer", {
        gradeNames: ["gpii.templates.hb.client.templateFormControl", "gpii.templates.hb.client.multiTemplateAware", "autoInit"]
    });
})(jQuery);