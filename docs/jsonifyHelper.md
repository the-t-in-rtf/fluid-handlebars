# `gpii.handlebars.helper.jsonify`

This component is a [Handlebars helper](http://handlebarsjs.com/block_helpers.html) that allows us to output JSON
structures as part of rendered content.  By default, object content is replaced with the literal value `[Object object]`
onscreen.  You can display the contents of the object using the helper and code like:

`{{{jsonify VARIABLE}}}`

The triple braces are used to preserve ampersands and other characters that would otherwise be escaped by Handlebars.
If you want to escape these characters (for example, when setting the value of a `textarea`), you would use double
braces, as in:

`{{jsonify VARIABLE}}`

This functionality is wired into `gpii.express.handlebars` by default.

## Component Options

| Option             | Type         | Description |
| ------------------ | ------------ | ----------- |
| `replacer`         | `{Function}` | The "replacer" function that `JSON.stringify` should use. Defaults to `null`. |
| `space`            | `{Number}`   | The number of spaces to use in indenting the string output.  Defaults to `2`. |
| `stringifyStrings` | `{Boolean}`  | Whether to stringify values that are already strings (i.e. enclosing them in quotes).  Defaults to `false`. |

You can also pass custom options as key value pairs, as in:

```snippet
with quotes:    {{{jsonify VARIABLE stringifyStrings=true}}}

without quotes: {{{jsonify VARIABLE stringifyStrings=false}}}

no spaces:      {{{jsonify VARIABLE space=0}}}
```

Note that the options passed to the helper always take precedence over the component options.