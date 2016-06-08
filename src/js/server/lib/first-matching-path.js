/*

    A static function to go through a list of view directories) and confirm that a path (file, directory)
    exists.  It accepts a string for a single path segment or an array of path segments. This is intended to be used
    with `fluid.find`, as in:

    ```
    var firstDirWithLayout = fluid.find(dirs, gpii.express.hb.getPathSearchFn([subdir, name]));
    ```

    The return value is the full path to the first match.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var fs = require("fs");
var path = require("path");

fluid.registerNamespace("gpii.express.hb");
gpii.express.hb.getPathSearchFn = function (pathSegments) {
    var pathSegmentArray = fluid.makeArray(pathSegments);
    return function (dir) {
        var combinedPathSegments = fluid.makeArray(dir).concat(pathSegmentArray);
        var templatePath = path.join.apply(path, combinedPathSegments);
        return fs.existsSync(templatePath) ? templatePath : undefined;
    };
};
