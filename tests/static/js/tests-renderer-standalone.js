/* eslint-env browser */
(function () {
    "use strict";
    // Test component to exercise "standalone" client-side renderer.
    //
    //
    /* globals fluid */
    fluid.defaults("gpii.tests.handlebars.renderer.standalone", {
        gradeNames: ["gpii.handlebars.renderer.standalone"],
        templates: {
            layouts: {
                main: "{{body}}"
            },
            pages: {
                md:        "{{{md .}}}",
                partial:   "{{>includedPartial}}",
                jsonify:   "{{{jsonify . space=0}}}",
                equals:    "{{#equals \"good\" .}}equals{{else}}not equals{{/equals}}"
            },
            partials: {
                includedPartial: "This is content coming from the partial."
            }
        }
    });
})();
