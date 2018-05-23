# `gpii.handlebars.standaloneRenderer`

The core renderer designed both for use as [an Express view engine](http://expressjs.com/en/advanced/developing-template-engines.html),
and in node contexts outside of Express, for example, when rendering mail templates.

# Component Options

| Option                | Type             | Description |
| --------------------- | ---------------- | ----------- |
| `defaultLayout`       | `String`         | The layout to use when none is specified (see the `renderWithLayout` invoker below).  Defaults to `main`. |
| `handlebarsExtension` | `String`         | The extension used for all our templates.  Defaults to `handlebars`. |
| `templateDirs`        | `Array | String` | A list of template directories that contain handlebars layouts, pages, and partials.  These can either be full paths or (better) paths relative to a particular package, as in `%gpii-handlebars/src/templates`.   Please note, if multiple directories contain layouts, pages, or partials with the same name, the right-most directory takes precedence. |

## Template Directory Layout

When Express provided its own view engines, it followed a particular convention that we also honor.  Within each directory
specified in `options.templateDirs` (see above), there is expected to be one or more of the following subdirectories:

1. `pages`: Contains "pages", which represent the "body" of a document when used with `renderWithLayout`, or the entire document when used with `render`.  See below for details.
2. `layouts`: Contains "layouts", templates that generate the markup surrounding the "body".  Used with `renderWithLayout`.
3. `partials`: Contains "[partials](http://handlebarsjs.com/partials.html)", templates that can be used within "pages" or "layouts" using notation like `{{>my-partial-name}}`.

# Component Invokers

## `{that}.render(templateName, context)`
* `templateName {String}` A full path to the template to use, or a "key", which is the filename (minus extension) relative to the "pages" subdirectory in one of the view directories specified in `options.templateDirs` (see above).
* `context {Object}` The "context" to expose to handlebars when rendering content.  See below.
* Returns: Nothing.

This function renders the variable content specified in `context` using the given `templateKey`.  Let's assume we have
a very simple template called `myPageTemplate.handlebars`, stored in the "pages" subdirectory of one of our `templateDirs`:

```
From that point on, she was known simply as the woman with no {{name}}.
```

Let's assume that we call the renderer using a code snippet like the following:

```
var renderedContent = renderer.render("myPageTemplate", { name: "Patience" });
// "From that point on, she was known simply as the woman with no Patience."
```

For more details about partials, iterative and conditional blocks, see the [Handlebars documentation](http://handlebarsjs.com/).

## `{that}.renderWithLayout(templateName, context)`

* `templateName {String}` See above.
* `context {Object}` See above for general details, and see below for details about passing layout hints as part of the context.
* Returns: Nothing.

A long-running convention of early versions of Express and various view engines is to provide a separate "layout"
template, and to render an individual "page" as the "body" of the "layout".  This function provides comparable support.

Continuing the above example, let's assume we have a `main.handlebars` layout stored in one of our `templateDirs`, which
looks like this:

 ```
 <html><head><title>The Story of {{name}}</title><body>{{body}}</body></html>
 ```

Calling `renderer.renderWithLayout("myPageTemplate", { name: "Patience"})` will generate a simple HTML document whose
body is the same as the previous output.  As suggested in the example, our implementation allows the same context
variables passed to the page to be used in the layout as well.

The layout defaults to `options.defaultLayout`, you can change this on the fly by passing a layout key as part of your
`context`, as in `renderer.renderWithLayout("myPageTemplate", { name: "Patience",  layout: "otherLayout"})`

# Adding block helpers

Child components of this grade that extend the [`gpii.handlebars.helper`](helper.md) grade are made available as block
helpers that can be used when rendering content.  By default, this grade includes all of the helpers provided by this
package, with the exception of the `initBlock` helper used within the view engine.  See the
[helpers documentation](helper.md) for details.
