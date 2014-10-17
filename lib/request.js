
/**
 * Module dependencies.
 */

var stringify = require('url').format
  , parse = require('parseurl')
  , qs = require('qs')

/**
 * Prototype.
 */

module.exports = {

  /**
   * Alias header to headers
   */

  get header() {
    return this.headers
  },


  /**
   * Return host/hostname from the window
   */

  get host() {
    return window.location.host
  },

  get hostname() {
    return window.location.hostname
  },

  get protocol() {
    return window.location.protocol.replace(':', '')
  },


  /**
   * Url (path/query/querystring/search) getters/setter
   * ensure that updating one keeps the others and `this.url` in sync
   */

  get path() {
    return parse(this).pathname
  },

  set path(path) {
    var url = parse(this.url)
    url.pathname = path
    this.url = stringify(url)
  },

  get query() {
    var str = this.querystring
    if (!str) return {}

    var c = this._querycache = this._querycache || {}
    return c[str] || (c[str] = qs.parse(str))
  },

  set query(obj) {
    this.querystring = qs.stringify(obj)
  },

  get querystring() {
    return parse(this).query || ''
  },

  set querystring(str) {
    var url = parse(this)
    url.search = str
    this.url = stringify(url)
  },

  get search() {
    if (!this.querystring) return ''
    return '?' + this.querystring
  },

  set search(str) {
    this.querystring = str
  },


  /**
   * Return request header.
   *
   * The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * Examples:
   *
   *     this.get('Content-Type')
   *     // => "text/plain"
   *
   *     this.get('content-type')
   *     // => "text/plain"
   *
   *     this.get('Something')
   *     // => undefined
   *
   * @param {String} field
   * @return {String}
   * @api public
   */

  get: function(field){
    switch (field = field.toLowerCase()) {
      case 'referer':
      case 'referrer':
        return this.headers.referrer || this.headers.referer
      default:
        return this.headers[field]
    }
  },

  /**
   * Inspect implementation.
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
   * @return {Object}
   * @api public
   */

  toJSON: function(){
    return {
      method: this.method,
      url: this.url,
      header: this.header
    }
  }
}