"use strict";
// Test the "template message" component.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */

fluid.defaults("gpii.hb.tests.templateMessage", {
    gradeNames: ["gpii.templates.hb.client.templateMessage", "autoInit"],
    template:   "common-success",
    components: {
        renderer: {
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

fluid.defaults("gpii.hb.tests.templateMessage.initialized", {
    gradeNames: ["gpii.hb.tests.templateMessage", "autoInit"],
    model: {
        message: "I was born with silver model data in my mouth."
    }
});

fluid.defaults("gpii.hb.tests.templateMessage.updated", {
    gradeNames: ["gpii.hb.tests.templateMessage", "autoInit"],
    model:      {}
});