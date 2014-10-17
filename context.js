/**
 * Module dependencies.
 */

var delegate = require('delegates')
  , statuses = require('statuses')
  , cookie = require('cookie')

/**
 * Context prototype.
 */

var proto = module.exports = {

  get browser() {
    return true
  },

  /**
   * client-side cookie get/set implementation
   *
   * @api public
   */

  cookies: {
    get: function(name) {
      return cookie.parse(document.cookie)[name]
    },
    set: function(name, val, opts) {
      return document.cookie = cookie.serialize(name, val, opts)
    }
  },

  /**
   * util.inspect() implementation, which
   * just returns the JSON output.
   *
   * @return {Object}
   * @api public
   */

  inspect: function(){
    return this.toJSON()
  },

  /**
   * Return JSON representation.
   *
   * Here we explicitly invoke .toJSON() on each
   * object, as iteration will otherwise fail due
   * to the getters and cause utilities such as
   * clone() to fail.
   *
   * @return {Object}
   * @api public
   */

  toJSON: function(){
    return {
      request: this.request.toJSON(),
      response: this.response.toJSON(),
      app: this.app.toJSON(),
      originalUrl: this.originalUrl,
      req: '<original node req>',
      res: '<original node res>',
      socket: '<original node socket>',
    }
  },

  /**
   * Similar to .throw(), adds assertion.
   *
   *    this.assert(this.user, 401, 'Please login!');
   *
   * See: https://github.com/jshttp/http-assert
   *
   * @param {Mixed} test
   * @param {Number} status
   * @param {String} message
   * @api public
   */

  assert: function(test, status, message) {
    if(!test) this.throw(status, message)
  },

  /**
   * Throw an error with `msg` and optional `status`
   * defaulting to 500. Note that these are user-level
   * errors, and the message may be exposed to the client.
   *
   *    this.throw(403)
   *    this.throw('name required', 400)
   *    this.throw(400, 'name required')
   *    this.throw('something exploded')
   *    this.throw(new Error('invalid'), 400);
   *    this.throw(400, new Error('invalid'));
   *
   * See: https://github.com/jshttp/http-errors
   *
   * @param {String|Number|Error} err, msg or status
   * @param {String|Number|Error} [err, msg or status]
   * @param {Object} [props]
   * @api public
   */

  throw: function(a, b){
    var status = typeof a == 'number' ? a : b || 500
    var error = (status == a ? b : a) || new Error(statuses[status])

    if(typeof error == 'string')
      error = new Error(error)

    this.status = error.status = error.statusCode = status
    throw error
  },

  /**
   * Default error handling.
   *
   * @param {Error} err
   * @api private
   */

  onerror: function(err) {
    this.app.onerror(err, this)
  }
}

/**
 * Response delegation.
 */

 delegate(proto, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')

/**
 * Request delegation.
 */

delegate(proto, 'request')
  .method('get')
  .access('querystring')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('header')
  .getter('headers')