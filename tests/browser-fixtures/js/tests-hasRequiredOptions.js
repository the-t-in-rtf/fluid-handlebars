/* eslint-env browser */
/* globals jqUnit */
"use strict";
(function (fluid, jqUnit) {
    // A test component with required options.
    /* eslint-env node */
    fluid.defaults("fluid.tests.handlebars.hasRequiredOptions", {
        gradeNames: ["fluid.hasRequiredOptions"],
        template:   "common-success",
        requiredFields: {
            beer: true,
            skittles: true
        }
    });

    jqUnit.module("'Has Required Options' tests.");

    jqUnit.test("Omitting all options should result in failure.", function () {
        jqUnit.expectFrameworkDiagnostic("", fluid.tests.handlebars.hasRequiredOptions, ["You have not supplied the required option 'beer'", "You have not supplied the required option 'skittles'"]);
    });

    jqUnit.test("Omitting a single required option should result in failure.", function () {
        var allButOneOptionFn = function () {
            fluid.tests.handlebars.hasRequiredOptions({ skittles: true });
        };
        jqUnit.expectFrameworkDiagnostic("", allButOneOptionFn, ["You have not supplied the required option 'beer'"]);
    });

    jqUnit.test("Supplying all options should result in success.", function () {
        fluid.tests.handlebars.hasRequiredOptions({ beer:true, skittles: true });
        jqUnit.assert("Component creation should have succeeded.");
    });
})(fluid, jqUnit);
