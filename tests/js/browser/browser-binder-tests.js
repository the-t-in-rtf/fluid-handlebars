// Test "binder" components using `gpii-test-browser`.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.registerNamespace("gpii.templates.tests.browser.binder");
// TODO:  If we find ourselves making model changes often, move this to `gpii-test-browser` and polish it up for wider use.
gpii.templates.tests.browser.binder.applyChange = function (componentPath, modelPath, newValue) {
    var component = fluid.getGlobalValue(componentPath);
    component.applier.change(modelPath, newValue);
};


fluid.defaults("gpii.templates.tests.browser.binder.caseHolder", {
    gradeNames: ["gpii.tests.browser.caseHolder.withExpress"],
    rawModules: [{
        tests: [
            // The form values are set on startup and are thus checked all at once.
            {
                name: "Test setting form value from component's initial model values...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".viewport-long [name='init-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'long' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromModel", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.lookupFunction, ".viewport-short [name='init-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'short' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromModel", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.lookupFunction, ".viewport-array [name='init-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'array' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromModel", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.lookupFunction, ".viewport-textarea [name='init-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'textarea' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromModel", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:  [gpii.tests.browser.tests.lookupFunction, ".viewport-select [name='init-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'select' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromModel", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.lookupFunction, ".viewport-radio [name='init-from-model']:checked", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The form field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromModel", "{arguments}.0"]
                    }
                ]
            },
            // The model values are also set on startup and are thus checked all at once.
            {
                name: "Test setting model value from markup initial value...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "long.model.initFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'long' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromMarkup", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "short.model.initFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'short' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromMarkup", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "array.model.initFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'array' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromMarkup", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "textarea.model.initFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'textarea' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromMarkup", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "select.model.initFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'select' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromMarkup", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "radio.model.initFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'radio' field should have been updated with the initial model data...", "{gpii.templates.tests.browser.environment}.options.expected.initFromMarkup", "{arguments}.0"]
                    }
                ]
            },
            // The remaining tests make changes and thus we test them independently.
            {
                name: "Confirm that a form update to the 'long' component results in a model update...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.type",
                        args: [".viewport-long [name='update-from-markup']", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup"]
                    },
                    // We need to manually change focus to propagate the change through to the model.
                    // TODO:  Once we have keypress support, update this to tab away.
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".avert-your-focus"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "long.model.updateFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'long' field should have been updated based on a form change...", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that a form update to the 'short' component results in a model update...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.type",
                        args: [".viewport-short [name='update-from-markup']", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup"]
                    },
                    // We need to manually change focus to propagate the change through to the model.
                    // TODO:  Once we have keypress support, update this to tab away.
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".avert-your-focus"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "short.model.updateFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'short' field should have been updated based on a form change...", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that a form update to the 'array' component results in a model update...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.type",
                        args: [".viewport-array [name='update-from-markup']", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup"]
                    },
                    // We need to manually change focus to propagate the change through to the model.
                    // TODO:  Once we have keypress support, update this to tab away.
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".avert-your-focus"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "array.model.updateFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'array' field should have been updated based on a form change...", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that a form update to the 'textarea' component results in a model update...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.type",
                        args: [".viewport-textarea [name='update-from-markup']", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup"]
                    },
                    // We need to manually change focus to propagate the change through to the model.
                    // TODO:  Once we have keypress support, update this to tab away.
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args:     [".avert-your-focus"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "textarea.model.updateFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'textarea' field should have been updated based on a form change...", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that a form update to the 'select' component results in a model update...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.select",
                        args: [".viewport-select [name='update-from-markup']", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onSelectComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.getGlobalValue, "select.model.updateFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'select' field should have been updated based on a form change...", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that a form update to the 'radio' component results in a model update...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.click",
                        args: ["#update-from-markup-markup"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [ gpii.tests.browser.tests.getGlobalValue, "radio.model.updateFromMarkup"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args: ["The 'radio' field should have been updated based on a form change...", "{gpii.templates.tests.browser.environment}.options.toSet.fromMarkup", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test updating 'long' form value using model change applier...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.binder.applyChange, "long", "updateFromModel", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".viewport-long [name='update-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'long' form field should have been updated with new model data...", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test updating 'short' form value using model change applier...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.binder.applyChange, "short", "updateFromModel", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".viewport-short [name='update-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'short' form field should have been updated with new model data...", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test updating 'array' form value using model change applier...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.binder.applyChange, "array", "updateFromModel", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".viewport-array [name='update-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'array' form field should have been updated with new model data...", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test updating 'textarea' form value using model change applier...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.binder.applyChange, "textarea", "updateFromModel", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".viewport-textarea [name='update-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'textarea' form field should have been updated with new model data...", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test updating 'select' form value using model change applier...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.binder.applyChange, "select", "updateFromModel", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".viewport-select [name='update-from-model']", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'select' form field should have been updated with new model data...", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test updating 'radio' form value using model change applier...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.binder.applyChange, "radio", "updateFromModel", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".viewport-radio [name='update-from-model']:checked", "value"]
                    },
                    {
                        event:     "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The 'radio' form field should have been updated with new model data...", "{gpii.templates.tests.browser.environment}.options.toSet.fromApplier", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.templates.tests.browser.environment({
    "port": 6874,
    "path": "content/tests-binder.html",
    toSet: {
        fromMarkup: "updated using form controls",
        fromApplier: "updated using applier"
    },
    expected: {
        initFromModel:    "initialized from model",
        initFromMarkup:   "initialized from markup"
    },
    components: {
        caseHolder: {
            type: "gpii.templates.tests.browser.binder.caseHolder"
        }
    }
});