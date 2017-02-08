# `gpii.handlebars.standaloneRenderer`

A standalone handlebars renderer designed for use outside of express, for example when rendering mail templates.

Although this does not itself require express, it can work with any helper functions that extend the
`gpii.express.helper` grade, but which do not themselves require express.  All of the helpers included with this
package will work with the standalone renderer.

The directory conventions used with express are partially supported, as follows:

1. Any templates in the `partials` subdirectory relative to `options.templateDirs` will be registered as partials for use in `{{>partial}}` statements.
2. All other templates are expected to be stored in a `pages` subdirectory relative to `options.templateDirs`.

The most important configuration option is `options.templateDirs`, which can either be a string or an array of strings
representing the location of one or more template directories.  As with the `gpii.express` `views` option, the
string values will usually be unresolved references to a directory within a package, as in:

`%package-name/path/within/package`

Note that the package must have registered its content directory using a call like `fluid.module.registerModule("package-name", path)`.