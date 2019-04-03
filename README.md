# Loopback Passport Trust Header Strategy

This project provides an custom passport.js strategy for use with loopback.io wich makes use of a trusted HTTP header to obtain the username (typically obtained from a web server's environment variable, such as REMOTE_USER).

It's intended to be used with any of the `mod_XXXXX` modules that export REMOTE_USER, such as mod_auth_gssapi or mod_shib.

## Providers.js Example
```json
{
    "moonshot": {
        "provider": "moonshot",
        "authScheme": "trusted-header",
        "module": "loopback-passport-trusted-header",
        "authPath": "/auth/moonshot",
        "callbackPath": "/auth/moonshot/callback",
        "authOptions": {
          "header_name": "proxy-remote-user"
        },
        "passReqToCallback": true,
        "session": true,
        "json": true,
        "autoLogin": true
    }
}
```

## Apache configuration Example
In order to securely insert HTTP headers, you need to set up a web server that makes sure those values are meaningfull
and extracted from the authentication module.

You can easily do this by putting an Apache server in front of your application, in such a way that the `autPath` and `callbackPath` are protected, and leveraging the generation of the trusted HTTP headers.

An example configuration would be the following:

```
  ProxyPassInterpolateEnv On
  ProxyPass / "http://localhost:3000/"
  ProxyPassReverse / "http://localhost:3000/"
  RequestHeader set Proxy-Remote-User %{GSS_NAME}e

  <Proxy *>
      Order deny,allow
      Allow from all
  </Proxy>

  <Location /auth/moonshot/>
    AuthType GSSAPI
    AuthName "Moonshot Login"
    GssapiConnectionBound On
    Order allow,deny
    Require valid-user
    Allow from all
  </Location>
```
