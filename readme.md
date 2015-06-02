# hapi-modularize

[![Maintenance Status][status-image]][status-url] [![Dependency Status][deps-image]][deps-url] [![NPM version][npm-image]][npm-url]

Helper for modular plugin based [Hapi](https://github.com/hapijs/hapi) servers.

If your plugin is executed then it automatically starts a new server with the defined connections and server settings (with a generated [glue](https://github.com/hapijs/glue) manifest). If the plugin is required then it just exports the plugin (to be used in another server/connection).

**Common use case**

You create one repository/module/plugin with your browser-client application. Another one with your api. You can execute them independently or use them as plugins for a upper-level application.

## Installation

```js
npm install hapi-register-plugin
```

## Usage

<<<<<<< HEAD
```js
modularize(options, plugin);
```

Creates a new [Plugin](http://hapijs.com/api#plugins) where:

- `options` - the configuration where:

  - `attributes` - a plugin properties object. See [http://hapijs.com/api#plugins](http://hapijs.com/api#plugins)

   - `pkg` - alternatively, the `attributes.name` and `attributes.version` can be included via the `pkg` attribute containing the 'package.json' file for the module which already has the name and version included.

  - `server` - an object containing the options passed to [`new Server([options])`](http://hapijs.com/api#new-serveroptions)

  - `connections` - an array of connection options, passed individually in calls to [`server.connection([options])`](http://hapijs.com/api#serverconnectionoptions)

  - `register` - a plugin configuration object can have:
        * any option from [`server.register`](http://hapijs.com/api#serverregisterplugins-options-callback) options
        * `options` - an object to use as the plugin options which get passed to the plugin's registration function when called.

  - `relativeTo` - a file-system path string that is used to resolve relative loading modules.

  -  `preConnections` - a callback function that is called prior to adding connections to the server. The function signature is `function (server, next)` where:
    - `server` - is the server object returned from `new Server(options)`.
    - `next`-  the callback function the method must call to return control over to glue

  - `prePlugins` - a callback function that is called prior to registering plugins with the server. The function signature is `function (server, next)` where:
    - `server` - is the server object with all connections selected.
    - `next`-  the callback function the method must call to return control over to glue

- `plugin` : a plugin is a function with the signature `function(server, options, next)` where:

  - `server` - the server object the plugin is being registered to.
  - `options` - an options object passed to the plugin during registration.
  - `next` - a callback method the function must call to return control back to the framework to complete the registration process with signature `function(error)` where:
    - `error` - any plugin registration error.
=======
**Create the connection object**

```js
// Read configuration from process.cwd() + '/webpack.config.js'
var WebpackConnection = require('hapi-webpack-connection')();


// Or define configuration
var webpackConfig = {
  // ... webpack options
  // See http://webpack.github.io/docs/configuration.html

  devServer: {
    // ... webpack-dev-server options
    // See http://webpack.github.io/docs/webpack-dev-server.html
  }
};
var WebpackConnection = require('hapi-webpack-connection')(webpackConfig);
```

**And use it with Hapi**

The connection has a `webpack` label and Webpack configuration can be accessed via `connection.settings.app`.

```js
var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection(WebpackConnection);

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
```
>>>>>>> origin/master



## Examples

In this example, `myApp` will listen on port `80` and will have `client`and `api` registered as plugins. But I can execute `client` or `api` independently, and they will respectively listen on port `3000` and `3001`.

/client/index.js
```js
// ES6 syntax

/**
 * Import dependencies
 */
import pkg from './package.json';
import modularize from 'hapi-modularize';


/**
 * Connections configuration
 */
const connections = [
  {
    port: 3000, labels: [pkg.name]
  }
];


/**
 * Export plugin
 */
export default modularize({pkg, connections}, (server, options, next) => {

  // ... do something with your client plugin

  next();
});

```

/api/index.js
```js
// ES6 syntax

/**
 * Import dependencies
 */
import modularize from 'hapi-modularize';


/**
 * Plugin attributes
 */
const attributes = {
  name: 'api',
  version: '1.0.0'
}


/**
 * Connections configuration
 */
const connections = [
  {
    port: 3001, labels: [attributes.name]
  }
];


/**
 * Export plugin
 */
export default modularize({attributes, connections}, (server, options, next) => {

  // ... do something with your api plugin

  next();
});

```

/production/myApp.js
```js
var Glue = require('glue');

var manifest = {
  connections: [
    {
      port: 80,
      labels: [
        'myApp'
      ]
    }
  ],
  server: {
    // ... some server options
  },
  plugins: {
    '../../api/index.js': [{
     // ... some plugin configuration
    }],
    '../../client/index.js': [{}],

    // ... some production specific plugins
  }
}

Glue.compose(manifest, function (error, server) {
  if (error) {
    return console.error(error);
  }

  console.log('Server running at:', server.info.uri);
});
```

## Licence

The MIT License (MIT)

Copyright (c) 2015 Simon Degraeve

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[status-url]: https://github.com/SimonDegraeve/hapi-modularize/pulse
[status-image]: http://img.shields.io/badge/status-maintained-brightgreen.svg?style=flat-square

[deps-url]: https://david-dm.org/SimonDegraeve/hapi-modularize
[deps-image]: https://img.shields.io/david/SimonDegraeve/hapi-modularize.svg?style=flat-square

[npm-url]: https://npmjs.org/package/hapi-modularize
[npm-image]: http://img.shields.io/npm/v/hapi-modularize.svg?style=flat-square