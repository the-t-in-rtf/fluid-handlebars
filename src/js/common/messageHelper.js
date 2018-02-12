/*

    A handlebars helper that interpolates variable content into i18n/l10n message strings and produces string output.

    See the docs for details: https://github.com/GPII/gpii-handlebars/blob/master/docs/i18n.md

 */
/* eslint-env node */
"use strict";
var fluid  = fluid || require("infusion");
var gpii   = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.handlebars.helper.messageHelper");

gpii.handlebars.helper.messageHelper.getHelper = function () {
    return function (messageKey, data) {
        if (arguments.length < 3) {
            fluid.fail("You must call the 'messageHelper' helper with a message key and context containing at least the message bundles.");
        }
        else {
            var resolver = fluid.messageResolver({ messageBase: data.messages });
            return resolver.resolve(messageKey, data);
        }
    };
};

fluid.defaults("gpii.handlebars.helper.messageHelper", {
    gradeNames: ["gpii.handlebars.helper"],
    helperName: "messageHelper",
    invokers: {
        "getHelper": {
            "funcName": "gpii.handlebars.helper.messageHelper.getHelper",
            "args":     ["{that}"]
        }
    }
});
