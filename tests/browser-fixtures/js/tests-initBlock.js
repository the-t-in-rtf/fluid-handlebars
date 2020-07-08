/* eslint-env browser */
/* globals jqUnit pageComponent */
(function (fluid, jqUnit, $) {
    "use strict";
    fluid.registerNamespace("fluid.tests.initBlock");

    fluid.tests.initBlock.runTests = function () {
        jqUnit.module("initBlock Helper Tests.");

        jqUnit.test("Verify the generated component.", function () {
            var expected = {
                "hasDataFromGrade": true,
                "req": {
                    "query": {
                        "myvar": "bar"
                    },
                    "params": {
                        "template": "initblock"
                    }
                },
                "json": {
                    "foo": "bar",
                    "baz": "quux",
                    "qux": "quux"
                },
                "myvar": "modelvariable",
                "markdown": "*this works*"
            };

            jqUnit.assertLeftHand("The component model should be as expected.", expected, pageComponent.requireRenderer.pageComponent.model);

            var viewportText = $(".initBlock-viewport").text().trim();
            jqUnit.assertEquals("The component's container should have been updated.", "The component has updated the body content.", viewportText);
        });
    };

    // A component definition that will be referenced from within the {{initBlock}} helper in our tests.
    fluid.defaults("fluid.tests.initBlock", {
        gradeNames: ["fluid.handlebars.templateAware"],
        template:   "initblock-viewport",
        selectors: {
            initial: ".initblock-viewport"
        },
        model: {
            hasDataFromGrade: true
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: [ "initial", "{that}.options.template", "{that}.model"]
            }
        },
        listeners: {
            "onMarkupRendered.runTests": {
                funcName: "fluid.tests.initBlock.runTests"
            }
        }
    });
})(fluid, jqUnit, jQuery);
