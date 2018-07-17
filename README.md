# Introduction

This package provides components to assist in rendering handlebars templates both on the server and client side.

## What does it include?

### Handlebars Middleware

This package provides a custom view engine that adds Handlebars rendering support to a `gpii.express` instance.
For more details, see the [handlebars view engine documentation](docs/handlebars.md).

### Dispatcher Middleware

The dispatcher router turns the last part of a path (such as `/dispatcher/foo`) into a template name (such as `foo`),
and then attempts to find and render that template.  The dispatcher router is configured using the same options as the
handlebars middleware, and supports the same kind of inheritance.  For more information, see the [dispatcher middleware
documentation](docs/dispatcher.md).

### Inline Middleware

The inline router reads all of the template content from one or more view directories and bundles this content up so
that it can be used by the client-side renderer.  The inline router is configured using the same options as the
handlebars middleware, and supports the same kind of inheritance.  For more information, see the [inline middleware
documentation](docs/inline.md).

### Client-side `renderer`

The client side renderer provides the ability to insert rendered content into the DOM.  It expects to either be
preconfigured with template content via its options, or to read the template content from the `inline` router (see
above).  For more details, see the [renderer documentation](docs/renderer.md).

### Helper Functions

This package provides additional handlebars block helpers that can be used in your handlebars templates.  For more
details, see the [helpers documentation](docs/helper.md).

### `initBlock` Handlebars block helper

The most powerful feature of the server-side template rendering is the `initBlock` helper (this is not available on the
client side).  This helper takes one or more grade names and generates client-side javascript that ultimately creates a
view component which has those grades.

Thus, in a simple bit of handlebars markup, you can create nearly any view component, as in:

    {{{initBlock "your.grade" "your.other.grade"}}}

For more details on the `initBlock` helper,  see [its documentation](docs/initBlock.md).

## Testing This Module

### In a Virtual Machine

The preferred way to run the tests is to create a virtual machine and run the tests in that supported and
pre-configured environment.  To run the tests in a virtual machine, you will need to have VirtualBox, Vagrant, and the
Vagrant CI Plugin installed.  See the [QI development environment
requirements](https://github.com/GPII/qi-development-environments/#requirements) for more details.

Once you have satisfied the requirements, you can run the tests using the following commands from the root of the
repository:

1. `vagrant up`
2. `vagrant ci test`

If you would like to remove the VM, use the command `vagrant destroy` from the root of the repository.

### On a Local Machine

In order to run the tests locally, you must have [Chrome](https://www.google.com/chrome/) and
[ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/) installed.  You should then be able to run the
following commands in order:

1. `npm install`
2. `npm test`
