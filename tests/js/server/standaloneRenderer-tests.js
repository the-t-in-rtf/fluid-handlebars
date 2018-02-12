// Tests for the standalone renderer used with this package.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-handlebars");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.handlebars.standaloneRenderer");
gpii.tests.handlebars.standaloneRenderer.runTests = function (that) {
    fluid.each(that.options.tests, function (testOptions) {
        jqUnit.test(testOptions.name, function () {
            var output = that.renderer.render(testOptions.templateKey, testOptions.context, testOptions.locale);
            jqUnit.assertEquals("The output should be as expected...", testOptions.expected, output.trim());
        });
    });
};

fluid.defaults("gpii.tests.handlebars.standaloneRenderer", {
    gradeNames: ["fluid.modelComponent"],
    mergePolicy: {
        tests: "noexpand,nomerge"
    },
    events: {
        onMessagesLoaded: null
    },
    model: {
        messageBundles: {}
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
            context: { key: "deep-variable", deep: { value: "better"} },
            expected: "This is even better."
        }
    ],
    listeners: {
        "onMessagesLoaded.runTests": {
            funcName: "gpii.tests.handlebars.standaloneRenderer.runTests",
            args:     ["{that}"]
        }
    },
    messageDirs: ["%gpii-handlebars/tests/messages/primary", "%gpii-handlebars/tests/messages/secondary"],
    components: {
        renderer: {
            type: "gpii.handlebars.standaloneRenderer",
            options: {
                model: {
                    messageBundles: "{gpii.tests.handlebars.standaloneRenderer}.model.messageBundles"
                },
                templateDirs: "%gpii-handlebars/tests/templates/primary"
            }
        },
        messageLoader: {
            type: "gpii.handlebars.i18n.messageLoader",
            options: {
                messageDirs: "{gpii.tests.handlebars.standaloneRenderer}.options.messageDirs",
                model: {
                    messageBundles: "{gpii.tests.handlebars.standaloneRenderer}.model.messageBundles"
                },
                listeners: {
                    "onMessagesLoaded.notifyParent": {
                        func: "{gpii.tests.handlebars.standaloneRenderer}.events.onMessagesLoaded.fire"
                    }
                }
            }
        }
    }
});
gpii.tests.handlebars.standaloneRenderer();

