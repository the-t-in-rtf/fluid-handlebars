# `gpii.handlebars.errorRenderingMiddleware`

This component is an instance of `gpii.express.middleware.error` (see that package for details).  It uses the default
renderer associated with your `gpii.express` instance to deliver an error.  To use this grade, you must have
`gpii.handlebars` loaded in your `gpii.express` instance (see the tests for examples).

## Component Options

| Option        | Type       | Description |
| ------------- | ---------- | ----------- |
| `contentType` | `{Array}`  | An array of `{String}` values this handler accepts.  Defaults to `text/html`.|
| `namespace`   | `{String}` | The namespace other component can use to order themselves relative to this grade.  |
| `priority`    | `{String}` | The priority this component has relative to its peers.  See the [Fluid priority documentation](http://docs.fluidproject.org/infusion/development/Priorities.html) for details. |
| `statusCode`  | `{Number}` | The [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) to send to the user.  Defaults to `500` (server error). |
| `templateKey` | `{String}` | The Handlebars template key to use in rendering our response.  Is resolved relative to `options.templateDirs` in your `gpii.handlebars` instance ([see those docs for details](handlebars.md)).  Note that this must include the containing directory, name, i.e. `pages/templateName`|

## Component Invokers

### `{that}.middleware(error, request, response, next)`

* `error`: The error payload returned by upstream middleware.  See [the `gpii-express`
  documentation](https://github.com/GPII/gpii-express/blob/master/docs/middleware.md#error-handling-middleware) for
  details.
* `request`: An object representing the individual user's request.  See [the `gpii-express`
  documentation](https://github.com/GPII/gpii-express/blob/master/docs/express.md#the-express-request-object) for
  details.
* `response`: The response object, which can be used to send information to the requesting user.  See [the
  `gpii-express`
  documentation](https://github.com/GPII/gpii-express/blob/master/docs/express.md#the-express-response-object) for
  details.
* `next`: The next Express middleware or router function in the chain.  See [the `gpii-express` documentation for
  details](https://github.com/GPII/gpii-express/blob/master/docs/middleware.md#what-is-middleware).
* Returns: Nothing.

This invoker fulfills the standard contract for a `gpii.express.middleware.error` component.  It first checks to see
if the `Accept` headers for `request` match `options.contentType` (see above).  If the request matches our content type,
the error is rendered using `options.templateKey` (see above) and send to the user.  If the request does not match our
content type, it is passed along to the next piece of middlware in the chain using `next(err)`.

Note that, as with other code that uses `request.accepts()`, if the request has no `Accept` header, it will be handled
by the first instance of this grade that is given the chance to handle the request.  Thus, as with all middleware and
routers, it is important to use the `priority` and `namespace` options (see above) to control the order in which
middleware is called.