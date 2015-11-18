// Tests for the standalone renderer used with this package.
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../../index");
require("../lib/promiseWrapper");

var jqUnit = require("node-jqunit");
var path   = require("path");

var templateDir = path.resolve(__dirname, "../../templates/primary");

fluid.registerNamespace("gpii.handlebars.tests.standaloneRenderer");
gpii.handlebars.tests.standaloneRenderer.runTests = function (that) {
    fluid.each(that.options.tests, function (testOptions) {
        jqUnit.test(testOptions.name, function () {
            var output = that.renderer.render(testOptions.templateKey, testOptions.context);
            jqUnit.assertEquals("The output should be as expected...", testOptions.expected, output);
        });
    });
};

var testComponent = gpii.templates.tests.promiseWrapper({
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
            name:        "Testing 'md' helper...",
            templateKey: "helpers-md",
            context:     { markdown: "This *works*" },
            expected:    "<p>This <em>works</em></p>\n"
        },
        {
            name:        "Testing 'jsonify' helper...",
            templateKey: "helpers-jsonify",
            context:     { json: { foo: "bar"}},
            expected:    "{\n  \"foo\": \"bar\"\n}"
        }
    ],
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.handlebars.tests.standaloneRenderer.runTests",
            args:     ["{that}"]
        }
    },
    components: {
        renderer: {
            type: "gpii.handlebars.standaloneRenderer",
            options: {
                templateDir: templateDir
            }
        }
    }
});

module.exports = testComponent.afterDestroyPromise;