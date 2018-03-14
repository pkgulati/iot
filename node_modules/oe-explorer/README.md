This is a fork of loopback-component-explorer version 4.2.0.
We've basically removed some dependencies and make changes so that it supports
oe-cloud project

# oe-explorer

Browse and test your oeCloud.io app's APIs.

## Basic Usage

Below is a simple LoopBack application. The explorer is mounted at `/explorer`.

```js
var loopback = require('loopback');
var app = loopback();
var explorer = require('../');
var port = 3000;

var Product = loopback.Model.extend('product');
Product.attachTo(loopback.memory());
app.model(Product);

app.use('/api', loopback.rest());

// Register explorer using component-centric API:
explorer(app, { basePath: '/api', mountPath: '/explorer' });
// Alternatively, register as a middleware:
app.use('/explorer', explorer.routes(app, { basePath: '/api' }));

console.log("Explorer mounted at localhost:" + port + "/explorer");

app.listen(port);
```

## Options

Options are passed to `explorer(app, options)`.

`basePath`: **String**

> Default: `app.get('restAPIRoot')` or  `'/api'`.

> Sets the API's base path. This must be set if you are mounting your api
> to a path different than '/api', e.g. with
> `loopback.use('/custom-api-root', loopback.rest());

`mountPath`: **String**

> Default: `/explorer`

> Set the path where to mount the explorer component.

`protocol`: **String**

> Default: `null`

> A hard override for the outgoing protocol (`http` or `https`) that is designated in Swagger
> resource documents. By default, `loopback-component-explorer` will write the protocol that was used to retrieve
> the doc. This option is useful if, for instance, your API sits behind an SSL terminator
> and thus needs to report its endpoints as `https`, even though incoming traffic is auto-detected
> as `http`.

`uiDirs`: **Array of Strings**

> Sets a list of paths within your application for overriding Swagger UI files.

> If present, will search `uiDirs` first when attempting to load Swagger UI,
> allowing you to pick and choose overrides to the interface. Use this to
> style your explorer or add additional functionality.

> See [index.html](public/index.html), where you may want to begin your overrides.
> The rest of the UI is provided by [Swagger UI](https://github.com/wordnik/swagger-ui).

`apiInfo`: **Object**

> Additional information about your API. See the
> [spec](https://github.com/wordnik/swagger-spec/blob/master/versions/1.2.md#513-info-object).

`resourcePath`: **String**

> Default: `'resources'`

> Sets a different path for the
> [resource listing](https://github.com/wordnik/swagger-spec/blob/master/versions/1.2.md#51-resource-listing).
> You generally shouldn't have to change this.

`version`: **String**

> Default: Read from package.json

> Sets your API version. If not present, will read from your app's package.json.
