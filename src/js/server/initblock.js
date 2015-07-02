// Handlebars helper to construct a client side component given a list of grades, including all wiring required to
// ensure that:
//
//   1. Only one renderer is created an used in all child components
//   2. Child components are only created once templates have been loaded.
//
// The markup required to use this in a server-side handlebars template is something like:
//
//   {{{initblock "grade1", "grade2", "grade3"}}}
//
// As with `gradeNames` in general, grades that appear earlier in the list of arguments have the most precedence.
// If you are working with grades that override invokers or other options, you should put the most basic grades at the
// end of your list of arguments, and any grades that override or add functionality further to the left.  If all three
// of the grades in this example have an invoker with the same name, the invoker defined in `grade1` would be called.
//
// Please note, in the example above that the triple braces are required in order to prevent Handlebars from escaping
// the generated code and presenting it as text.
//
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.templates.helper.initBlock");

gpii.templates.helper.initBlock.getHelper = function (that) {
    return that.generateInitBlock;
};

gpii.templates.helper.initBlock.generateInitBlock = function (that, args) {
    // Guard against being handed an `Arguments` object instead of an array.
    args = fluid.makeArray(args);

    // In addition to the arguments we have passed, Handlebars gives us a final argument of its own construction.
    // This object contains the context data exposed to Handlebars.  We transform the data inluded in the context using
    // the rules outlined in `options.contextToModelRules` and use that as the generated component's model.
    var handlebarsContextData = args.slice(-1)[0].data.root;
    var generatedComponentModel = fluid.model.transformWithRules(handlebarsContextData, that.options.contextToModelRules);

    // Everything except for the final argument is a gradeName that we can work with.
    var rawGradeNames = args.slice(0, -1);

    // To ensure the same order of precedence as gradeNames, the last argument are used as the `type`, and any earlier
    // options are used as the `gradeNames`.
    var type       = rawGradeNames.slice(-1)[0]; // The first grade, which we will use as the `type` of the component.
    var gradeNames = rawGradeNames.slice(0, -1);

    if (!type) {
        fluid.fail("You must call the 'initBlock' helper with one or more grade names.");
    }
    else {
        var options                       = fluid.copy(that.options.baseOptions);
        var pageComponent                 = options.components.requireRenderer.options.components.pageComponent;
        pageComponent.type                = type;
        pageComponent.options.gradeNames  = gradeNames;
        pageComponent.options.model       = generatedComponentModel;

        var payload = ["<script type=\"text/javascript\">", "var gpii=fluid.registerNamespace(\"gpii\");", "var pageComponent = " + that.options.baseGradeName, "(" + JSON.stringify(options, null, 2) + ");", "</script>"].join("\n");

        return payload;
    }
};

fluid.defaults("gpii.templates.helper.initBlock", {
    gradeNames: ["gpii.templates.helper", "autoInit"],
    mergePolicy: {
        "baseOptions": "noexpand,nomerge"
    },
    contextToModelRules: {
        // The dispatcher tries to pass us these by default.
        user: "user",
        req:  "req"
    },
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
            "args":     ["{that}", "{arguments}"]
        }
    }
});
