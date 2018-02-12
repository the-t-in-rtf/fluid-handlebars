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
                md:        "{{{md payload}}}",
                partial:   "{{>includedPartial}}",
                jsonify:   "{{{jsonify payload space=0}}}",
                equals:    "{{#equals \"good\" payload}}equals{{else}}not equals{{/equals}}"
            },
            partials: {
                includedPartial: "This is content coming from the partial."
            }
        }
    });
})();
