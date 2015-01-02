module.exports = PluginManager;

var Promise = require('bluebird');

function PluginManager() {
  this.plugins = [];
}

PluginManager.prototype.use = function(plugin) {
  if (plugin instanceof Array) {
    return plugin.forEach(this.use.bind(this));
  }

  Object
    .keys(plugin)
    .forEach(function(methodName) {
      if (!(methodName in this)) {
        this[methodName] = this.invoke.bind(this, methodName);
      }
    }, this);

  this.plugins.push(plugin);
};

PluginManager.prototype.invoke = function(methodName) {
  var baseArgs = Array.prototype.slice.call(arguments, 1);
  return Promise
    .resolve(this.plugins)
    .filter(function(plugin) { return methodName in plugin; })
    .reduce(function(prev, plugin) {
      return new Promise(function(resolve, reject) {
        var args = [prev].concat(baseArgs, function(err, result) { err ? reject(err) : resolve(result); });
        try {
          var result = plugin[methodName].apply(plugin, args);
        } catch (ex) {
          return reject(ex);
        }
        if (result !== undefined) {
          resolve(result);
        }
      });
    }, null);
};
