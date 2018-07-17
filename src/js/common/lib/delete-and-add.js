/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.handlebars.utils");

/**
 *
 * Ensure that message bundles and the like are completely cleaned out before saving new data.  Ensures that the change
 * occurs in a single transaction.
 *
 * @param {Object} modelComponent - The modelComponent.
 * @param {String|Array<String>} path - The path to the model variable to change.
 * @param {Any} value - The value to set the model variable to.
 *
 */
gpii.handlebars.utils.deleteAndAddModelData = function (modelComponent, path, value) {
    var transaction = modelComponent.applier.initiate();
    transaction.fireChangeRequest({path: path, type: "DELETE"});
    transaction.fireChangeRequest({path: path, type: "ADD", value: value});
    transaction.commit();
};
