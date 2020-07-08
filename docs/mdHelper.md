# `fluid.handlebars.helper.md`

This component is a [Handlebars helper](http://handlebarsjs.com/block_helpers.html) that allows us to render Markdown
content as HTML.  This helper is wired into `fluid.express.handlebars` by default.  Here are examples of how you might
use it in a handlebars template:

```handlebars
{{md variable}}

{{md "string value"}}

{{{md "This works.\n<p>This also works.</p>"}}}

```

The last example, in which HTML and markdown are mixed, will only work if:

1. You have passed the appropriate options to the helper (see below).
2. You use triple braces so that HTML content is not escaped by handlebars.

## Component Options

| Option                   | Type        | Description |
| ------------------------ | ----------- | ----------- |
| `markdownItOptions`      | `{Object}`  | The options to pass to Markdown-it when creating the renderer. See [the Markdown-it documentation](https://markdown-it.github.io/markdown-it/#MarkdownIt.new) for details. |
| `markdownItOptions.html` | `{Boolean}` | Whether to allow raw HTML.  Defaults to `false`.  See example below. |

## Enabling HTML within Markdown content

If you want to simply enable HTML content and otherwise use the defaults for `fluid.express.handlebars`, you can use the
[`distributeOptions`](http://docs.fluidproject.org/infusion/development/IoCSS.html) mechanism as shown in the following
example:

```javascript
fluid.defaults("my.express.instance", {
    gradeNames: ["fluid.express"],
    distributeOptions: {
        record: true,
        target: "{that fluid.handlebars.helper.md}.options.markdownItOptions.html"
    },
    components: {
        handlebars: {
            type: "fluid.express.handlebars"
        }
    }
});
```
