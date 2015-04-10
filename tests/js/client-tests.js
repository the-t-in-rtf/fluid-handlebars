"use strict";
// This is a test component that is meant to be included in a client-side document.
//
// To run these tests, you should look at zombie-tests.js, which will start the server and launch a headless browser.
//
/* global fluid, gpii, jqUnit */
fluid.registerNamespace("gpii.hb.clientTests");

gpii.hb.clientTests.transformUsingTemplates = function (that) {
    that.templates.after(that.locate("viewport-after"), that.model.templateName, that.model);
    that.templates.append(that.locate("viewport-append"), that.model.templateName, that.model);
    that.templates.before(that.locate("viewport-before"), that.model.templateName, that.model);
    that.templates.html(that.locate("viewport-html"), that.model.templateName, that.model);
    that.templates.prepend(that.locate("viewport-prepend"), that.model.templateName, that.model);
    that.templates.replaceWith(that.locate("viewport-replaceWith"), that.model.replaceWithTemplateName, that.model);
};

fluid.defaults("gpii.hb.clientTests", {
    gradeNames: ["fluid.viewRelayComponent", "autoInit"],
    model: {
        "myvar":                   "modelvariable",
        "markdown":                "*this works*",
        "json":                    { "foo": "bar", "baz": "quux", "qux": "quux" },
        "templateName":            "main",
        "replaceWithTemplateName": "replace"
    },
    selectors: {
        "viewport-after":       ".viewport-after",
        "viewport-append":      ".viewport-append",
        "viewport-before":      ".viewport-before",
        "viewport-html":        ".viewport-html",
        "viewport-prepend":     ".viewport-prepend",
        "viewport-replaceWith": ".viewport-replaceWith"
    },
    components: {
        "templates": {
            "type": "gpii.templates.hb.client",
            "options": {
                "listeners": {
                    "onCreate.loadTemplates": {
                        "func": "{templates}.loadTemplates"
                    }
                }
            }
        }
    },
    listeners: {
        "{templates}.events.templatesLoaded": {
            "funcName": "gpii.hb.clientTests.transformUsingTemplates",
            "args":     ["{that}"]
        }
    }
});