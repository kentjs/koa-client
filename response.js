
/**
 * Module dependencies.
 */

var statuses = require('statuses')
  , noop = function(){}

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
   * Noops, so things don't break
   */

  vary: noop,
  attachment: noop,


  /**
   * Perform a [302] redirect to `url`.
   *
   * The string "back" is special-cased
   * to provide Referrer support, when Referrer
   * is not present `alt` or "/" is used.
   *
   * Examples:
   *
   *    this.redirect('back');
   *    this.redirect('back', '/index.html');
   *    this.redirect('/login');
   *    this.redirect('http://google.com');
   *
   * @param {String} url
   * @param {String} alt
   * @api public
   */

  redirect: function(url, alt){
    // location
    if ('back' == url) url = this.ctx.get('Referrer') || alt || '/';
    this.set('Location', url);

    // status
    if (!statuses.redirect[this.status]) this.status = 302;
  },


  get: function(field){
    return this.headers[field.toLowerCase()];
  },

  /**
   * Set header `field` to `val`, or pass
   * an object of header fields.
   *
   * Examples:
   *
   *    this.set('Foo', ['bar', 'baz']);
   *    this.set('Accept', 'application/json');
   *    this.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
   *
   * @param {String|Object|Array} field
   * @param {String} val
   * @api public
   */

  set: function(field, val){
    if (2 == arguments.length) {
      if (Array.isArray(val)) val = val.map(String);
      else val = String(val);
      this.headers[field.toLowerCase()] = val;
    } else {
      for (var key in field) {
        this.set(key, field[key]);
      }
    }
  },

  /**
   * Remove header `field`.
   *
   * @param {String} name
   * @api public
   */

  remove: function(field){
    delete this.headers[field.toLowerCase()]
  },

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect: function(){
    var o = this.toJSON();
    o.body = this.body;
    return o;
  },

  /**
   * Return JSON representation.
   *
   * @return {Object}
   * @api public
   */

  toJSON: function(){
    return {
      status: this.status,
      message: this.message,
      header: this.header
    }
  }
}