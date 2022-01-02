# validate-auth v0.0.1

# General Use with Express:

`require` the package and optionally pass it a `config` object, or rely on sensible defaults.

When executed, the package returns configured Express middleware.


```javascript
const config = {}; //see below for defaults

const ValidateAuth = require('validate-auth');

const {
    validateEmail,
    validateNewPassword,
    allowNewPassphrases,
    allowExistingPassphrases,
    sendPasswordRequirements
} = ValidateAuth(config);

const express = require('express');
cosnt app = express();

// send the password requirements to the client as JSON:
app.get('/password-requirements', sendPasswordRequirements);

// Validate email and password or passphrase, then allow sign-up
app.post('/sign-up', validateEmail(), validateNewPassword(), allowNewPassphrases(), signUp);

// Validate email and allow passphrase, then allow 
app.post('/log-in',  validateEmail(), allowExistingPassphrases(), logIn);
```

# Main Module's `config` Object:
This `config` object is passed to the **main module**. The following `config` object shows default values:
```javascript
const config = {
    emailLocation: 'email',
    passwordLocation: 'password',
    passphraseLocation: 'passphrase'
    transformEmailLowerCase: true,
    password: {
        minLength: 8,       // minimum 8 characters
        needMixed: true,    // need mixed case letters
        needSymbol: true,   // need non-alphanumeric
        needNumber: true,   // need number
        needAlpha: true,    // need alphabetical
        override: false     // 'true' removes all password requirements, sets minLength=1
    },
    passphrase: {
        minWords: 9         // minimum number of words
    }
};
```
### `config.emailLocation: 'email'`
- Gives the name of the property on `req.body` used to hold the email address (defaults to `'email'`, pointing to `req.body.email`)
### `config.passwordLocation: 'password'`
- Gives the name of the property on `req.body` used to hold the password (defaults to `'password'`, pointing to `req.body.password`)
### `config.passphraseLocation: 'passphrase'`
- Gives the name of the property on `req.body` used to hold the passphrase (defaults to `'passphrase'`, pointing to `req.body.passphrase`)
### `config.password: {...}`
- Establishes password validation requirements, with sensible defaults and the ability to override them all:
  - `config.password.minLength: 8` - Minimum password length? (default is `8`)
  - `config.password.needMixed: true` - Mixed typecase required? (default is `true`)
  - `config.password.needSymbol: true` - Non-alphanumeric symbol required? (default is `true`)
  - `config.password.needNumber: true` - Numeral required (default is `true`)
  - `config.password.needAlpha: true` - Letter (Latin alphabet) required? (default is `true`; this is redundant with the default `needMixed: true` shown above)
  - `config.password.override: false` - Overrides all password requirements, only requiring that the password be a single character long. (**Only use for testing and demo environments!!**)


# More Details on Individual Middleware Functions:

## `validateEmail([config])`

Validates an email address, trimming it for whitespace. Transforms it to lower case, unless `transformEmailLowerCase` is specifically set to `false` in the **module** config object.

- `validateEmail` must be **called as a function**, which returns the middleware:

```javascript
// default config:
app.post('/sign-up', validateEmail(), signUp);
// or custom config:
app.post('/sign-up', validateEmail(config), signUp);
```
The `config` object has the following defaults:
```javascript
const config = {
    invalidEmailMessage: 'Invalid email address',
    errorStatus: 400
}
```
 - `invalidEmailMessage` is sent to the client
 - errorStatus is the response status (`400` is 'Bad Request')

## `validateNewPassword([config])`

Validates a password, ensuring it meets all rules set in the main module's `config` object.

- `validateEmail` must be **called as a function**, which returns the middleware:

```javascript
// default config:
app.post('/sign-up', validateNewPassword(), signUp);
// or custom config:
app.post('/sign-up', validateNewPassword(config), signUp);
```

**Important Caveats:**
 - **Validate new passwords only.** Do not validate passwords for login, or the user may not be able to log in if their existing password does not meet the current requirements&mdash;hence `New` in the name of the function.
 - **When validating passwords and also allowing passphrases, `validateNewPassword` needs to be passed before the `allownewPassphrases` or `allowExistingPassphrases` function**. Passing `validateNewPassword` as middleware *after* `allow***Passphrases` will throw an error.
   - **Why?** `validateNewPassword` works on the `req.body.password` object, expecting it to be an actual password. `allow***Passphrases` tests whether there is a `req.body.password` or a `req.body.passphrase`, and if an adequate passphrase is provided, normalizes it (to lower case, removing duplicate words), and **sets** `req.body.password`. Such a password is a long list of words, and is not subject to the password rules, but using `validateNewPassword` *after* `allow***Passphrases` would check it to password requirements, and often reject it. An error is intentionally thrown to avoid this setup.

   The `config` object has the following defaults:
