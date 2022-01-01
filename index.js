module.exports = (config={}) => {
    
    // object names on req.body; defaults are .email, .password, .passphrase:
    const emailLocation = config.emailLocation || 'email';
    const passwordLocation = config.passwordLocation || 'password';
    const passphraseLocation = config.passphraseLocation || 'passphrase';
    
    // Option to transform email to lowercase: (default is true)
    const transformEmailLowerCase = config.transformEmailLowerCase === false ? false: true;

    // Requirements for passwords: (with sensible defaults, and override)
    const pReqs = pwdReqs(config.password);

    // Words required in passphrase:
    const minWords = (config.passphrase && config.passphrase.minWords) || 9;


    return { 
        // middleware:
        sendPasswordRequirements: (req, res) =>{res.json(pReqs);},
        allowPassphrases,
        validateEmail,
        validateNewPassword

    }

    function allowPassphrases(config={}) {

        const allowNeither = config.allowNeither || false;
        const haveNeitherMessage = config.haveNeitherMessage || `Need req.body.${passwordLocation} or req.body.${passphraseLocation}`;
        const haveBothMessage = config.haveBothMessage || `Need only one of req.body.${passwordLocation} or req.body.${passphraseLocation}`;
        const shortPassphraseMessage = (config.shortPassphraseMessage && typeof config.shortPassphraseMessage === 'string' && config.shortPassphraseMessage.replace('${minWords}',minWords)) || `Normalized passphrase needs ${minWords} unique words > 1 character`;
        const errorStatus = config.errorStatus || 400;

        return (req, res, next) => {
        
            req._passphraseAllowed = true;
            
            if (!req.body) return next();
            
            if (!allowNeither && !req.body[passwordLocation] && !req.body[passphraseLocation]) return res.status(errorStatus).send(haveNeitherMessage);
            if (req.body[passwordLocation] && req.body[passphraseLocation]) return res.status(errorStatus).send(haveBothMessage);
            
            if (!req.body[passphraseLocation]) return next();
            
            const candidate = normalizePassphrase(passphrase);
    
            if (req._newPasswordCalled && candidate.split(' ').length < minWords)
                res.status(errorStatus).send(shortPassphraseMessage);
            
            req.body[passwordLocation] = candidate;
            
            next();
            
        }
    }

    function validateEmail(config={}) {
    
        const invalidEmailMessage = config.invalidEmailMessage || 'Invalid email address';
        const errorStatus = config.errorStatus || 400;

        return (req, res, next) => {
        
            if (!req.body) return next();
            if (!req.body[emailLocation]) return next();
            
            req.body[emailLocation] = req.body[emailLocation].trim();
            if (transformEmailLowerCase) req.body[emailLocation] = req.body[emailLocation].toLowerCase();
            
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            if (!re.test(email)) return res.status(errorStatus).send(invalidEmailMessage);
            
            next();
         
        }  
        
    }

    function validateNewPassword(config={}) {
        
        const invalidPasswordMessage = config.invalidPasswordMessage || `Password doesn't meet requirements`;
        const errorStatus = config.errorStatus || 400;
        
        return (req, res, next) => {
        
            if (req._passphraseAllowed) throw new Error('validateNewPassword needs to be passed before allowPassphrases');
        
            req._newPasswordCalled = true;

            if (!req.body) return next();
            if (!req.body[passwordLocation]) return next();
        
            const candidate = req.body[passwordLocation];
        
            if (!validPassword(candidate)) return res.status(errorStatus).send(invalidPasswordMessage);
        
            next();
            
        }

    }

    function validPassword(pass) {

        const {minLength,needMixed,needSymbol,needNumber,needAlpha} = pReqs;
    
        const meetsMinLength = (np) => np.length >= minLength;
        const hasMixed = (np) => (np !== np.toUpperCase() && np !== np.toLowerCase());
        const hasSymbol = (np) => !!Array.from(np).find((c)=>{return (c.toUpperCase()===c.toLowerCase() && !(Number(c)>0) && (c !== '0'))});
        const hasNumber = (np) => !!Array.from(np).find((c)=>{return (Number(c)>0 || c==='0');});
        const hasAlpha = (np) => (np !== np.toUpperCase() || np !== np.toLowerCase());
    
        return meetsMinLength(pass)
               && (!needMixed || hasMixed(pass))
               && (!needSymbol || hasSymbol(pass))
               && (!needNumber || hasNumber(pass))
               && (!needAlpha || hasAlpha(pass));
    
    }

}

function pwdReqs(password={}) {

    // allow override, for development:
    if (password.override) return {
        minLength: 1,
        needMixed: false,
        needSymbol: false,
        needNumber: false,
        needAlpha: false
    };
    
    // use specified values, or most restrictive defaults:
    return { 
        minLength: password.minLength || 8,
        needMixed: password.needMixed===false ? false : true,
        needSymbol: password.needSymbol===false ? false : true,
        needNumber: password.needNumber===false ? false : true,
        needAlpha: password.needAlpha===false ? false : true
    }
}


function normalizePassphrase(input) {
    
    // make passphrase not case-sensitive
    let i = input.toLowerCase();
    let o = '';

    // reduce to only the allowed characters: (latin alphabet and numerals, and space)
    const a = 'abcdefghijklmnopqrstuvwxyz 1234567890';
    for (let n=0; n<i.length; n++) {
        if (a.includes(i[n])) o += i[n];
        else o += ' ';
    }
    
    // clean up after removing some characters
    while (o.includes('  ')) o = o.replace('  ',' ');
    
    // remove duplicate and single-letter words
    const oWords = o.trim().split(' ').filter(w=>w.length>1);
    const nWords = [];
    for (let n=0; n<oWords.length; n++) if (!nWords.includes(oWords[n])) nWords.push(oWords[n]);

    return nWords.join(' ');

}