"use strict";
// Test the "template message" component.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */

fluid.defaults("gpii.templates.tests.templateMessage", {
    gradeNames: ["gpii.templates.templateMessage", "gpii.templates.templateAware.bornReady"],
    template:   "common-success",
    components: {
        renderer: {
            type: "gpii.templates.renderer",
            options: {
                members: {
                    templates: {
                        partials: {
                            "common-success": "<div class=\"alert-box success\">{{message}}</div>"
                        }
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.templates.tests.templateMessage.initialized", {
    gradeNames: ["gpii.templates.tests.templateMessage"],
    model: {
        message: "I was born with silver model data in my mouth."
    }
});

fluid.defaults("gpii.templates.tests.templateMessage.updated", {
    gradeNames: ["gpii.templates.tests.templateMessage"],
    model:      {}
});