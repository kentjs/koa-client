var co = require('co')
  , url = require('url')
  , parse = require('parseurl')
  , ready = require('detect-dom-ready')
  , compose = require('koa-compose')
  , delegate = require('component-delegate')
  , serialize = require('form-serialize')
  , context = require('./context')
  , request = require('./request')
  , response = require('./response')

var app = Application.prototype

exports = module.exports = Application


/**
 * Initialize a new `Application`.
 *
 * @api public
 */

function Application() {
	if (!(this instanceof Application)) 
		return new Application
	
	this.middleware = []
	this.context = Object.create(context)
	this.request = Object.create(request)
	this.response = Object.create(response)
}

/**
 * Use the given middleware `fn`.
 *
 * @param {GeneratorFunction} fn
 * @return {Application} self
 * @api public
 */

app.use = function(fn) {
	if(!fn || fn.constructor.name != 'GeneratorFunction')
		throw new Error('app.use() requires a generator function')

	this.middleware.push(fn)
	return app
}


/**
 * Initialize a new context.
 * this context very much imitates the koa server context
 * but does not provide access to any underlying request/response
 * like node's `req` and `res` objects nor to any sockets 
 * nor to http details such as accepts/encoding and 
 * response/request types
 *
 * @api private
 */

app.createContext = function(req) {
	var context = Object.create(this.context);
	  , request = context.request = Object.create(this.request)
	  , response = context.response = Object.create(this.response)
	
	context.originalUrl = request.originalUrl = req.url
	context.onerror = context.onerror.bind(context)
	context.app = request.app = response.app = this
	request.ctx = response.ctx = context
	request.response = response
	response.request = request

	request.method = req.method
	request.url = req.url
	request.headers = req.headers || {}
	request.body = req.body

	return context
}


/**
 * Dispatch a request.
 *
 * @api public
 */

app.request = function(req, opts) {
	var parts
	  , app = this

	opts = opts || {}

	if(typeof req == 'string')
		req = { url:req }

	if(!req.url)
		throw new Error('Your request must have a url')

	req.url = url.resolve(window.location.href, req.url)

	parts = parse(req.url)

	if(parts.host != window.location.host)
		return false

	req.method = req.method ? req.method.toUpperCase() : 'GET'
	req.headers = req.headers || {}
	req.headers.referer = window.location.href

	var ctx = this.createContext(req)

	return new Promise(function(resolve, reject) {
		app.composed.call(ctx, function(err) {
			if(err) {
				ctx.onerror.apply(ctx, arguments)
				return reject(err)
			}

			if(!opts.replace_state) 
				window.history.pushState({}, '', href)
			else
				window.history.replaceState({}, '', href)
			
			resolve(ctx)
		})
	})
}

app.redirect = function(req) {
	return this.request(req, { replace_state:true })
}

app.refresh = function() {
	return this.redirect(window.location.href)
}


/**
 * Default error handler.
 *
 * @param {Error} err
 * @api private
 */

app.onerror = function(err, ctx){
  if(!(err instanceof Error)
  	throw new Error('non-error thrown: ' + err);

  if (404 == err.status) return;

  var msg = err.stack || err.toString()
  console.error()
  console.error(msg.replace(/^/gm, '  '))
  console.error()
}


/**
 * Intercepts link clicks/form submitions from all children of el
 * and routes them through the application
 *
 * @param {Element} el
 * @api public
 */


app.listen = function() {
	var app = this
	this.composed = co(compose([respond].concat(this.middleware)))
	ready(function() {
		this.element = document.body
		
		delgateBody('a[href]', 'click', function(e) {
			if(app.request(e.target.href)) {
				e.preventDefault()
				return false
			}
		})
		
		delgateBody('form[action]', 'submit', function(e) {
			if(app.request({ 
				  method: 'POST'
				, url: e.target.href
				, body: serialize(e.target, { hash:true }) 
			})) {
				e.preventDefault()
				return false
			}
		})
	})
}

function delgateBody(selector, event, handler) {
	delegate.bind(document.body, selector, event, function(e) {
		if(!e.isDefaultPrevented()) {
			return handler(e)
		}
	})
}

function * respond() {
	yield * next
	if(statuses.redirect[this.status]) {
		setTimeout(function() {
			this.app.redirect(this.response.get('Location'))
		})
	}
}