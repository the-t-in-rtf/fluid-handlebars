// Handlebars helper to allow us to compare values used in presentation logic.
//
// This can be used to do things like add an extra CSS class to records whose status is "deleted".
//
// The helper can be accessed in your markup using syntax like:
//
// `{{#equals VARIABLE1 VARIABLE2 }}`
// `  The variables are equal.`
// `{{/equals}}`
//
// `{{#equals VARIABLE1 "TEXT" }}`
// `  The variable is equal to the text.`
// `{{#else}}`
// `  The variable is not equal to the text.`
// `{{/equals}}
//
// Note in the second example that `else` is supported if the condition is not matched, as with the built-in `{{#if}}` helper.
//
// Adapted from the approach outlined in this blog by "bendog":
// http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/
//
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.templates.helper.initBlock");

gpii.templates.helper.initBlock.getHelper = function (that) {
    return that.generateInitBlock;
};

gpii.templates.helper.initBlock.generateInitBlock = function (that, gradeName) {
    if (!gradeName) {
        fluid.fail("You must call the 'initBlock' helper with a gradeName.");
    }
    else {
        var options = fluid.copy(that.options.baseOptions);
        var pageComponent = options.components.requireRenderer.options.components.pageComponent;
        pageComponent.type = gradeName;

        var generatedModel = fluid.model.transformWithRules(that.model, that.options.rules);
        pageComponent.options.model = generatedModel;

        var payload = ["<script type=\"text/javascript\">", "var pageComponent = " + that.options.baseGradeName, "(" + JSON.stringify(options, null, 2) + ");", "</script>"].join("\n");
        return payload;
    }
};

// TODO:  Someone needs to make me aware of the request parameters.  Perhaps a `requestAware` grade?

fluid.defaults("gpii.templates.helper.initBlock", {
    gradeNames: ["gpii.templates.helper", "autoInit"],
    mergePolicy: {
        "baseOptions": "noexpand,nomerge"
    },
    rules: {},
    baseGradeName: "gpii.templates.templateManager",
    baseOptions: {
        components: {
            requireRenderer: {
                options: {
                    components: {
                        pageComponent: {
                            container:  "body",
                            options:    {}
                        }
                    }
                }
            }
        }
    },
    helperName: "initBlock",
    invokers: {
        "getHelper": {
            "funcName": "gpii.templates.helper.initBlock.getHelper",
            "args":     ["{that}"]
        },
        "generateInitBlock": {
            "funcName": "gpii.templates.helper.initBlock.generateInitBlock",
            "args":     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});
