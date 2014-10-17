Koa-Client
==========

A client-side implementation of [koa](https://github.com/koajs/koa) that automatically intercepts anchor clicks and form submissions.  The goal of this project is to mimic the koa server implementation as closely as possible so that middleware can work on the client (such as `koa-mount-route`) while keeping file size to a minimum.

Install
-------

`npm install koa-client`

Public API
----------

###`app.use(function)` 
mount middleware function

###`app.listen([selector|element])` 
intercept clicks and submissions from all children of the element. Default is `document.body`.

###`app.request(req, [opts])` 
sends a request through `app`'s middleware functions.  It also updates the browser url using History API. This is the same function that is used internally to route requests that are intercepted from the element specified to `app.listen`.  `opts` is an optional options object, the only option is `replace_state`, that when true uses `history.replaceState` instead of `history.pushState` to update the browser url.

###`app.redirect(req)`
shorthand for `app.request(req, { replace_state:true })`

###`app.refresh(req)`
shorthand for `app.request(window.location.href, { replace_state:true })`


Differences from Server
-----------------------

### Context

#### Added Properties

##### ctx.browser = true
a variable that always returns true.  helpful for middleware that you intend to run on both the client and server versions of koa.

#### Similar Properties

##### ctx.assert(test, status, message)
simple assertion, if test fails throws a plain `Error` with `status` attached.  this is not an instance of a `ClientError` or `ServerError`.

##### ctx.throw(err|msg|status[, err|msg|status])
similar to above, throws a plain `Error` with `status` attached.  this is not an instance of a `ClientError` or `ServerError`.

##### ctx.cookies.get(name)/ctx.cookies.set(name, val[, opts])
get and set cookies using `document.cookie`

##### ctx.app/ctx.request/ctx.response
references the same propeties as the server:

#### Removed Properties

- _**ctx.req** removed_
- _**ctx.res** removed_
- _**ctx.respond()** removed_

#### Accessors/Methods

Aside from those that have been removed, `koa-client` provides the same accessors that are on the server, although the implementation on the request/response may differ.

##### Request

- ctx.host
- ctx.hostname
- ctx.protocol
- ctx.header
- ctx.headers
- ctx.method
- ctx.method=
- ctx.url
- ctx.url=
- ctx.originalUrl
- ctx.path
- ctx.path=
- ctx.query
- ctx.query=
- ctx.querystring
- ctx.querystring=
- ctx.get()
- _**ctx.fresh** removed_
- _**ctx.stale** removed_
- _**ctx.socket** removed_
- _**ctx.secure** removed_
- _**ctx.ip** removed_
- _**ctx.ips** removed_
- _**ctx.subdomains** removed_
- _**ctx.is()** removed_
- _**ctx.accepts()** removed_
- _**ctx.acceptsEncodings()** removed_
- _**ctx.acceptsCharsets()** removed_
- _**ctx.acceptsLanguages()** removed_

##### Response

- ctx.body
- ctx.body=
- ctx.status
- ctx.status=
- ctx.message
- ctx.message=
- ctx.length=
- ctx.length
- ctx.type=
- ctx.type
- ctx.headerSent
- ctx.redirect()
- ctx.attachment()
- ctx.set()
- ctx.remove()
- ctx.lastModified=
- ctx.etag=

### Request

#### Unmodified
The following are actually slightly modified, since there is no node `req` underlying the getters/setters, but the functionality should be exactly the same.

- request.host
- request.hostname
- request.protocol
- request.method
- request.method=
- request.url
- request.url=
- request.originalUrl
- request.path
- request.path=
- request.query
- request.query=
- request.querystring
- request.querystring=
- request.search
- request.search=

#### Similar Properties

##### request.header[s]/request.get()
does not get headers from an underlying node `res` object.  expects lowercase header names.

#### Removed Properties

- _**request.fresh** removed_
- _**request.stale** removed_
- _**request.socket** removed_
- _**request.secure** removed_
- _**request.ip** removed_
- _**request.ips** removed_
- _**request.subdomains** removed_
- _**request.is()** removed_
- _**request.accepts()** removed_
- _**request.acceptsEncodings()** removed_
- _**request.acceptsCharsets()** removed_
- _**request.acceptsLanguages()** removed_

### Response

#### Similar Properties

##### response.redirect(url[, alt])
does not set `response.body` or `response.type`, otherwise the same

##### response.header[s]/response.get()/response.set()/response.remove()
does not set headers on an underlying node `res` object.  forces `toLowerCase()` on all header names.

#### Unspecified Properties
The following are unspecified properties of the response object.  They have no getter/setter but you can still use them, they just won't do their magic behind the scence.  (ex. `request.body = {}` will only set `request.body` to `{}`, it will not update content type/length headers. 

- response.body
- response.status
- response.type
- response.headerSent
- response.message
- response.lastModified
- response.etag
- response.length

#### Removed Properties

- _**response.attachment()** removed_
- _**response.vary()** removed_
- _**response.socket** removed_
- _**response.is()** removed_
- _**response.writeable** removed_
