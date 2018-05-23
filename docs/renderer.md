# `gpii.handlebars.renderer`

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

## Component Options

The base grade does not have any configuration options.

## Component Invokers

### `{that}.after(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and insert the results after `element` using
[`element.after`](https://api.jquery.com/after/).

### `{that}.append(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and append the results to the endof the HTML content of `element`
using [`element.append`](https://api.jquery.com/append/).

### `{that}.before(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and insert the results before `element` using
[`element.before`](https://api.jquery.com/before).

### `{that}.html(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and replace the HTML content of `element` using
[`element.html`](https://api.jquery.com/html/).

### `{that}.prepend(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see below) and prepend the results to the beginning of the HTML content of
`element` using [`element.prepend`](https://api.jquery.com/prepend/).

### `{that}.render(templateKey, context)`

* `templateKey`: A `{String}` representing the name of the template we will render (does not need to have the
  `.handlebars` suffix, which is implied).
* `context`: An `{Object}` representing data that can be referenced from within the template.
* Returns: The rendered content.

### `{that}.replaceWith(element, templateKey, context)`

Call `{that}.render(templateKey, context)` (see above) and replace `element` completely with the results using
[`element.replaceWith`](https://api.jquery.com/replaceWith/).

## `gpii.handlebars.renderer.standalone`

This is an extension of the above `gpii.handlebars.renderer` grade which expects to be passed raw template data on
startup.

### Component Options

| Option                 | Type       | Description |
| ---------------------- | ---------- | ----------- |
| `templates` (required) | `{Object}` | A map of layouts, pages, and partials, keyed by template name. (see below) |
| `messages`             | `{Object}` | A map of message keys and string templates, see below.  Defaults to an empty object, i.e. no message keys or string templates. |

The `templates` option is expected to contain raw template content, keyed by template name, and organized into
groups of "layouts", "pages", and "partials".  This layout exactly corresponds to the directory structure expected
by [express-handlebars](https://github.com/ericf/express-handlebars).  For example:

```javascript
fluid.defaults("my.renderer.component", {
    gradeNames: ["gpii.handlebars.renderer.standalone"],
    templates: {
        layouts: {
            main: ">{{body}}<"
        },
        pages: {
            myPage: "){{>myPartial}(<"
        },
        partials: {
            myPartial: "]{{myVariable}}["
        }
    }
});

var renderer = my.renderer.component();

console.log(renderer.render("myPage", "payload")); // logs `>)]payload[(<`

```

To use message bundles and the [`{{message-helper}}` helper](i18n.md) with the standalone render, you might use
options like the following:

```javascript
fluid.defaults("my.localisedRenderer.component", {
    gradeNames: ["gpii.handlebars.renderer.standalone"],
    templates: {
        layouts: {
            main: "{{body}}"
        },
        pages: {
            localisedPage: "{{message-helper key}}"
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

## `gpii.handlebars.renderer.serverAware`

This is an extension of the above `gpii.handlebars.renderer` grade which communicates with an instance of
`gpii.handlebars.inlineTemplateBundlingMiddleware` on startup and wires the templates returned into itself.

### Component Options

| Option                   | Type       | Description |
| ------------------------ | ---------- | ----------- |
| `templateUrl` (required) | `{String}` | The URL (relative or absolute) where our template content can be retrieved. |

## `gpii.handlebars.renderer.serverMessageAware`

This is an extension of the above `gpii.handlebars.renderer.serverAware` grade, which, in addition to loading templates
as described above, communicates with an instance of `gpii.handlebars.inlineMessageBundlingMiddleware` on startup and
wires the message bundles into itself.  You must use this grade to make effective use of the `{{messageHelper}}` helper
(see the [i18n docs](i18n.md) for details).

### Component Options

In addition to the options for `gpii.handlebars.renderer.serverAware`, this grade supports the following options:

| Option                        | Type       | Description |
| ----------------------------- | ---------- | ----------- |
| `messageBundleUrl` (required) | `{String}` | The URL (relative or absolute) where our message bundle content can be retrieved. |
