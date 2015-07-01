/*

  A component to standardize the process of retrieving data and then updating the model when the results are received.

 The component sends a request when its `request` invoker is called.  The request data consists of the component's
 model, transformed according to the rules specified in `options.rules.request`.

 The remaining request options are controlled using `options.ajaxOptions`, which are options in the format used by
 `jQuery.ajax()`.  Once the request is sent, the following workflow applies:

   1.  If the AJAX request returns an error or the result contains a "falsy" `ok` variable, the error is transformed
       using the rules found in `options.rules.error`, and the results are applied to the component's model using the
       change applier.
   2.  If the AJAX request is successful, the results are transformed using the rules found in `options.rules.success`,
       and applied to the model using the change applier.

 This component does not handle any rendering, you are expected to do that yourself, or use a grade that handles that.
 With that in mind, there are grades for two common use cases:

   1.  Retrieve required data on startup and then render the page.
   2.  Submit the model to a REST endpoint and refresh the model with the results.

For the first use case, you can start with the 'retrieveAndRender` component included with this package.

For the second use case, you can start with the `templateFormControl` component.

If you need to do both (or each multiple times), you should create a parent component that uses as many individual
`templateRequestAndRender` and `templateFormControl` components as needed.

TODO:  Reconcile this with the larger migration to dataSources.

 */
/* global fluid, jQuery */
(function ($) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.templates.ajaxCapable");

    // Apply all changes in a single transaction.  Also ensures that values flagged with `null` are deleted from the model.
    gpii.templates.ajaxCapable.batchChanges = function (that, changeSet) {
        var myTransaction = that.applier.initiate();

        fluid.each(changeSet, function (value, key) {
            var change = { path: key };
            if (value === undefined || value === null) {
                change.type = "DELETE";
            }
            else {
                change.value = value;
            }
            myTransaction.fireChangeRequest(change);
        });

        myTransaction.commit();
    };

    gpii.templates.ajaxCapable.makeRequest = function (that) {
        var options = fluid.copy(that.options.ajaxOptions);

        var transformedModel = fluid.model.transformWithRules(that.model, that.options.rules.modelToRequestPayload);

        // We have added a `json` option not supported by `jQuery.ajax()` itself, which makes it easier to pass JSON data.
        if (options.json) {
            options.contentType = "application/json";
        }

        options.data = options.json ? JSON.stringify(transformedModel) : transformedModel;
        $.ajax(options);
    };

    gpii.templates.ajaxCapable.handleSuccess = function (that, data) {
        var transformedData = fluid.model.transformWithRules(data, that.options.rules.successResponseToModel);

        gpii.templates.ajaxCapable.batchChanges(that, transformedData);

        that.events.requestReceived.fire(that);
    };

    gpii.templates.ajaxCapable.handleError = function (that, data) {
        var errorData = fluid.model.transformWithRules(data, that.options.rules.errorResponseToModel);

        gpii.templates.ajaxCapable.batchChanges(that, errorData);

        that.events.requestReceived.fire(that);
    };

    fluid.defaults("gpii.templates.ajaxCapable", {
        gradeNames:    ["fluid.modelRelayComponent", "autoInit"],
        ajaxOptions: {
            success: "{that}.handleSuccess",
            error:   "{that}.handleError"
        },
        events: {
            requestReceived: null
        },
        // Rules to control what (if any) feedback from successful response is displayed.
        rules: {
            // Rules to control how a successful response is applied to the model.
            successResponseToModel: {
                "": "responseJSON" // By default, use the entire jQuery `jqXHR` object's JSON payload.
            },

            // Rules to control how an error is applied to the model
            errorResponseToModel: {
                "": "responseJSON" // By default, use the entire jQuery `jqXHR` object's JSON payload.
            },

            // Rules to control how our model is parsed before making a request
            modelToRequestPayload: {
                "": ""    // By default, pass the model with no alterations.
            }
        },
        invokers: {
            makeRequest: {
                funcName: "gpii.templates.ajaxCapable.makeRequest",
                args:     ["{that}"]
            },
            handleSuccess: {
                funcName: "gpii.templates.ajaxCapable.handleSuccess",
                args:     ["{that}", "{arguments}.2"]  // We use the jqXHR object because it gives us fine control over text vs. JSON responses.
            },
            handleError: {
                funcName: "gpii.templates.ajaxCapable.handleError",
                args:     ["{that}", "{arguments}.2"] // We use the jqXHR object because it gives us fine control over text vs. JSON responses.
            }
        }
    });
})(jQuery);