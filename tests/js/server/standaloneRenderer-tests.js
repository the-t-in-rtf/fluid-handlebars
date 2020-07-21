// Tests for the standalone renderer used with this package.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-handlebars");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("fluid.tests.handlebars.standaloneRenderer");
fluid.tests.handlebars.standaloneRenderer.runTests = function (that, messageBundleLoader, renderer) {
    fluid.each(that.options.tests, function (testOptions) {
        jqUnit.test(testOptions.name, function () {
            // Pass `true` as the first argument to ensure that a mutable copy is made:
            // https://api.jquery.com/jQuery.extend/#jQuery-extend-deep-target-object1-objectN
            var mergedContext = fluid.extend(true, {}, that.options.baseContext, testOptions.context);

            if (testOptions.locale) {
                fluid.set(mergedContext, "req.headers.accept-language", testOptions.locale);
            }

            var output = renderer.render(testOptions.templateKey, mergedContext);
            jqUnit.assertEquals("The output should be as expected...", testOptions.expected, output.trim());
        });
    });
};

fluid.defaults("fluid.tests.handlebars.standaloneRenderer", {
    gradeNames: ["fluid.modelComponent"],
    mergePolicy: {
        tests: "noexpand,nomerge"
    },
    baseContext: {
        // Fake request for these tests.
        req: {
            headers: {
                "accept-language": "en_us"
            }
        }
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
            context:     { payload: "my string without quotes"},
            expected:    "my string without quotes"
        },
        {
            name:        "Testing 'jsonify' handling of string values when options are passed...",
            templateKey: "helpers-jsonify-custom-options",
            context:     { payload: "my string"},
            expected:    "\"my string\""
        },
        {
            name: "Testing i18n locale support in renderer.",
            templateKey: "messageHelper",
            locale: "en_gb",
            context: { key: "how-are-things"},
            expected: "Things are tolerable."
        },
        {
            name: "Testing i18n locale failover to language in renderer.",
            templateKey: "messageHelper",
            locale: "nl_be",
            context: { key: "how-are-things"},
            expected: "Het gaat goed."
        },
        {
            name: "Testing i18n locale failover to data inherited from another locale in renderer.",
            templateKey: "messageHelper",
            locale: "nl_be",
            context: { key: "wave"},
            expected: "golf"
        },
        {
            name: "Testing i18n error handling.",
            templateKey: "messageHelper",
            context: { key: "nonexistent-key", payload: {} },
            expected: "[Message string for key nonexistent-key not found]"
        },
        {
            name: "Testing i18n shallow variable interpolation.",
            templateKey: "messageHelper",
            context: { key: "shallow-variable", condition: "fine"},
            expected: "This is fine."
        },
        {
            name: "Testing i18n deep variable interpolation.",
            templateKey: "messageHelper",
            context: { key: "deep-variable", deep: { condition: "better"} },
            expected: "This is even better."
        },
        {
            name: "Testing failover to context root.",
            templateKey: "messageHelper-root",
            context: { key: "shallow-variable", condition: "fine"},
            expected: "This is fine."
        }
    ],
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.tests.handlebars.standaloneRenderer.runTests",
            args:     ["{that}", "{messageBundleLoader}", "{renderer}"]
        }
    },
    messageDirs: {
        primary: "%fluid-handlebars/tests/messages/primary",
        secondary: "%fluid-handlebars/tests/messages/secondary"
    },
    components: {
        renderer: {
            type: "fluid.handlebars.standaloneRenderer",
            options: {
                model: {
                    messageBundles: "{messageBundleLoader}.model.messageBundles"
                },
                templateDirs: { primary: "%fluid-handlebars/tests/templates/primary" }
            }
        },
        messageBundleLoader: {
            type: "fluid.handlebars.i18n.messageBundleLoader",
            options: {
                messageDirs: "{fluid.tests.handlebars.standaloneRenderer}.options.messageDirs"
            }
        }
    }
});
fluid.tests.handlebars.standaloneRenderer();
