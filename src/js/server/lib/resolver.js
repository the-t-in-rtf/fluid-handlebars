/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.hb");

/**
 *
 * A static function that uses `fluid.module.resolvePath` to resolve all paths in a string or an array of strings.
 *
 * Used to consistently resolve the path to template directories in the `handlebars`, `inline`, and `dispatcher`
 * modules.
 *
 * Takes a string describing a single path, or an array of strings describing multiple paths.  Returns an array of
 * resolved paths.
 *
 * @param {Array<String>|Map<String>} toResolve - A map or array of paths to resolve.
 * @return {Array<String>} - An array of resolved paths.
 *
 */
gpii.express.hb.resolveAllPaths = function (toResolve) {
    return fluid.values(fluid.transform(toResolve, fluid.module.resolvePath));
};
