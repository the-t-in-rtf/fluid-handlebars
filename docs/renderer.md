# The Renderer

## `gpii.handlebars.renderer.common`

The underlying base grade common to both the Node and browser renderer grades.  Although this grade is able to render
content, it does not have access to the [markdown helper](mdHelper.md).  To use that helper, you need to use one of the
Node or Browser renderer grades described below.

### Component Options

| Option                 | Type       | Description |
| ---------------------- | ---------- | ----------- |
| `defaultLayout`        | `String`   | The layout to use when none is specified (see the `renderWithLayout` invoker below).  Defaults to `main`. |
| `templates` (required) | `{Object}` | A map of layouts, pages, and partials, keyed by template name. (see below) |
| `messages`             | `{Object}` | A map of message keys and string templates, see below.  Defaults to an empty object, i.e. no message keys or string templates. |

The `templates` option is expected to contain raw template content, keyed by template name, and organized into
groups of "layouts", "pages", and "partials".  This layout exactly corresponds to the directory structure expected
by [express-handlebars](https://github.com/ericf/express-handlebars).  


### Component Invokers

#### `{that}.render(templateKey, context, [localeOrLanguage])`

* `templateKey`: A `{String}` representing the name of the template we will render (does not need to have the
  `.handlebars` suffix, which is implied).
* `context`: An `{Object}` representing data that can be referenced from within the template.
* `localeOrLanguage`:  An optional `{String}` representing the locale or language to use when rendering content (for example, using the `{{message}}` helper).
* Returns: The rendered content.

Render a template without an enclosing layout, as shown here:

```javascript
fluid.defaults("my.localisedRenderer.component", {
    gradeNames: ["gpii.handlebars.renderer"],
    templates: {
        pages: {
            localisedPage: "<p>{{message-helper key}}</p>"
        },
        partials: {}
    },
    messages: {
        "hello-message-key": "Hello, %mood world."
    }
});

var renderer = my.localisedRenderer.component();

console.log(renderer.render("localisedPage", { key: "hello-message-key", mood: "variable"})); // logs `Hello, variable world.`

```

This example also demonstrates the use of message bundles and the [`{{message-helper}}` helper](i18n.md).

#### `{that}.renderWithLayout(templateKey, context, [localeOrLanguage])`

* `templateKey`: A `{String}` representing the name of the template we will render (does not need to have the
  `.handlebars` suffix, which is implied).
* `context`: An `{Object}` representing data that can be referenced from within the template.
* `localeOrLanguage`:  An optional `{String}` representing the locale or language to use when rendering content (for example, using the `{{message}}` helper).
* Returns: The rendered content.

Render a template with an enclosing layout.  The layout defaults to "main", which just includes the body of the page.
You can specify a layout within the context by passing a template key (relative to `options.templates.layouts`) as
the top-level `layout` variable, as shown here:


```javascript
fluid.defaults("my.renderer.component", {
    gradeNames: ["gpii.handlebars.renderer"],
    templates: {
        layouts: {
            main: "<p>Content from the layout.</p>\n{{body}}"
        },
        pages: {
            myPage: "<p>Content from the page.</p>\n{{>myPartial}}"
        },
        partials: {
            myPartial: "<p>Content from the partial.</p>\n<p>Value: {myVariable}}</p>"
        }
    }
});

var renderer = my.renderer.component();

console.log(renderer.renderWithLayout("myPage", { myVariable: "my value" }));

/*

    Logs:
    
    <p>Content from the layout.</p>
    <p>Content from the page.</p>
    <p>Content from the partial.</p>
    <p>Value: {myVariable}}</p>

 */

```

## Browser Renderer Grades

### `gpii.handlebars.renderer`

A client-side module that provides various template handling capabilities, including rendering content and placing
it in the DOM relative to a specified element.

Like the server-side handlebars grade `gpii.express.hb`, the client-side renderer can use
[Handlebars block helpers](http://handlebarsjs.com/block_helpers.html).  In this case, our helpers are expected to be
components with the grade `gpii.handlebars.helper`.  These will automatically be wired in to this component when it is
created.

The base grade does not have the required template data by default. You are expected either to use the
`gpii.handlebars.renderer.standalone` grade and provide raw template data, or to use the
`gpii.handlebars.renderer.serverAware` grade and communicate with a server that will return the template content.  See
below for details on those grades.

All variations of this component require [Handlebars.js](http://handlebarsjs.com/).
[Markdown-it](https://markdown-it.github.io/markdown-it/#MarkdownIt.new) is required if you want to render markdown
using the `{{md}}` helper (see the [README file](../README.md) for details on helpers).

#### Component Options

This grade has no unique options.

#### Component Invokers

##### `{that}.after(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and insert the results after `element` using
[`element.after`](https://api.jquery.com/after/).

##### `{that}.append(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and append the results to the endof the HTML content of `element`
using [`element.append`](https://api.jquery.com/append/).

##### `{that}.before(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and insert the results before `element` using
[`element.before`](https://api.jquery.com/before).

##### `{that}.html(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and replace the HTML content of `element` using
[`element.html`](https://api.jquery.com/html/).

##### `{that}.prepend(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and prepend the results to the beginning of the HTML content of
`element` using [`element.prepend`](https://api.jquery.com/prepend/).

##### `{that}.replaceWith(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see above) and replace `element` completely with the results using
[`element.replaceWith`](https://api.jquery.com/replaceWith/).

### `gpii.handlebars.renderer.serverAware`

This is an extension of the above `gpii.handlebars.renderer` grade which communicates with an instance of
`gpii.handlebars.inlineTemplateBundlingMiddleware` on startup and wires the templates returned into itself.

#### Component Options

| Option                   | Type       | Description |
| ------------------------ | ---------- | ----------- |
| `templateUrl` (required) | `{String}` | The URL (relative or absolute) where our template content can be retrieved. |

### `gpii.handlebars.renderer.serverMessageAware`

This is an extension of the above `gpii.handlebars.renderer.serverAware` grade, which, in addition to loading templates
as described above, communicates with an instance of `gpii.handlebars.inlineMessageBundlingMiddleware` on startup and
wires the message bundles into itself.  You must use this grade to make effective use of the `{{messageHelper}}` helper
(see the [i18n docs](i18n.md) for details).

#### Component Options

In addition to the options for `gpii.handlebars.renderer.serverAware`, this grade supports the following options:

| Option                        | Type       | Description |
| ----------------------------- | ---------- | ----------- |
| `messageBundleUrl` (required) | `{String}` | The URL (relative or absolute) where our message bundle content can be retrieved. |

## Node Renderer Grades

## `gpii.handlebars.standaloneRenderer`

The core renderer designed both for use as [an Express view engine](http://expressjs.com/en/advanced/developing-template-engines.html),
and in node contexts outside of Express, for example, when rendering mail templates.

### Component Options

| Option         | Type             | Description |
| -------------- | ---------------- | ----------- |
| `templateDirs` | `Array | String` | A list of template directories that contain handlebars layouts, pages, and partials.  These can either be full paths or (better) paths relative to a particular package, as in `%gpii-handlebars/src/templates`.   Please note, if multiple directories contain layouts, pages, or partials with the same name, the highest-index directory in the array takes precedence. |

#### Template Directory Layout

When Express provided its own view engines, it followed a particular convention that we also honor.  Within each directory
specified in `options.templateDirs` (see above), there is expected to be one or more of the following subdirectories:

1. `pages`: Contains "pages", which represent the "body" of a document when used with `renderWithLayout`, or the entire
   document when used with `render`.  See below for details.
2. `layouts`: Contains "layouts", templates that generate the markup surrounding the "body".  Used with
   `renderWithLayout`.
3. `partials`: Contains "[partials](http://handlebarsjs.com/partials.html)", templates that can be used within "pages"
   or "layouts" using notation like `{{>my-partial-name}}`.

## Adding block helpers

Child components of this grade that extend the [`gpii.handlebars.helper`](helper.md) grade are made available as block
helpers that can be used when rendering content.  By default, this grade includes all of the helpers provided by this
package, with the exception of the `initBlock` helper used within the view engine..  See the
[helpers documentation](helpers.md) for details.

## Internationalisation and Localisation

The renderer includes the [messageHelper helper](i18n.md), which can be used to internationalise and localise template
content.  In order for the renderer to have access to the necessary message templates, you are expected to populate this
component's `messages` member with a single message bundle.  In most cases you will want to use the 
`gpii.handlebars.i18n.messageLoader` grade described [in the i18n documentation](i18n.md) to populate this.