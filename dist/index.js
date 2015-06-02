'use strict';

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _objectWithoutProperties = function (obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; };

var _defineProperty = function (obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * Import dependencies
 */

var _Glue = require('glue');

var _Glue2 = _interopRequireDefault(_Glue);

var _Hoek = require('hoek');

var _Hoek2 = _interopRequireDefault(_Hoek);

/**
 * Create server
 */
var createServer = function createServer(plugin) {
  var options = arguments[1] === undefined ? {} : arguments[1];

  // Get server config
  var serverConfig = _Hoek2['default'].applyToDefaults({
    debug: {
      log: ['*'],
      request: ['*']
    }
  }, options.server || {});

  // Get connection config
  var connectionsConfig = options.connections || [];

  // Get plugin config
  var pluginConfig = _Hoek2['default'].applyToDefaults({}, options.register || {});

  // Get Glue config
  var glueConfig = _Hoek2['default'].applyToDefaults({
    relativeTo: process.cwd()
  }, {
    relativeTo: options.relativeTo,
    preConnections: options.preConnections,
    prePlugins: options.prePlugins
  });

  // Create manifest
  var manifest = {
    server: serverConfig,
    connections: connectionsConfig,
    plugins: _defineProperty({}, module.parent.filename, [pluginConfig])
  };

  // Compose and start server (on nextTick to avoid circular dependencies)
  var compose = function compose() {
    _Glue2['default'].compose(manifest, glueConfig, function (error, server) {
      if (error) {
        return console.error(error);
      }
      server.start(function () {
        server.connections.forEach(function (_ref) {
          var labels = _ref.settings.labels;
          var info = _ref.info;

          console.log('' + (labels.length ? '[' + labels + ']' : 'Server') + ' started at: ' + info.uri);
        });
      });
    });
  };

  process.nextTick(function () {
    return compose();
  });
};

/**
 * Export modularize plugin helper
 */

exports['default'] = function (_x2, fn) {
  var options = arguments[0] === undefined ? {} : arguments[0];

  // Split options
  var attributes = options.attributes;
  var pkg = options.pkg;

  var modularizeOptions = _objectWithoutProperties(options, ['attributes', 'pkg']);

  // Set plugin attributes
  var plugin = fn;
  plugin.attributes = pkg ? { pkg: pkg } : attributes;

  // Create new server if the plugin is not required
  if (!module.parent.parent && Object.keys(modularizeOptions).length) {
    createServer(plugin, modularizeOptions);
  }

  // Return plugin
  return plugin;
};

module.exports = exports['default'];