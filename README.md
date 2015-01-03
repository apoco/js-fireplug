# fireplug

Simple engine for creating plugin-driven applications

## Usage

First, instantiate a plugin manager:

```javascript
var PluginManager = require('fireplug');
var plugins = new PluginManager();
```

Next, start _using_ plugins:

```javascript
var pluginA = {
  method1: function(prev, param1, param2, cb) {
    cb(null, someValue);
  },
  method2: function(prev, param1) {
    return somePromise;
  }
};

var pluginB = {
  method2: function(prev, param1) {
    return prev;
  }
};

plugins.use(pluginA);
plugins.use(pluginB);
plugins.use(arrayOfPlugins);
```

A plugin is an object with methods. The methods each take, as their first parameter, the value (if any) from
any previous plugin, additional parameters for the method, and a callback parameter. The plugin method
can work synchronous by either:

  * Returning the previous result argument
  * Returning `null`
  * Returning a regular value
  * Throwing an error

...or asynchronously by:

  * Calling a node-style callback argument
  * Returning a promise

To invoke plugins, you call the method through the plugin manager in one of two ways, through `invoke`:

```javascript
plugins
  .invoke('method1', arg1)
  .then(
    function(result) {
      // Handle result
    },
    function(err) {
      // Handle error
    });
```

...or, if you know a method is defined at least one plugin, you can use the method name directly:


```javascript
plugins
  .method1(arg1)
  .then(
    function(result) {
      // Handle result
    },
    function(err) {
      // Handle error
    });
```

In either case, the plugins are invoked asynchronously so that the plugin author always have an asynchronous
option. `fireplug` uses Promises/A+.

The suggested strategy for structuring a plugin-based application is to integrate a built-in set of plugins,
then enable a consumer of your application to inject additional plugins.