```javascript
const config = {
    invalidPasswordMessage: `Password doesn't meet requirements`,
    errorStatus: 400
}
```
 - `invalidPasswordMessage` is sent to the client
 - errorStatus is the response status (`400` is 'Bad Request')

## `allowNewPassphrases([config])` and `allowExistingPassphrases([config])`

Normalizes a passphrase, and sets `req.body.password` to the normalized passphrase. Your application can proceed using only `req.body.password` and not worry about whether the user had specified a `req.body.password` or `req.body.passphrase`.

`allowNew...` vs. `allowExisting...`: Use `allowNewPassphrases` when setting a new passphrase, as it enforces the minimum length requirements. Use `allowExistingPassphrases` when verifying a passphrase, as it does not enforce minimum length requirements, in case they've changed.
- Otherwise, allowing a user to set a 5-word passphrase and then increasing the minimum length policy to 8 words would prevent them from verifying their 5-word passphrase and logging in.

- `allowNewPassphrases` and `allowExistingPassphrases` must be **called as a function**, which returns the middleware:

```javascript
// default config:
app.post('/sign-up', validateNewPassword(), allowNewPassphrases(), signUp);
app.post('/log-in', validateNewPassword(), allowExistingPassphrases(), logIn);

// or custom config:
app.post('/sign-up', validateNewPassword(), allowNewPassphrases(config), signUp);
app.post('/log-in', validateNewPassword(), allowExistingPassphrases(config), logIn);
```

When setting a passphrase, `validateNewPassword` must be passed in before the `allowNewPassphrases` or `allowExistingPassphrases`. See explanation above under `validateNewPassword`.

Transformations of the passphrase are not configurable, as they must be the same in order for the user to log in again with the same passphrase. They include the following:
 - Passphrase is transformed to all lower case, so user doesn't need to remember capitalization
 - All punctuation and other non-alphanumeric characters are removed; intention is for the password to be a sequence of words (and possibly numbers) only.  Note that characters like `'é'` are treated as non-alphanumeric and are removed
 - All repeated words are removed, leaving only the first instance, to avoid passphrases like `'ab ab ab ab ab ab'`
 - All single-character words are removed, to avoid passphrases like `a b c d e f g`
 
The resulting passphrase is only used if it has the minimum number of words set by `passphrase.minWords` in the **main** module `config` object, after duplicate words were removed. (Note that users could be confused if they use the required 6-word passphrase and duplicate or single-character words are removed, resulting in an error based on passphrase length)

 - The default value of `passphrase.minWords = 6` gives 54 bits of entropy, which is strong based on an online recommendation in 2021.  [This Science Direct publication](https://www.sciencedirect.com/science/article/pii/S0019995864903262) suggests that in English, each word has ~10 bits of entropy.

The resulting passphrase is placed into `req.body.password` (or the alternative path configured in the main module `config` object), so that your application can not worry about whether a password or passphrase was used, and just refer to `req.body.password`.

The `allowNewPassphrases` and `allowExistingPassphrases` `config` objects are identical and have the following defaults:
```javascript
const config = {
        
        // return an error if there is neither a password or passphrase
        allowNeither: false,
        haveNeitherMessage: `Need req.body.password or req.body.passphrase`,
        
        // (having both a password and passphrase always returns an error)
        haveBothMessage: `Need only one of req.body.password or req.body.passphrase`,

        // Only for this one, you can use ${minWords} in a non-template string:
        shortPassphraseMessage: 'Normalized passphrase needs ${minWords} unique words > 1 character',

        errorStatus: 400 // 400 is 'Bad Request'.
}
```
 - `allowNeither: false` returns an error to the client if there is neither a `password` or `passphrase` on the request body; use `true` to turn this off and permit such requests
 - `haveNeitherMessage` is the error message to send to the client when neither a password nor passphrase is provided
 - `haveBothMessage` is the error message to send to the client when both a password and passphrase (can't turn this one off)
 - `shortPassphraseMessage` is the error message to send when the normalized passphrase is not long enough. Only in this error message, you can include `'${minWords}'` in a non-template string to include the number of words required
 - errorStatus is the response status (`400` is 'Bad Request')

## `sendPasswordRequirements`

Sends an object in JSON format with the chosen password rules, for enforcement on the client side before making the request.
- Note that `sendPasswordRequirements` is a normal Express middleware function, and does **not** need to be executed inline to return the middleware.

```javascript
const {sendPasswordRequirements} = ValidateAuth({password:{override: true}});

app.get('/password-requirements', sendPasswordRequirements);

// when 'override' is 'true', responds to the client with the following in JSON: 
// {
//     minLength: 1,
//     needMixed: false,
//     needSymbol: false,
//     needNumber: false,
//     needAlpha: false
// }
```

```javascript
const {sendPasswordRequirements} = ValidateAuth();

app.get('/password-requirements', sendPasswordRequirements);
// When 'override' is 'false', or not specified, responds to
// the client with the following in JSON: 
// {
//     minLength: 8,
//     needMixed: true,
//     needSymbol: true,
//     needNumber: true,
//     needAlpha: true
// }
```