# `gpii.handlebars.inlineTemplateBundlingMiddleware`

Middleware that combines all available Handlebars templates into a single bundle that can be downloaded and used
by the client-side renderer.

Say that we have a `views` directory that contains the following content:

* `views/pages/main.handlebars`
* `views/pages/alternate.handlebars`
* `views/layouts/main.handlebars`
* `views/partials/gewgaw.handlebars`

If this middleware were configured to use the `views` directory, it would return a payload like the following:

```
{
    "pages": {
        "main": "<p>Howdy.</p>",
        "alternate": "<p>{{>gewgaw}}</p>"
    },
    "layouts": {
        "main": "<html><body>{{body}}<body></html>"
    },
    "partials": {
        "gewgaw": "*insert bells and whistles*"
    }
}
```
The client-side [renderer.md](renderer) can work with this format and ensure that (for example) all partials are
available and that the right layout is used.

# Component Options

| Option         | Type             | Description |
| -------------- | ---------------- | ----------- |
| `templateDirs` | `Array | String` | A list of template directories that contain handlebars layouts, pages, and partials.  These can either be full paths or (better) paths relative to a particular package, as in `%gpii-handlebars/src/templates`. |


# Live Reloading

This middleware component provides a `loadTemplates` event that can be used to reload all template content from the
filesystem.  The component itself only makes use of this event on startup.  To enable "live" reloading, you will need
to fire the `loadTemplates` event whenever an associated ["watcher"](watcher.md) component detects a change, as in the
following example:

```$javascript
fluid.defaults("my.live.express", {
    gradeNames: ["gpii.express"],
    events: {
        onFsChange: null
    },
    listeners: {
        "onFsChange.reloadInlineTemplates": {
            func: "{inlineMiddleware}.events.loadTemplates.fire"
        }
    },
    components: {
        handlebars: {
            type: "gpii.express.hb.live",
            options: {
                templateDirs: "{my.live.express}.options.templateDirs",
                listeners: {
                    "onFsChange.notifyExpress": {
                        func: "{my.live.express}.events.onFsChange.fire"
                    }
                }
            }
        },
        inlineMiddleware: {
            type: "gpii.handlebars.inlineTemplateBundlingMiddleware",
            options: {
                templateDirs: "{my.live.express}.options.templateDirs"
            }
        }
    }
});
```