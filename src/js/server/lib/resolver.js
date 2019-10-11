/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.handlebars");



/**
 *
 * @typedef PrioritisedPathDef
 * @property {String} [priority] - The priority for this entry in the final array, relative to other path definitions.
 * @property {String} [namespace] - The namespace that other entries can use to express their priority.
 * @property {String} path - A package-relative path to be resolved.
 *
 */

/**
 *
 * A static function that uses `fluid.module.resolvePath` to resolve all paths, and return them ordered by priority.
 *
 * (See https://docs.fluidproject.org/infusion/development/Priorities.html)
 *
 * Used to consistently resolve the path to template and message bundle directories in the `handlebars`, `inline`, and
 * `dispatcher` modules.
 *
 * Takes a string describing a single path, or an array of strings describing multiple paths.  Returns an array of
 * resolved paths.
 *
 * @param {Object<PrioritisedPathDef>|Object<String>} pathsToResolve - A map of paths to resolve.
 * @return {Array<String>} - An array of resolved paths.
 *
 */
gpii.handlebars.resolvePrioritisedPaths = function (pathsToResolve) {
    // Make sure that any short form (string) paths are resolved to structured path defs.
    var longFormPathDefs = fluid.transform(pathsToResolve, function (pathDef) {
        if (fluid.get(pathDef, "path")) {
            return pathDef;
        }
        else {
            return { path: pathDef };
        }
    });
    var prioritisedPathDefs = fluid.parsePriorityRecords(longFormPathDefs, "resource directory");
    var resolvedPaths = fluid.transform(prioritisedPathDefs, function (pathDef) {
        var pathToResolve = fluid.get(pathDef, "path") || pathDef;
        return fluid.module.resolvePath(pathToResolve);
    });
    return resolvedPaths;
};
