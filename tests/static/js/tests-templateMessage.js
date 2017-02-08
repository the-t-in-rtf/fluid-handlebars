"use strict";
// Test the "template message" component.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */
/* eslint-env node */
fluid.defaults("gpii.handlebars.tests.templateMessage", {
    gradeNames: ["gpii.handlebars.templateMessage", "gpii.handlebars.templateAware.bornReady"],
    template:   "common-success",
    components: {
        renderer: {
            type: "gpii.handlebars.renderer",
            options: {
                members: {
                    templates: {
                        partials: {
                            "common-success": "<div class=\"callout success\">{{message}}</div>"
                        }
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.handlebars.tests.templateMessage.initialized", {
    gradeNames: ["gpii.handlebars.tests.templateMessage"],
    model: {
        message: "I was born with silver model data in my mouth."
    }
});

fluid.defaults("gpii.handlebars.tests.templateMessage.updated", {
    gradeNames: ["gpii.handlebars.tests.templateMessage"],
    model:      {}
});
