"use strict";
// Test the "template message" component.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */
/* eslint-env node */
fluid.defaults("gpii.tests.handlebars.templateMessage", {
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

fluid.defaults("gpii.tests.handlebars.templateMessage.initialized", {
    gradeNames: ["gpii.tests.handlebars.templateMessage"],
    model: {
        message: "I was born with silver model data in my mouth."
    }
});

fluid.defaults("gpii.tests.handlebars.templateMessage.updated", {
    gradeNames: ["gpii.tests.handlebars.templateMessage"],
    model:      {}
});
