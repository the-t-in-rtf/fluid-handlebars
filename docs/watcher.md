# `gpii.handlebars.watcher`

This component uses the ["chokidar" library](https://github.com/paulmillr/chokidar) to watch one or more directories
for changes.  When a relevant change occurs, the component's `onFsChange` event is fired with three arguments,
`eventName`, `path`, `details`.

1. `eventName`: A `{String}` that corresponds to one of the chokidar events mentioned below.
2. `path`: A `{String}` that represents the path to the filesystem content that has changed.
3. `details`: An `{Object}` that contains statistics about the change.  See [the Node `fs.Stats`
   documentation](https://nodejs.org/api/fs.html#fs_class_fs_stats) for details.

The watcher will not actually be ready to perform its work immediately.  There is an `onReady` event provided that
incidates that the chokidar watcher has loaded and is actively monitoring the watch directories.

## Component Options

| Option                             | Type                  | Description |
| ---------------------------------- | --------------------- | ----------- |
| `chokidarOptions`                  | `Object`              |  The options passed to chokidar when instantiating the watcher.  See [the chokidar API docs](https://github.com/paulmillr/chokidar#api) for the full list of supported options and the defaults. |
| `chokidarOptions.ignoreInitial`    | `Boolean`             | If this is set to `false`, an `add` or `addDir` chokidar event will be fired for all files and directories on startup. Defaults to `true`. |
| `chokidarOptions.awaitWriteFinish` | `Boolean` or `Object` | Whether to wait for a file to finish writing before reporting the change.  Set this to `true` if you have problems with template content loading before writes are complete. Defaults to `false`.   You can control the timing of this setting by passing an object, see [the chokidar performance docs](https://github.com/paulmillr/chokidar#performance) for details.|
| `chokidarOptions.depth`            | `Number`              | The depth of subdirectories to "watch".  Defaults to `2`, which ensures that the standard template directory structure (pages, layouts, partials) will be monitored. |
| `eventsToWatch`                    | `Object`              | The chokidar events (see below ) to watch for. By default, `add`, `change`, and `unlink` events are watched, i.e. file adds, changes, and removals. |
| `watchDirs`                        | `Array`               | One or more directories to watch for changes.  Supports both full paths, and package-relative paths such as `%package/path/to/directory` that are resolved with [`fluid.module.resolvePath`](http://docs.fluidproject.org/infusion/development/NodeAPI.html#fluid-module-resolvepath-path-) |

## Choosing Which Events to Monitor

Chokidar emits the following events:

| Event       | Description |
| ----------- | ----------- |
| `add`       | A file has been added. |
| `addDir`    | A directory has been added. |
| `change`    | A file has changed. See [the chokidar docs](https://github.com/paulmillr/chokidar#errors) for special cases in which a change may be reported as two separate `unlink` and `add` events. |
| `unlink`    | A file has been removed. |
| `unlinkDir` | A directory has been removed. |
| `ready`     | The chokidar "watcher" is ready to start watching content. |
| `raw`       | Any event in its raw form.  |
| `error`     | Chokidar itself has encountered an error (for example, if a filesystem containing a monitored folder is unmounted). |

Each of these can be specified as a key in `options.eventsToWatch`.  Keys with "truthy" values will be monitored and an
`onFsChange` event (see above) will be fired when each chokidar event occurs.  As an example, the default value of
`options.eventsToWatch` is:

```$json
{
    "eventsToWatch": {
        "add": true,
        "change": true,
        "unlink": true
    }
}
```
