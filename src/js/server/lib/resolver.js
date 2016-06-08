/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.hb");

/*

 A static function that uses `fluid.module.resolvePath` to resolve all paths in a string or an array of strings.

 Used to consistently resolve the path to template directories in the `handlebars`, `inline`, and `dispatcher`
 modules.

 Takes a string describing a single path, or an array of strings describing multiple paths.  Returns an array of
 resolved paths.

 If `pathStringOrArray `is undefined, an empty array will be returned.  As this function uses `fluid.transform` to
 modify the original data, `null` and `undefined` values that are passed as part of an array will result in an
 exception.

 */
gpii.express.hb.resolveAllPaths = function (pathStringOrArray) {
    return fluid.transform(fluid.makeArray(pathStringOrArray), fluid.module.resolvePath);
};
