'use strict';

const passport = require('passport-strategy');
const util = require('util');

/*
 * Config Defaults
 * passReqToCallback
 * @param options Provider options
 * @param verify Verification callback
 */
function Strategy(options, verify) {
  let me = this;
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('Strategy requires a verify callback');
  }
  passport.Strategy.call(me);
  me._options = options;
  me._verify = verify;
  me.name = 'loopback-passport-trusted-header';
}

util.inherits(Strategy, passport.Strategy);

/*
 * Authenticate request
 * @param req HTTP Request Object
 * @param options AuthOptions
 */
Strategy.prototype.authenticate = function authenticate(req, options) {
  let me = this;
  options = options || {"header_name": "proxy-remote-user"};

  function verified(err, user, info) {
    if (err) { return me.error(err); }
    if (!user) { return me.fail(info); }
    me.success(user, info);
  }

  try {
    var username = req.headers[options.header_name];

    if (username) {
      // username MUST not have a @ symbol, as they are used to autogenerate emails
      username = username.replace("@", "#");
      var userProfile = {id: username, username: username, accessToken: null};
      if (this._options.passReqToCallback) {
        this._verify(req, null, null, userProfile, verified);
      } else {
        this._verify(null, null, userProfile, verified);
      }
    }
    else {
      console.log("Missing required Headers");
      return me.fail('Missing required headers');
    }
  } catch (err) {
    return me.error(err);
  }
};
module.exports = Strategy;
