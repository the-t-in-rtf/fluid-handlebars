/*

  A component to standardize handling of "simple" form data submitted via AJAX.  This component:

  1.  Performs an initial render of the component using the template specified in `options.templates.initial`
  2.  Binds a form submission that sends the `model` data using the options specified in `options.ajax`
  3.  If the AJAX request returns an error or the result contains a "falsy" `ok` variable, the error is transformed using the rules found in `options.rules.error` and
      displayed on screen using the template `options.templates.error`.
  4.  If the AJAX request is successful:
    a) The results are transformed using the rules found in `options.rules.success`.
    b) Any information contained in the `model` section of the transformed results is saved to the component's model using the change applier.
    c) The updated model is displayed on screen using the template `options.templates.success`.

By default, all updates are made against the same selector. You can override this behavior for the success and error
functions by changing the value of `options.selectors.success` and `options.selectors.error`.

 */
/* global fluid, jQuery */
(function ($) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.templates.hb.client.templateFormControl");


    gpii.templates.hb.client.templateFormControl.checkRequirements = function (that) {
        var errors = [];

        if (!that.options.templates || !that.options.templates.initial || !that.options.templates.error || !that.options.templates.success) {
            errors.push("You have not configured any templates for use with this component.");
        }

        else if (!that.options.ajaxUrl) {
            errors.push("Your AJAX options do not include a URL.  The AJAX request will not be able to complete as expected.");
        }

        if (!that.options.rules || !that.options.rules.error || !that.options.rules.success) {
            errors.push("You have not configured any rules regarding how to handle AJAX responses.");
        }

        if (errors.length > 0) {
            fluid.fail(errors);
        }
    };

    gpii.templates.hb.client.templateFormControl.submitForm = function (that, event) {
        event.preventDefault();
        $.ajax(that.options.ajaxOptions);
    };

    gpii.templates.hb.client.templateFormControl.handleSuccess = function (that, data) {
        if (typeof data === "string") { data = JSON.parse(data); }
        if (data.ok) {
            var transformedData = fluid.model.transformWithRules(data, that.options.rules.success);

            // Any data that is stored in the `model` of the transformed result is used to update the component's `model`.
            if (transformedData.model) {
                Object.keys(transformedData.model).forEach(function (key) {
                    that.applier.change(key, transformedData.model[key]);
                });
            }

            gpii.templates.hb.client.templateAware.renderMarkup(that, that.options.selectors.success, that.options.templates.success, that.model);
        }
        // If the response is not OK, pass it along to be handled as an error instead.
        else {
            gpii.templates.hb.client.templateFormControl.handleError(that, data);
        }
    };

    gpii.templates.hb.client.templateFormControl.handleAjaxError = function (that, jqXHR) {
        gpii.templates.hb.client.templateFormControl.handleError(that, JSON.parse(jqXHR.responseText));
    };

    gpii.templates.hb.client.templateFormControl.handleError = function (that, data) {
        var errorData = fluid.model.transformWithRules(data, that.options.rules.error);
        gpii.templates.hb.client.templateAware.renderMarkup(that, that.options.selectors.error, that.options.templates.error, errorData);
    };

    gpii.templates.hb.client.templateFormControl.handleKeyPress = function (that, event) {
        if (event.keyCode === 13) { // Enter
            gpii.templates.hb.client.submitForm(that, event);
        }
    };

    fluid.defaults("gpii.templates.hb.client.templateFormControl", {
        gradeNames: ["gpii.templates.hb.client.templateAware", "autoInit"],
        ajaxOptions: {
            url:     "{that}.options.ajaxUrl",
            data:    "{that}.model",
            success: "{that}.handleSuccess",
            error:   "{that}.handleAjaxError"
        },
        rules: {
            success: {}, // Do not parse or attempt to update the model by default.
            error: {     // Assume the error message can be found in a `message` element.
                message: "message"
            }
        },
        selectors: {
            initial: "",  // The container that will be overwritten with template content on startup.
            error:   "",  // The container that will be updated with template content if an AJAX error occurs.
            success: "",  // The container that will be updated with content if the AJAX request succeeds.
            submit:  ".submit" // Clicking or hitting enter on our submit button will launch our AJAX request
        },
        invokers: {
            renderInitialMarkup: {
                funcName: "gpii.templates.hb.client.templateAware.renderMarkup",
                args: ["{that}", "initial", "{that}.options.templates.initial", "{that}.model", "replaceWith"]
            },
            submitForm: {
                funcName: "gpii.templates.hb.client.templateFormControl.submitForm",
                args: ["{that}", "{arguments}.0"]
            },
            handleSuccess: {
                funcName: "gpii.templates.hb.client.templateFormControl.handleSuccess",
                args: ["{that}", "{arguments}.0"]
            },
            handleAjaxError: {
                funcName: "gpii.templates.hb.client.templateFormControl.handleAjaxError",
                args: ["{that}", "{arguments}.0"]
            },
            handleKeyPress: {
                funcName: "gpii.templates.hb.client.templateFormControl.handleKeyPress",
                args: ["{that}", "{arguments}.0"]
            }
        },
        listeners: {
            "onMarkupRendered.wireSubmitButton": [
                {
                    "this": "{that}.dom.submit",
                    method: "keyup",
                    args:   "{that}.handleKeyPress"
                },
                {
                    "this": "{that}.dom.submit",
                    method: "click",
                    args:   "{that}.submitForm"
                }
            ]
        }
    });
})(jQuery);