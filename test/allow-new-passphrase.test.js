const expect = require('chai').expect;

const ValidateAuth = require('../index.js');


describe('allowNewPassphrase(config)', ()=>{
    
    it(`Returns a function when executed with no argument`,()=>{
        const allowNewPassphrase = ValidateAuth().allowNewPassphrase;
        const middleware = allowNewPassphrase();
        expect(middleware).to.be.a('function');
    });

    it(`Returns a function when executed with an empty config object`, ()=>{
        const allowNewPassphrase = ValidateAuth({}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        expect(middleware).to.be.a('function');
    });

    it(`It sets req._passphraseAllowed to true`, done=>{
        const allowNewPassphrase = ValidateAuth({}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {};
        const res = {};
        const next = ()=>{
            expect(req._passphraseAllowed).to.be.true;
            done();
        };
        middleware(req, res, next);
    });

    it(`It calls next() if there's no request body`, done=>{
        const allowNewPassphrase = ValidateAuth({}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: undefined};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });

    it(`It calls next() if there's a password but no passphrase (standard/standard location)`, done=>{
        const allowNewPassphrase = ValidateAuth({}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: {password: 'abc', passphrase:null}};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });

    it(`It calls next() if there's a password but no passphrase (custom/standard location)`, done=>{
        const allowNewPassphrase = ValidateAuth({passwordLocation: 'pwd'}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: {pwd: 'abc', passphrase:null}};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });

    it(`It calls next() if there's a password but no passphrase (standard/custom location)`, done=>{
        const allowNewPassphrase = ValidateAuth({passphraseLocation: 'pph'}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: {password: 'abc', pph:null}};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });

    it(`It calls next() if there's a password but no passphrase (custom/custom location)`, done=>{
        const allowNewPassphrase = ValidateAuth({passwordLocation: 'pwd',passphraseLocation: 'pph'}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: {pwd: 'abc', pph:null}};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });


});


describe('allowNewPassphrase(config) acts differently than allowExistingPassphrase:', ()=>{

    it(`It rejects a passphrase that's too short, setting a standard status`, done=>{
        const allowNewPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: {passphrase:'abc def'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(400);
                done();
            },
            send: (s)=>{},
            json: (o)=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`It rejects a passphrase that's too short, setting a custom status`, done=>{
        const allowNewPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase({errorStatus:999});
        const req = {body: {passphrase:'abc def'}};
        const res = {
            status: (s)=>{
                expect(s).to.equal(999);
                done();
            },
            send: (s)=>{},
            json: (o)=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`It rejects a passphrase that's too short, sending a standard response string`, done=>{
        const allowNewPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: {passphrase:'abc def'}};
        const res = {
            status: (s)=>{},
            send: (s)=>{
                expect(s).to.include(`unique words > 1 character`);
                done();
            },
            json: (o)=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`It rejects a passphrase that's too short, sending a custom response string`, done=>{
        const allowNewPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase({shortPassphraseMessage: 'my custom string'});
        const req = {body: {passphrase:'abc def'}};
        const res = {
            status: (s)=>{},
            send: (s)=>{
                expect(s).to.equal(`my custom string`);
                done();
            },
            json: (o)=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`It rejects a passphrase that's too short, sending a custom response object`, done=>{
        const allowNewPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase({shortPassphraseMessage: {en:'my custom string'}});
        const req = {body: {passphrase:'abc def'}};
        const res = {
            status: (s)=>{},
            send: (s)=>{},
            json: (o)=>{
                expect(o.en).to.equal(`my custom string`);
                done();
            }
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it("For a passphrase that's too short, it substitutes ${minWords} in the custom response string", done=>{
        const allowNewPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase({shortPassphraseMessage: 'need ${minWords}'});
        const req = {body: {passphrase:'abc def'}};
        const res = {
            status: (s)=>{},
            send: (s)=>{
                expect(s).to.equal('need 3');
                done();
            },
            json: (o)=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it("For a passphrase that's too short, it substitutes ${minWords} in each item in the custom response object", done=>{
        const allowNewPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase({shortPassphraseMessage: {en:'need ${minWords}'}});
        const req = {body: {passphrase:'abc def'}};
        const res = {
            status: (s)=>{},
            send: (s)=>{},
            json: (o)=>{
                expect(o.en).to.equal(`need 3`);
                done();
            }
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it("It normalizes a good one and sets the password, at a standard password location, and calls next()", done=>{
        const allowNewPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: {passphrase:'Abc Def gHi'}};
        const res = {};
        const next = ()=>{
            expect(req.body.password).to.equal('abc def ghi');
            done();
        };
        middleware(req, res, next);
    });

    it("It normalizes a good one and sets the password, at a custom password location, and calls next()", done=>{
        const allowNewPassphrase = ValidateAuth({passwordLocation:'myPwd',passphrase:{minWords:3}}).allowNewPassphrase;
        const middleware = allowNewPassphrase();
        const req = {body: {passphrase:'Abc Def gHi'}};
        const res = {};
        const next = ()=>{
            expect(req.body.myPwd).to.equal('abc def ghi');
            done();
        };
        middleware(req, res, next);
    });


});