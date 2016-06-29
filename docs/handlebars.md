# `gpii.express.hb`

Middleware that adds [Handlebars](http://handlebarsjs.com/) rendering support to a `gpii.express` instance.  It is a
wrapper around [`express-handlebars`](https://github.com/ericf/express-handlebars).  Like that package, it provides a
renderer that can be used with the Express `Response` object.  That renderer expects to start with a layout, and to
replace the `{{body}}` variable in that layout with the contents of a template (`foo.handlebars` in our example).
Templates can reference other templates called "partials", using notation like `{{>partial}}` or `{{>partial variable}}`.
These references are replaced with the context of the partial, rendered using either a supplied variable or the current
context.

To add this to your `gpii.express` instance, you would use options like the following:

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
`options.config.express.views` option in your `gpii.express` configuration.  Each of these view directories can have the
following subdirectories:

1. `layouts`
2. `pages`
3. `partials`

The handlebars middleware supports inheritance between multiple view directories.  Layouts, pages and partials will be
rendered from the first matching view directory.

# Adding block helpers

Child components of this grade that extend the [`gpii.express.helper`](helper.md) grade are made available as block
helpers that can be used when rendering content.  By default, this grade includes all of the helpers provided by this
package.  See the [helpers documentation](helpers.md) for details.