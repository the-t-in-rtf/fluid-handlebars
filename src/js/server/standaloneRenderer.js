/*

    Our common handlebars renderer, used for rendering mail templates as well as within our own Express view engine.

    See the docs for details: https://github.com/fluid-project/fluid-handlebars/blob/master/docs/standaloneRenderer.md

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.registerNamespace("fluid.handlebars.standaloneRenderer");

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
fluid.handlebars.standaloneRenderer.loadTemplateDirs = function (that) {
    var templateMap = {};
    var resolvedPaths = fluid.handlebars.resolvePrioritisedPaths(that.options.templateDirs);
    fluid.each(resolvedPaths, function (resolvedTemplateDirPath) {
        fluid.each(that.options.templateSubdirs, function (subDir) {
            fluid.handlebars.standaloneRenderer.loadOneTemplateDir(that, resolvedTemplateDirPath, subDir, templateMap);
        });
    });

    fluid.handlebars.utils.deleteAndAddModelData(that, "templates", templateMap);
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
fluid.handlebars.standaloneRenderer.loadOneTemplateDir = function (that, resolvedTemplateDirPath, subDir, templateMap) {
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

fluid.handlebars.standaloneRenderer.render = function (that, templateKey, context) {
    // Derive the precise messages from the request.
    var messages = fluid.handlebars.i18n.deriveMessageBundleFromRequest(context.req, that.model.messageBundles, that.options.defaultLocale);
    var combinedContext = fluid.extend(true, {}, { messages: messages}, context);

    return fluid.handlebars.renderer.common.render(that, templateKey, combinedContext);
};

fluid.handlebars.standaloneRenderer.renderWithLayout = function (that, templateKey, context) {
    // Derive the precise messages from the request.
    var messages = fluid.handlebars.i18n.deriveMessageBundleFromRequest(context.req, that.model.messageBundles, that.options.defaultLocale);
    var combinedContext = fluid.extend(true, {}, { messages: messages }, context);

    return fluid.handlebars.renderer.common.renderWithLayout(that, templateKey, combinedContext);
};

fluid.defaults("fluid.handlebars.standaloneRenderer", {
    gradeNames: ["fluid.handlebars.renderer.common"],
    handlebarsRegexp: /(.+)\.(hbs|handlebars)$/i,
    templateSubdirs: ["layouts", "pages", "partials"],
    model: {
        templates: {},
        messageBundles: {}
    },
    components: {
        md: {
            type: "fluid.handlebars.helper.md.server"
        },
        messageHelper: {
            type: "fluid.handlebars.helper.messageHelper.server",
            options: {
                model: {
                    messageBundles: "{fluid.handlebars.standaloneRenderer}.model.messageBundles"
                }
            }
        }
    },
    invokers: {
        render: {
            funcName: "fluid.handlebars.standaloneRenderer.render",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
        },
        renderWithLayout: {
            funcName: "fluid.handlebars.standaloneRenderer.renderWithLayout",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
        }
    },
    listeners: {
        "onCreate.loadTemplates": {
            funcName: "fluid.handlebars.standaloneRenderer.loadTemplateDirs",
            args:     ["{that}"]
        }
    }
});
