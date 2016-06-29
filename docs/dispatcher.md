# `gpii.handlebars.dispatcherMiddleware`

[`gpii.express.middleware`](https://github.com/GPII/gpii-express/blob/master/docs/middleware.md) that renders content
using a page template and/or layout based on the URL path.  The dispatcher turns the last part of a path (such as
`/dispatcher/foo`) into a template name (such as `foo`), and then attempts to find and render that template.  The
templates available to the dispatcher are  configured in the options for the enclosing [`gpii.express.hb`](handlebars.md)
instance.

If a template matching the path can be found, it will be used to render the page.  If the last part of the path is
omitted, the template configured by `options.defaultTemplate` will be used.  If a layout with the same name is found,
that will be used, otherwise, the layout found at `options.defaultLayout` will be used.

If the last part of the path is supplied but does not match any templates, a 404 error is passed along the middleware
chain, which will be handled by the next piece of [error middleware](https://github.com/GPII/gpii-express/blob/master/docs/errorMiddleware.md)
in the stack.

# Component Options

This component supports the options available for any [`gpii.express.middleware`](https://github.com/GPII/gpii-express/blob/master/docs/middleware.md)
instance.  In addition, this component supports the following configuration options:

| Option                  | Type     | Description |
| ----------------------- | -------- | ----------- |
| `defaultTemplate`       | `String` | The name of the default template to use when the template name is omitted, minus the extension. |
| `defaultLayout`         | `String` | The name of the default layout to use when no template matching `:template` is found.  Defaults to `index.handlebars` |
| `rules.contextToExpose` | `Object` | [Model transformation rules](docs.fluidproject.org/infusion/development/ModelTransformationAPI.html) that control what information is exposed to the renderer. The rules can make use of the request object (`req`) and the dispatcher's model (`model`). |

# Component Invokers

## `{that}.middleware(request, response, next)`
* `request {Object}` An Express Request object (see [the docs](https://github.com/GPII/gpii-express/blob/master/docs/express.md) for details).
* `response {Object}` An Express Response object (see [the docs](https://github.com/GPII/gpii-express/blob/master/docs/express.md) for details).
* `next`: The next piece of middleware in the chain.  Used to report errors if needed.
* Returns: Nothing.

Implements the `middleware` function required by the [`gpii.express.middleware` grade](https://github.com/GPII/gpii-express/blob/master/docs/middleware.md)