/*

    A handlebars helper that generates a client-side component definition when the page is rendered on the server-side.

    See the docs for details: https://github.com/fluid-project/fluid-handlebars/blob/master/docs/initBlock.md

 */
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var jQuery = fluid.registerNamespace("jQuery");

fluid.registerNamespace("fluid.handlebars.helper.initBlock");

fluid.handlebars.helper.initBlock.getHelper = function (that) {
    return that.generateInitBlock;
};

fluid.handlebars.helper.initBlock.generateInitBlock = function (that, args) {
    // Guard against being handed an `Arguments` object instead of an array.
    args = fluid.makeArray(args);

    // In addition to the arguments we have passed, Handlebars gives us a final argument of its own construction.
    // This object contains the context data exposed to Handlebars.  We transform the data included in the context using
    // the rules outlined in `options.contextToModelRules` and use that as the generated component's model.
    var handlebarsContextData = args.slice(-1)[0].data.root;
    var generatedOptions      = fluid.model.transformWithRules(handlebarsContextData, that.options.contextToOptionsRules);

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

        // Merge the generate component options into the current hierarchy
        jQuery.extend(pageComponent.options, generatedOptions);

        // TODO:  This may prevent instantiating multiple components in a single page.  Review this practice as needed.
        var payload = ["<script type=\"text/javascript\">", "var pageComponent = " + that.options.baseGradeName, "(" + JSON.stringify(options, null, 2) + ");", "</script>"].join("\n");

        return payload;
    }
};

fluid.defaults("fluid.handlebars.helper.initBlock", {
    gradeNames: ["fluid.handlebars.helper"],
    mergePolicy: {
        "baseOptions": "noexpand,nomerge"
    },
    contextToOptionsRules: { "": "" }, // By default, expose everything that's available.
    baseGradeName: "fluid.handlebars.templateManager",
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
            "funcName": "fluid.handlebars.helper.initBlock.getHelper",
            "args":     ["{that}"]
        },
        "generateInitBlock": {
            "funcName": "fluid.handlebars.helper.initBlock.generateInitBlock",
            "args":     ["{that}", "{arguments}"]
        }
    }
});
