/* eslint-env browser */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    // Test component to exercise "standalone" client-side renderer.
    fluid.defaults("gpii.tests.handlebars.renderer.standalone", {
        gradeNames: ["gpii.handlebars.renderer"],
        mergePolicy: {
            templates: "noexpand"
        },
        templates: {
            layouts: {
                main: "<p>This is content coming from the layout.</p>{{body}}"
            },
            pages: {
                md:        "{{{md payload}}}",
                partial:   "{{>includedPartial}}",
                jsonify:   "{{{jsonify payload space=0}}}",
                equals:    "{{#equals \"good\" payload}}equals{{else}}not equals{{/equals}}"
            },
            partials: {
                includedPartial: "This is content coming from the partial."
            }
        },
        model: {
            templates: "{that}.options.templates"
        }
    });

    var rendererComponent = gpii.tests.handlebars.renderer.standalone();

    jqUnit.module("Testing standalone renderer component.");

    jqUnit.test("Confirm that the client-side renderer can render markdown.", function () {
        var renderedOutput = rendererComponent.render("md", { payload: "[unified listing](http://ul.gpii.net/)" });
        jqUnit.assertEquals("We should have received rendered markup.", "<p><a href=\"http://ul.gpii.net/\">unified listing</a></p>\n", renderedOutput);
    });

    jqUnit.test("Confirm that the client-side partials work.", function () {
        var renderedOutput = rendererComponent.render("partial");
        jqUnit.assertEquals("We should have received partial content.", "This is content coming from the partial.", renderedOutput);
    });

    jqUnit.test("Confirm that the JSONify helper works.", function () {
        var renderedOutput = rendererComponent.render("jsonify", { payload: { foo: "bar" } });
        jqUnit.assertDeepEq("We should have received stringified JSON content.", "{\"foo\":\"bar\"}", renderedOutput);
    });

    jqUnit.test("Confirm that the equals helper works.", function () {
        var equalsOutput = rendererComponent.render("equals", { payload: "good" });
        jqUnit.assertEquals("We should have hit the 'equals' block...", "equals", equalsOutput);

        var notEqualsOutput = rendererComponent.render("equals", { payload: "bad"});
        jqUnit.assertEquals("We should have hit the 'not equals' block...", "not equals", notEqualsOutput);
    });
})(fluid, jqUnit);
