// Tests for the standalone renderer used with this package.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../../index");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.handlebars.standaloneRenderer");
gpii.tests.handlebars.standaloneRenderer.runTests = function (that) {
    fluid.each(that.options.tests, function (testOptions) {
        jqUnit.test(testOptions.name, function () {
            var output = that.renderer.render(testOptions.templateKey, testOptions.context);
            jqUnit.assertEquals("The output should be as expected...", testOptions.expected, output.trim());
        });
    });
};

fluid.component({
    mergePolicy: {
        tests: "noexpand,nomerge"
    },
    // Tests to be evaluated.  Each test should have the following options:
    // `templateKey`: The name of the template to be used in rendering
    // `context`:      The context to be passed to the rendered
    // `expected`:     The expected output.
    tests: [
        {
            name:        "Testing variable substitution...",
            templateKey: "variable",
            context:     { variable: "world" },
            expected:    "Hello, world."
        },
        {
            name:        "Testing partial substitution...",
            templateKey: "partials",
            context:     {},
            expected:    "This is partial content."
        },
        {
            name:        "Testing 'equals' helper...",
            templateKey: "helpers-equals",
            context:     {},
            expected:    "good"
        },
        {
            name:        "Testing 'md' helper with valid content...",
            templateKey: "helpers-md",
            context:     { markdown: "This *works*" },
            expected:    "<p>This <em>works</em></p>"
        },
        {
            name:        "Testing 'md' helper with no matching content...",
            templateKey: "helpers-md",
            context:     {},
            expected:    ""
        },
        {
            name:        "Testing 'md' helper with non-string content...",
            templateKey: "helpers-md",
            context:     { markdown: 1},
            expected:    "<p>1</p>"
        },
        {
            name:        "Testing 'jsonify' helper...",
            templateKey: "helpers-jsonify",
            context:     { json: { foo: "bar"}},
            expected:    "{\n  \"foo\": \"bar\"\n}"
        },
        {
            name:        "Testing 'jsonify' handling of string values...",
            templateKey: "helpers-jsonify-string",
            context:     "my string without quotes",
            expected:    "my string without quotes"
        },
        {
            name:        "Testing 'jsonify' handling of string values when options are passed...",
            templateKey: "helpers-jsonify-custom-options",
            context:     "my string",
            expected:    "\"my string\""
        }
    ],
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.tests.handlebars.standaloneRenderer.runTests",
            args:     ["{that}"]
        }
    },
    components: {
        renderer: {
            type: "gpii.handlebars.standaloneRenderer",
            options: {
                templateDirs: "%gpii-handlebars/tests/templates/primary"
            }
        }
    }
});