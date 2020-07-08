# `fluid.handlebars.serverResourceAware`

This component uses the "resource loading" features of the Infusion framework to load the templates and message bundles
provided by the middleware in this package.  Once both are available, a client-side [renderer component](renderer.md)
is created.  The `afterRenderer` event is fired once the renderer is available.

For more examples of using this in depth, check out the `templateFormControl` grade or the client side tests.

## Component Options

This component has two options, that control how its resources are loaded.

| Option                | Type       | Description |
| --------------------- | ---------- | ----------- |
| `resources.message`   | `{Object}` | This is configured to load message bundles from `/messages` on the same hostname/port as the page itself uses.  See [the "Resource Loader" documentation](https://github.com/amb26/infusion-docs/blob/FLUID-6148/src/documents/ResourceLoader.md) for details on how to configure this option. |
| `resources.templates` | `{Object}` | This is configured to load message bundles from `/templates` on the same hostname/port as the page itself uses.  See [the "Resource Loader" documentation](https://github.com/amb26/infusion-docs/blob/FLUID-6148/src/documents/ResourceLoader.md) for details on how to configure this option. |
