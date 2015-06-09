// Add persistent bindings between a selector and a model value.  Changes are propagated between the two.
//
// To use this, you should have a "bindings" element in your fluid defaults, as in:
//      bindings: [{
//          selector:    "input",
//          path:        "input"
//      }]
//
//
// The options are as follows:
// * selector:    A valid selector for your component.
//                Must be able to be resolved using that.locate(selector)
//
// * path:        A valid path for the model variable whose value will be watched.
//                Must be able to be resolved using fluid.get(path)
//
// To make use of this, you will need to start by sourcing this file after all fluid sources.
//
// In your component, you will need a valid selector, as in:
//
//  selectors: {
//      "input":    ".ptd-search-input"
//  }
//
// You will also need a valid model path, as in:
//
//  model: {
//      input:  ""
//  }
//
// Finally, you will need to invoke the binding applier where it makes sense, for example in response to an event.
// Here's an example that binds to the "onCreate" event:
//
//  listeners: {
//      onCreate: {
//        "funcName": "ctr.components.binder.applyBinding",
//        "args":     "{that}"
//      }
//  }
//
// Once you have done this, model changes should be passed to form controls and vice versa.
//
// Note that if you reload markup or otherwise generate new markup, you will need to reapply the set of bindings.
// The `templateAware` grade included with this package takes care of that for you by calling `fluid.initDomBinder`
// and then running `applyBinding` once the `onDomBind` event is fired.  See that component for more details.
//
// This code was originally written by Antranig Basman <amb26@ponder.org.uk> and was evolved by Tony Atkins
// <tony@raisingthefloor.org> to document its use and make it usable with a wider range of form element types.
//
/* global fluid, jQuery */
(function ($) {
    "use strict";
    fluid.registerNamespace("gpii.templates.binder");

    // The main function to create bindings between markup and model elements.  See above for usage details.
    gpii.templates.binder.applyBinding = function (that) {
        var bindings = that.options.bindings;
        fluid.each(bindings, function (binding) {
            var element = that.locate(binding.selector);

            var value = fluid.get(that.model, binding.path);

            fluid.value(element, value);

            // Update the model when the form changes
            element.change(function () {
                fluid.log("Changing model based on element update.");

                var value = fluid.value(element);
                that.applier.change(binding.path, value);
            });

            // Update the form elements when the model changes
            that.applier.modelChanged.addListener(binding.path, function (change) {
                fluid.log("Changing value based on model update.");

                fluid.value(element, change);
            });
        });
    };
})(jQuery);


