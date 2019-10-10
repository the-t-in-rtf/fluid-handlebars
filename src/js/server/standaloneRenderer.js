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
    var templateMap = {};
    var resolvedPaths = gpii.express.hb.resolveAllPaths(that.options.templateDirs).reverse();
    fluid.each(resolvedPaths, function (resolvedTemplateDirPath) {
        fluid.each(that.options.templateSubdirs, function (subDir) {
            gpii.handlebars.standaloneRenderer.loadOneTemplateDir(that, resolvedTemplateDirPath, subDir, templateMap);
        });
    });

    gpii.handlebars.utils.deleteAndAddModelData(that, "templates", templateMap);
};

/**
 *
 * Load the contents of a single template subdirectory.
 *
 * @param {Object} that - The renderer component itself.
 * @param {String} resolvedTemplateDirPath - The path that contains the subdirectory.
 * @param {String} subDir - The name of the subdirectory.
 * @param {Object} templateMap - The accumulated set of templates so far, which will be evaluated and have new material merged with it.
 *
 */
gpii.handlebars.standaloneRenderer.loadOneTemplateDir = function (that, resolvedTemplateDirPath, subDir, templateMap) {
    var subDirPath = path.resolve(resolvedTemplateDirPath, subDir);
    if (fs.existsSync(subDirPath)) {
        var files = fs.readdirSync(subDirPath).filter(function (path) { return path.match(that.options.handlebarsRegexp); });
        fluid.each(files, function (singleFile) {
            var matches = singleFile.match(that.options.handlebarsRegexp);
            var templateKey = matches[1];
            if (!fluid.get(templateMap, [subDir, templateKey])) {
                var filePath = path.resolve(subDirPath, singleFile);
                var templateContent = fs.readFileSync(filePath, "utf8");
                fluid.set(templateMap, [subDir, templateKey], templateContent);
            }
        });
    }
};

gpii.handlebars.standaloneRenderer.render = function (that, templateKey, context) {
    // Derive the precise messages from the request.
    var messages = gpii.handlebars.i18n.deriveMessageBundleFromRequest(context.req, that.model.messageBundles, that.options.defaultLocale);
    var combinedContext = fluid.extend({}, { messages: messages}, context);

    return gpii.handlebars.renderer.common.render(that, templateKey, combinedContext);
};

gpii.handlebars.standaloneRenderer.renderWithLayout = function (that, templateKey, context) {
    // Derive the precise messages from the request.
    var messages = gpii.handlebars.i18n.deriveMessageBundleFromRequest(context.req, that.model.messageBundles, that.options.defaultLocale);
    var combinedContext = fluid.extend({}, { messages: messages }, context);

    return gpii.handlebars.renderer.common.renderWithLayout(that, templateKey, combinedContext);
};

fluid.defaults("gpii.handlebars.standaloneRenderer", {
    gradeNames: ["gpii.handlebars.renderer.common"],
    handlebarsRegexp: /(.+)\.(hbs|handlebars)$/i,
    templateSubdirs: ["layouts", "pages", "partials"],
    model: {
        templates: {},
        messageBundles: {}
    },
    components: {
        md: {
            type: "gpii.handlebars.helper.md.server"
        },
        messageHelper: {
            type: "gpii.handlebars.helper.messageHelper.server",
            options: {
                model: {
                    messageBundles: "{gpii.handlebars.standaloneRenderer}.model.messageBundles"
                }
            }
        }
    },
    invokers: {
        render: {
            funcName: "gpii.handlebars.standaloneRenderer.render",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
        },
        renderWithLayout: {
            funcName: "gpii.handlebars.standaloneRenderer.renderWithLayout",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
        }
    },
    listeners: {
        "onCreate.loadTemplates": {
            funcName: "gpii.handlebars.standaloneRenderer.loadTemplateDirs",
            args:     ["{that}"]
        }
    }
});
