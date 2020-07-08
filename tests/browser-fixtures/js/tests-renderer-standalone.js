/* eslint-env browser */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    // Test component to exercise "standalone" client-side renderer.
    fluid.defaults("fluid.tests.handlebars.renderer.standalone", {
        gradeNames: ["fluid.handlebars.renderer"],
        mergePolicy: {
            templates: "noexpand"
        },
        templates: {
            layouts: {
                main: "<p>This is content coming from the layout.</p>{{body}}"
            },
            pages: {
                md:        "{{{md payload}}}",
                partial:   "{{>includedPartial}}",
                jsonify:   "{{{jsonify payload space=0}}}",
                equals:    "{{#equals \"good\" payload}}equals{{else}}not equals{{/equals}}"
            },
            partials: {
                includedPartial: "This is content coming from the partial."
            }
        },
        model: {
            templates: "{that}.options.templates"
        }
    });

    fluid.tests.handlebars.renderer.standalone.renderAndCompare = function (message, renderer, templateKey, payload, expected, compareFn) {
        compareFn = compareFn || "assertEquals";
        var renderedOutput = renderer.render(templateKey, { payload: payload });
        jqUnit[compareFn](message, expected, renderedOutput);
    };

    fluid.defaults("fluid.tests.handlebars.renderer.standalone.testEnvironment.caseHolder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        // We have to make sure this expected value isn't expanded.
        troublesomeExpectations: {
            jsonify: "{\"foo\":\"bar\"}"
        },
        mergePolicy: {
            troublesomeExpectations: "noexpand"
        },
        modules: [{
            name: "Testing standalone renderer component.",
            tests: [
                {
                    name: "Confirm that the client-side renderer can render markdown.",
                    sequence: [{
                        funcName: "fluid.tests.handlebars.renderer.standalone.renderAndCompare",
                        // message, renderer, templateKey, payload, expected, [compareFn]
                        args: [
                            "We should have received rendered markup.",
                            "{renderer}",
                            "md",
                            "[unified listing](http://ul.fluid.net/)",
                            "<p><a href=\"http://ul.fluid.net/\">unified listing</a></p>\n"
                        ]
                    }]
                },
                {
                    name: "Confirm that the client-side partials work.",
                    sequence: [{
                        funcName: "fluid.tests.handlebars.renderer.standalone.renderAndCompare",
                        // message, renderer, templateKey, payload, expected, [compareFn]
                        args: [
                            "We should have received partial content.",
                            "{renderer}",
                            "partial",
                            {},
                            "This is content coming from the partial."
                        ]
                    }]
                },
                {
                    name: "Confirm that the JSONify helper works.",
                    sequence: [{
                        funcName: "fluid.tests.handlebars.renderer.standalone.renderAndCompare",
                        // message, renderer, templateKey, payload, expected, [compareFn]
                        args: [
                            "We should have received stringified JSON content.",
                            "{renderer}",
                            "jsonify",
                            { foo: "bar" },
                            "{that}.options.troublesomeExpectations.jsonify"
                        ]
                    }]
                },
                {
                    name: "Confirm that the equals helper works.",
                    sequence: [
                        {
                            funcName: "fluid.tests.handlebars.renderer.standalone.renderAndCompare",
                            // message, renderer, templateKey, payload, expected, [compareFn]
                            args: [
                                "We should have hit the 'equals' block...",
                                "{renderer}",
                                "equals",
                                "good",
                                "equals"
                            ]
                        },
                        {
                            funcName: "fluid.tests.handlebars.renderer.standalone.renderAndCompare",
                            // message, renderer, templateKey, payload, expected, [compareFn]
                            args: [
                                "We should have hit the 'not equals' block...",
                                "{renderer}",
                                "equals",
                                "bad",
                                "not equals"
                            ]
                        }
                    ]
                }
            ]
        }],
        components: {
            renderer: {
                type: "fluid.tests.handlebars.renderer.standalone"
            }
        }
    });

    fluid.defaults("fluid.tests.handlebars.renderer.standalone.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            caseHolder: {
                type: "fluid.tests.handlebars.renderer.standalone.testEnvironment.caseHolder"
            }
        }
    });

    fluid.test.runTests("fluid.tests.handlebars.renderer.standalone.testEnvironment");
})(fluid, jqUnit);
