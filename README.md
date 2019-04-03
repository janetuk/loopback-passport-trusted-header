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
        "passReqToVerify": true,
        "session": true,
        "json": true,
        "autoLogin": true
    }
}
```
