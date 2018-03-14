// Copyright IBM Corp. 2013,2016. All Rights Reserved.
// Node module: loopback-component-explorer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var SG = require('strong-globalize');
SG.SetRootDir(__dirname);
var g = SG();

/*!
 * Adds dynamically-updated docs as /explorer
 */
var deprecated = require('depd')('loopback-explorer');
var url = require('url');
var path = require('path');
var urlJoin = require('./lib/url-join');
var _defaults = require('lodash').defaults;
var cors = require('cors');
var genSwaggerObjFromLB = require('loopback-swagger').generateSwaggerSpec;

module.exports = explorer;
explorer.routes = routes;

explorer.createSwaggerObject = createSwaggerObject;

/**
 * Example usage:
 *
 * var explorer = require('loopback-component-explorer');
 * explorer(app, options);
 */

function explorer(loopbackApplication, options) {
  options = _defaults({}, options, { mountPath: '/explorer' });
  loopbackApplication.use(options.mountPath, routes(loopbackApplication, options));
  loopbackApplication.set('loopback-component-explorer', options);
}

function routes(loopbackApplication, options) {
  var loopback = loopbackApplication.loopback;
  var loopbackMajor = loopback && loopback.version &&
  loopback.version.split('.')[0] || 1;

  if (loopbackMajor < 2) {
    throw new Error(g.f('{{oe-explorer}} requires ' +
      '{{loopback}} 2.0 or newer'));
  }

  options = _defaults({}, options, {
    resourcePath: 'swagger.json',
    apiInfo: loopbackApplication.get('apiInfo') || {},
    swaggerUI: true,
  });

  var router = new loopback.Router();

  mountSwagger(loopbackApplication, router, options);

  // config.json is loaded by swagger-ui. The server should respond
  // with the relative URI of the resource doc.
  router.get('/config.json', function(req, res) {
    // Get the path we're mounted at. It's best to get this from the referer
    // in case we're proxied at a deep path.
    var source = url.parse(req.headers.referer || '').pathname;
    // If no referer is available, use the incoming url.
    if (!source) {
      source = req.originalUrl.replace(/\/config.json(\?.*)?$/, '');
    }
    res.send({
      url: urlJoin(source, '/' + options.resourcePath),
    });
  });

  if (options.swaggerUI) {
    // Allow specifying a static file roots for swagger files. Any files in
    // these folders will override those in the swagger-ui distribution.
    // In this way one could e.g. make changes to index.html without having
    // to worry about constantly pulling in JS updates.
    if (options.uiDirs) {
      if (typeof options.uiDirs === 'string') {
        router.use(loopback.static(options.uiDirs));
      } else if (Array.isArray(options.uiDirs)) {
        options.uiDirs.forEach(function(dir) {
          router.use(loopback.static(dir));
        });
      }
    }

  }

  return router;
}

/**
 * Setup Swagger documentation on the given express app.
 *
 * @param {Application} loopbackApplication The loopback application to
 * document.
 * @param {Application} swaggerApp Swagger application used for hosting
 * swagger documentation.
 * @param {Object} opts Options.
 */
function mountSwagger(loopbackApplication, swaggerApp, opts) {
  var swaggerObject = createSwaggerObject(loopbackApplication, opts);

  // listening to modelRemoted event for updating the swaggerObject
  // with the newly created model to appear in the Swagger UI.
  loopbackApplication.on('modelRemoted', function() {
    swaggerObject = createSwaggerObject(loopbackApplication, opts);
  });

  // listening to remoteMethodDisabled event for updating the swaggerObject
  // when a remote method is disabled to hide that method in the Swagger UI.
  loopbackApplication.on('remoteMethodDisabled', function() {
    swaggerObject = createSwaggerObject(loopbackApplication, opts);
  });

  var resourcePath = opts && opts.resourcePath || 'swagger.json';
  if (resourcePath[0] !== '/') resourcePath = '/' + resourcePath;

  var remotes = loopbackApplication.remotes();
  setupCors(swaggerApp, remotes);

  swaggerApp.get(resourcePath, function sendSwaggerObject(req, res) {
    res.status(200).send(swaggerObject);
  });
}

