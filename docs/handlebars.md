# `gpii.express.hb`

This component adds [Handlebars](http://handlebarsjs.com/) rendering support to a `gpii.express` instance. As with
any [custom Express view engine](http://expressjs.com/en/advanced/developing-template-engines.html), this component
provides a renderer that can be used with the Express `Response` object's [`render` method](http://expressjs.com/en/4x/api.html#res.render).

This component is meant to be a direct child of a `gpii.express` instance, as shown here:

```
fluid.defaults("my.grade.name", {
    gradeNames: ["gpii.express"],
    port: 9090,
    components: {
        hb: {
            type: "gpii.express.hb",
            options: {
                templateDirs: ["%gpii-handlebars/src/templates", "%my-package/src/templates"]
            }
        }
    }

});

my.grade.name();
```

# Component Options

| Option         | Type             | Description |
| -------------- | ---------------- | ----------- |
| `templateDirs` | `Array | String` | A list of template directories that contain handlebars layouts, pages, and partials.  These can either be full paths or (better) paths relative to a particular package, as in `%gpii-handlebars/src/templates`. |

To use this middleware, you need to make it aware of one or more directories that contain templates (typically via the
`options.config.express.views` option in your `gpii.express` configuration.  These options are passed to the underlying
[renderer component](standaloneRenderer.md), see those docs for details.