# `fluid.handlebars.helper.initBlock`

The `initBlock` Handlebars helper constructs a client side component given a list of grades, including all
wiring required to ensure that:

1. Only one renderer is created and used in all child components
2. Child components are only created once templates have been loaded.

The end result is a nested structure, starting with a `pageComponent` variable that has a global renderer.  This
component has a `requireRenderer` child component, which is created only when the templates are available, and holds
a `pageComponent` component constructed from the grades passed to the helper (see below).

## Component Options

| Option                  | Type       | Description |
| ----------------------- | ---------- | ----------- |
| `baseOptions`           | `Object`   | The base options to be included with every generated component.  These are [not expanded or merged](http://docs.fluidproject.org/infusion/development/OptionsMerging.html#structure-of-the-merge-policy-object). |
| `contextToOptionsRules` | `{Object}` | [Model transformation rules](http://docs.fluidproject.org/infusion/development/ModelTransformationAPI.html) that control what data is available when generating the client-side component (see below). |

The rules in `options.baseOptions` are included with every generated component.  The rules in
`options.contextToOptionsRules` can override or add options based on the Handlebars context.

Note that because the list of variables to be passed through is configured in a single server-side component, you
will need to list every variable that you might want to pass through in `options.contextToOptionsRules`.  As the model
transformation system strips empty values, if a variable is omitted from the handlebars context, it will not be
merged with `options.baseOptions`.

Let's say you have options like the following:

```snippet
baseOptions: {
  staticOption: true,
  model: {
    user: false
  }
},
contextToOptionsRules: {
  req:  "req",
  model: {
    user: "user"
  }
}
```

Let's also assume that your context (see below for details) looks something like:

```json5
{
  staticOption: false,
  user: {
    username: "user1"
  }
}
```

The resulting client-side component will have options like the following:

```json5
{
  staticOption: true,
  user: {
    username: "user1"
  }
}
```

The `user` variable is passed through to the generated model.  The `staticOption` set in `baseOptions` is preserved, as
`contextToOptionsRules` contains no rules to pass through that data.  The variable `options.req` was not set because
our context did not provide a `req` variable.

Each of the components in this package that renders content provides a mechanism to control what context data is
exposed.  Check the following docs for more details:

* [Dispatcher](dispatcher.md)
* [Error Rendering Middleware](errorRenderingMiddleware.md)
* [Renderer](renderer.md)
* [Single Template Middleware](singleTemplateMiddleware.md)

## Client-side Usage

The markup required to use this in a Handlebars template consists of the helper itself and one or more named grades, as
in the following example:

```handlebars
{{{initblock "grade1", "grade2", "grade3"}}}
```

As with `gradeNames` in general, grades that appear earlier in the list of arguments have the most precedence.
If you are working with grades that override invokers or other options, you should put the most basic grades at the
end of your list of arguments, and any grades that override or add functionality further to the left.  If all three
of the grades in this example have an invoker with the same name, the invoker defined in `grade1` would be called.

Please note, in the example above that the triple braces are required in order to prevent Handlebars from escaping
the generated code and presenting it as text.  Note also that this helper is only meant to be used on the server
side, and will not work at all with the client side Handlebars infrastructure.

## Client-side Requirements

The generated code will only work if you have included Fluid itself and any client-side code your grades depend on.
At a minimum, you will need to include the following client-side scripts from this package:

* src/js/client/hasRequiredOptions.js
* src/js/client/ajaxCapable.js
* src/js/client/md-client.js
* src/js/client/renderer.js
* src/js/client/templateManager.js
* src/js/client/templateAware.js

Most of the examples in this package make use of one or more of the following grades as well:

* src/js/client/templateFormControl.js
* src/js/client/templateMessage.js
* src/js/client/templateRequestAndRender.js

These grades require the client-side binder component provided by the [`fluid-binder`](http://github.com/fluid-project/fluid-binder/)
component.
