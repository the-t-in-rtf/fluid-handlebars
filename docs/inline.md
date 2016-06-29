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


