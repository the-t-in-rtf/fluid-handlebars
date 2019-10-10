/*

    A handlebars helper that interpolates variable content into i18n/l10n message strings and produces string output.

    See the docs for details: https://github.com/GPII/gpii-handlebars/blob/master/docs/i18n.md

 */
/* eslint-env node */
"use strict";
var fluid  = fluid || require("infusion");
var gpii   = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.handlebars.helper.messageHelper.server");

gpii.handlebars.helper.messageHelper.server.resolveMessage = function (messageBundles, messageKey, dataOrRootContext, rootContext) {
    // If we have a third argument, then the second argument is our "data".  Otherwise, we use the root context (equivalent to passing "." as the variable).
    var data = rootContext ? dataOrRootContext : fluid.get(dataOrRootContext, "data.root");

    // On the server side, the helper itself cannot be instantiated with a set list of request-specific messages.
    // Rather, we rely on the renderer to derive and stash the messages in the context.
    return gpii.handlebars.helper.messageHelper.resolveMessage(data.messages, messageKey, dataOrRootContext, rootContext);
};

fluid.defaults("gpii.handlebars.helper.messageHelper.server", {
    gradeNames: ["gpii.handlebars.helper.messageHelper"],
    helperName: "messageHelper",
    model: {
        messageBundles: {}
    },
    invokers: {
        "resolveMessage": {
            funcName: "gpii.handlebars.helper.messageHelper.server.resolveMessage",
            args:     ["{that}.model.messageBundles", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // messages, messageKey, dataOrRootContext, rootContext
        }
    }
});
