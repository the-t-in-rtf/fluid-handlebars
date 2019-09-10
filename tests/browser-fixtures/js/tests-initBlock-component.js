/* eslint-env browser */
(function (fluid) {
    "use strict";

    // A component definition that will be referenced from within the {{initBlock}} helper in our tests.
    fluid.defaults("gpii.tests.initBlock", {
        gradeNames: ["gpii.handlebars.templateAware"],
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
        }
    });
})(fluid);
