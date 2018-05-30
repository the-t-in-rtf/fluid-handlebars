/* globals fluid */
/* eslint-env browser */
(function () {
    "use strict";
    fluid.defaults("gpii.tests.handlebars.templateAware.standalone", {
        gradeNames: ["fluid.modelComponent", "gpii.handlebars.templateAware.standalone"],
        selectors: {
            viewport: ""
        },
        mergePolicy: {
            templates: "noexpand"
        },
        templates: {
            layouts: {
                main: "{{body}}"
            },
            pages: {
                main: "This is our {{payload}} template content."
            }
        },
        model: {
            templates: "{that}.options.templates"
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["viewport", "main", { payload: "rendered" }, "html"] // selector, template, data, manipulator
            }
        }
    });
})();
