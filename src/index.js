/**
 * Import dependencies
 */
import Glue from 'glue';
import Hoek from 'hoek';


/**
 * Create server
 */
const createServer = (plugin, options = {}) => {

  // Get server config
  const serverConfig = Hoek.applyToDefaults({
    debug: {
      log: ['*'],
      request: ['*']
    }
  }, options.server || {});

  // Get connection config
  const connectionsConfig = options.connections || [];

  // Get plugin config
  const pluginConfig = Hoek.applyToDefaults({

  }, options.register || {});

  // Get Glue config
  const glueConfig = Hoek.applyToDefaults({
    relativeTo: process.cwd()
  }, {
    relativeTo: options.relativeTo,
    preConnections: options.preConnections,
    prePlugins: options.prePlugins
  });

  // Create manifest
  const manifest = {
    server: serverConfig,
    connections: connectionsConfig,
    plugins: {
      [module.parent.filename]: [pluginConfig]
    }
  };

  // Compose and start server (on nextTick to avoid circular dependencies)
  const compose = () => {
    Glue.compose(manifest, glueConfig, (error, server) => {
      if (error) {
        return console.error(error);
      }
      server.start(() => {
        server.connections.forEach(({settings: {labels}, info}) => {
          console.log(`${labels.length ? `[${labels}]` : 'Server'} started at: ${info.uri}`);
        });
      });
    });
  };

  process.nextTick(() => compose());
};


/**
 * Export modularize plugin helper
 */
export default (options = {}, fn) => {

  // Split options
  const {attributes, pkg, ...modularizeOptions} = options;

  // Set plugin attributes
  const plugin = fn;
  plugin.attributes = pkg ? {...attributes, name: pkg.name, version: pkg.version} : attributes;

  // Create new server if the plugin is not required
  if (!module.parent.parent && Object.keys(modularizeOptions).length) {
    createServer(plugin, modularizeOptions);
  }

  // Return plugin
  return plugin;
};
