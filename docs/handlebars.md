# `gpii.express.hb`

This component adds [Handlebars](http://handlebarsjs.com/) rendering support to a `gpii.express` instance. As with
any [custom Express view engine](http://expressjs.com/en/advanced/developing-template-engines.html), this component
provides a renderer that can be used with the Express `Response` object's [`render` method](http://expressjs.com/en/4x/api.html#res.render).

This component is meant to be a direct child of a `gpii.express` instance, as shown here:

```javascript
fluid.defaults("my.grade.name", {
    gradeNames: ["gpii.express"],
    port: 9090,
    components: {
        hb: {
            type: "gpii.express.hb",
            options: {
                templateDirs: {
                    handlebars: "%gpii-handlebars/src/templates",
                    myPackage: {
                        path: "%my-package/src/templates",
                        priority: "before:handlebars"
                    }
                }
            }
        }
    }

});

my.grade.name();
```

## Component Options

| Option              | Type                  | Description |
| ------------------- | --------------------- | ----------- |
| `templateDirs`      | `{Array} or {String}` | A list of template directories that contain handlebars layouts, pages, and partials.  These can either be full paths or (better) paths relative to a particular package, as in `%gpii-handlebars/src/templates`. |
| `messageBundleDirs` | `{Array} or {String}` | A list of directories that contain message bundles (see the [i18n docs](i18n.md) for details).  These can either be full paths or (better) paths relative to a particular package, as in `%gpii-handlebars/src/templates`. |

To use this middleware, you need to make it aware of one or more directories that contain templates (typically via the
`options.config.express.views` option in your `gpii.express` configuration).  These options are passed to the underlying
[renderer component](renderer.md), see those docs for details.

## `gpii.express.hb.live`

This component grade extends `gpii.express.hb` and adds support for "live" reloading of templates.  It uses an instance
 of [`gpii.handlebars.watcher`](watcher.md) to watch for changes to all directories specified in `options.templateDirs`
 see above.  Whenever files are added, removed, or changed, the renderer's cache will be cleared and all partials
 will be reloaded.  This process typically takes around two seconds, mainly because we wait to be sure the template has
 been completely saved to disc.  See the [`gpii.handlebars.watcher`](watcher.md) docs for details.

Note that this grade takes care of reloading templates in the view engine.  The [error rendering
middleware](errorRenderingMiddleware.md), [single template middleware](singleTemplateMiddleware.md) and
["dispatcher"](dispatcher.md) all use the view engine, and do not need to be notified of updates separately.  The
["inline" middleware](inline.md) that delivers template content to client-side components does not use the view engine,
and needs to be explicitly told to reload its template content.  See [the "inline" middleware documentation](inline.md)
for details.
