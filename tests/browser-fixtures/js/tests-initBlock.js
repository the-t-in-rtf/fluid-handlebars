/* eslint-env browser */
/* globals jqUnit pageComponent */
(function (fluid, jqUnit, $) {
    "use strict";

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
})(fluid, jqUnit, jQuery);
