/*

    Our common handlebars renderer, used for rendering mail templates as well as within our own Express view engine.

    See the docs for details: https://github.com/GPII/gpii-handlebars/blob/master/docs/standaloneRenderer.md

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.standaloneRenderer");

require("../common/renderer");

var fs   = require("fs");
var path = require("path");

/**
 *
 * Examine one or more template directory paths found at `that.options.templateDirs` and load any template content found
 * there.
 *
 * @param {Object} that - The renderer component itself.
 *
 */
gpii.handlebars.standaloneRenderer.loadTemplateDirs = function (that) {
    var handlebarsRegexp = /(.+)\.(hbs|handlebars)$/i;
    var templateMap = {};
    fluid.each(fluid.makeArray(that.options.templateDirs).reverse(), function (templateDirPath) {
        var resolvedTemplateDirPath = fluid.module.resolvePath(templateDirPath);
        fluid.each(["layouts", "pages", "partials"], function (subDir) {
            var subDirPath = path.resolve(resolvedTemplateDirPath, subDir);
            if (fs.existsSync(subDirPath)) {
                var files = fs.readdirSync(subDirPath).filter(function (path) { return path.match(handlebarsRegexp); });
                fluid.each(files, function (singleFile) {
                    var matches = singleFile.match(handlebarsRegexp);
                    var templateKey = matches[1];
                    if (!fluid.get(templateMap, [subDir, templateKey])) {
                        var filePath = path.resolve(subDirPath, singleFile);
                        var templateContent = fs.readFileSync(filePath, "utf8");
                        fluid.set(templateMap, [subDir, templateKey], templateContent);
                    }
                });
            }
        });
    });
    that.applier.change("templates", templateMap);
};

fluid.defaults("gpii.handlebars.standaloneRenderer", {
    gradeNames: ["gpii.handlebars.renderer.common"],
    model: {
        templates: {}
    },
    components: {
        md: {
            type: "gpii.handlebars.helper.md.server"
        }
    },
    listeners: {
        "onCreate.loadTemplates": {
            funcName: "gpii.handlebars.standaloneRenderer.loadTemplateDirs",
            args:     ["{that}"]
        }
    }
});
