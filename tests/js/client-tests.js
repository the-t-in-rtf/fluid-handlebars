"use strict";
// This is a test component that is meant to be included in a client-side document.
//
// The actual tests can be found in zombie-tests.js, which will also start the server and launch a headless browser.
//
/* global fluid */
fluid.registerNamespace("gpii.hb.clientTests");

// Update the document to exercise all the DOM manipulation functions.
//
// Each block should contain template content that also exercises various helpers and demonstrates that model variables are available.
gpii.hb.clientTests.updateDocument = function (that) {
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
        "templateName":            "template",
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
                        funcName: "gpii.templates.hb.client.loadTemplates",
                        args:     ["{that}"]
                    }
                }
            }
        }
    },
    listeners: {
        "{templates}.events.templatesLoaded": {
            funcName: "gpii.hb.clientTests.updateDocument",
            args: ["{that}"]
        }
    }
});