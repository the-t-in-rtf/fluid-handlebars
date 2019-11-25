/* The client-side overlay for the i18n "message helper" used in rendering {{message}} content. */
/* eslint-env node */
"use strict";
var fluid  = fluid || require("infusion");

fluid.defaults("gpii.handlebars.helper.messageHelper.client", {
    gradeNames: ["gpii.handlebars.helper.messageHelper"],
    helperName: "messageHelper",
    model: {
        messages: {}
    },
    invokers: {
        "resolveMessage": {
            funcName: "gpii.handlebars.helper.messageHelper.resolveMessage",
            args:     ["{that}.model.messages", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // messages, messageKey, dataOrRootContext, rootContext
        }
    }
});
