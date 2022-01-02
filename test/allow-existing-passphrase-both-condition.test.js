const expect = require('chai').expect;

const ValidateAuth = require('../index.js');

describe('allowExistingPassphrase(config) sets a status when it has BOTH password and passphrase', ()=>{

    it(`With status 400 in standard/standard locations`, done=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {password: 'text', passphrase: 'text'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(400);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`With status 400 in custom/standard locations`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {pwd: 'text', passphrase: 'text'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(400);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`With status 400 in standard/custom locations`, done=>{
        const allowExistingPassphrase = ValidateAuth({passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {password: 'text', phrase: 'text'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(400);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`With status 400 in custom/custom locations`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd', passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {pwd: 'text', phrase: 'text'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(400);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`With a custom status in standard/standard locations`, done=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({errorStatus:999});
        const req = {body: {password: 'text', passphrase: 'text'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(999);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`With a custom status in custom/standard locations`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({errorStatus:999});
        const req = {body: {pwd: 'text', passphrase: 'text'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(999);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`With a custom status in standard/custom locations`, done=>{
        const allowExistingPassphrase = ValidateAuth({passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({errorStatus:999});
        const req = {body: {password: 'text', phrase: 'text'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(999);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`With a custom status in custom/custom locations`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd', passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({errorStatus:999});
        const req = {body: {pwd: 'text', phrase: 'text'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(999);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

});

describe('allowExistingPassphrase(config) sends a response when it has BOTH password and passphrase', ()=>{
    
    it(`in standard/standard locations, with a standard response`, done=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {password: 'text', passphrase: 'text'}};
        const res = {
            status: ()=>{},
            send: (s)=>{
                expect(s).to.include(`Can't have both`);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in custom/standard locations, with a standard response`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {pwd: 'text', passphrase: 'text'}};
        const res = {
            status: ()=>{},
            send: (s)=>{
                expect(s).to.include(`Can't have both`);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in standard/custom locations, with a standard response`, done=>{
        const allowExistingPassphrase = ValidateAuth({passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {password: 'text', phrase: 'text'}};
        const res = {
            status: ()=>{},
            send: (s)=>{
                expect(s).to.include(`Can't have both`);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in custom/custom locations, with a standard response`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd', passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {pwd: 'text', phrase: 'text'}};
        const res = {
            status: ()=>{},
            send: (s)=>{
                expect(s).to.include(`Can't have both`);
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in standard/standard locations, with a custom response string`, done=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({haveBothMessage: 'custom response'});
        const req = {body: {password: 'text', passphrase: 'text'}};
        const res = {
            status: ()=>{},
            send: (s)=>{
                expect(s).to.equal('custom response');
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in custom/standard locations, with a custom response string`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({haveBothMessage: 'custom response'});
        const req = {body: {pwd: 'text', passphrase: 'text'}};
        const res = {
            status: ()=>{},
            send: (s)=>{
                expect(s).to.equal('custom response');
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in standard/custom locations, with a custom response string`, done=>{
        const allowExistingPassphrase = ValidateAuth({passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({haveBothMessage: 'custom response'});
        const req = {body: {password: 'text', phrase: 'text'}};
        const res = {
            status: ()=>{},
            send: (s)=>{
                expect(s).to.equal('custom response');
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in custom/custom locations, with a custom response string`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd', passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({haveBothMessage: 'custom response'});
        const req = {body: {pwd: 'text', phrase: 'text'}};
        const res = {
            status: ()=>{},
            send: (s)=>{
                expect(s).to.equal('custom response');
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in standard/standard locations, with a custom response object`, done=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({haveBothMessage: {en: 'english response'}});
        const req = {body: {password: 'text', passphrase: 'text'}};
        const res = {
            status: ()=>{},
            json: (o)=>{
                expect(o.en).to.equal('english response');
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in custom/standard locations, with a custom response object`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({haveBothMessage: {en: 'english response'}});
        const req = {body: {pwd: 'text', passphrase: 'text'}};
        const res = {
            status: ()=>{},
            json: (o)=>{
                expect(o.en).to.equal('english response');
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in standard/custom locations, with a custom response object`, done=>{
        const allowExistingPassphrase = ValidateAuth({passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({haveBothMessage: {en: 'english response'}});
        const req = {body: {password: 'text', phrase: 'text'}};
        const res = {
            status: ()=>{},
            json: (o)=>{
                expect(o.en).to.equal('english response');
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`in custom/custom locations, with a custom response object`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd', passphraseLocation: 'phrase'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase({haveBothMessage: {en: 'english response'}});
        const req = {body: {pwd: 'text', phrase: 'text'}};
        const res = {
            status: ()=>{},
            json: (o)=>{
                expect(o.en).to.equal('english response');
                done();
            },
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

});