/**
 * Generate Swagger Object and update it according to needs of oecloud.io.
 *
 * @param {Application} loopbackApplication The loopback application to
 * document.
 * @param {Object} opts Options.
 */
function createSwaggerObject(loopbackApplication, opts) {
  // Calling loopback-swagger to generate Swagger Object.
  var lbSwaggerOBj = genSwaggerObjFromLB(loopbackApplication, opts);
  // Checking presence of generated object and defintions
  // For oecloud.io related changes we are modifying definitions.
  if (lbSwaggerOBj && lbSwaggerOBj.definitions) {
    // Looping through definitions keys
    Object.keys(lbSwaggerOBj.definitions).forEach((lbKey) => {
      // Getting Model from the defintion
      var model = loopbackApplication.models[lbKey];
      // Checking presence of models definition and its properties
      if (model && model.definition && model.definition.properties) {
        // Looping through model.definition.properties
        Object.keys(model.definition.properties).forEach((modelKey) => {
          const prop = model.definition.properties[modelKey];
          // Handling the enum cases.
          if (prop && prop.enumtype) {
            const enumModel = loopbackApplication.models[prop.enumtype];
            if (enumModel && enumModel.settings && enumModel.settings.enumList
                  && lbSwaggerOBj.definitions[lbKey].properties && lbSwaggerOBj.definitions[lbKey].properties[modelKey]) {
              // Retrieving enum values from the enumList
              /**
               * enumList example:
               * [{
               *    "code": "A",
               *    "description": "Annual"
               * },
               * {
               *    "code": "M",
               *    "description": "Monthly"
               * }]
               */
              const enums = enumModel.settings.enumList.map((obj) => {return obj.code;});
              lbSwaggerOBj.definitions[lbKey].properties[modelKey].enum = enums
            }
          }
          // Handling the refcodetype cases.
          if (prop && prop.refcodetype && lbSwaggerOBj.definitions[lbKey].properties
              && lbSwaggerOBj.definitions[lbKey].properties[modelKey]) {
            // Adding the comment giving details about refcode to the corresponding model.
            lbSwaggerOBj.definitions[lbKey].properties[modelKey].refcode = "This is of type refcode '" + prop.refcodetype + "'";
          }
        });
      }

      // Handling Relations
      if (model && model.relations) {
        Object.keys(model.relations).forEach((relKey) => {
          const relation = model.relations[relKey];
          // Handling belongsTo relationship
          // Checking presence of required values in relation
          if (relation && relation.type && relation.type === 'belongsTo' && relation.keyFrom && relation.modelTo) {
            // Checking presence of required values in model definition
            if (model.definition && model.definition.settings && model.definition.settings.relations 
                && model.definition.settings.relations[relKey]) {
              // Checking presence of required values in loopback swagger object
              if (lbSwaggerOBj.definitions[lbKey] && lbSwaggerOBj.definitions[lbKey].properties 
                  && lbSwaggerOBj.definitions[lbKey].properties[relation.keyFrom]) {
                // Hardcoding type as string
                const obj = {
                  type: "string",
                  description: model.definition.settings.relations[relKey].description || ("This property has belongsTo relationship with '" + relation.modelTo.modelName + "' model.")
                };
                // Overriding the Swagger object definition for the model having belongsTo relationship.
                lbSwaggerOBj.definitions[lbKey].properties[relation.keyFrom] = obj;
              }
            }
          }
        });
      }

    });
  }
  return lbSwaggerOBj;
}

function setupCors(swaggerApp, remotes) {
  var corsOptions = remotes.options && remotes.options.cors;
  if (corsOptions === false)
    return;

  deprecated(g.f(
    'The built-in CORS middleware provided by loopback-component-explorer ' +
      'was deprecated. See %s for more details.',
    'https://docs.strongloop.com/display/public/LB/Security+considerations'
  ));

  if (corsOptions === undefined) {
    corsOptions = { origin: true, credentials: true };
  }

  swaggerApp.use(cors(corsOptions));
}
