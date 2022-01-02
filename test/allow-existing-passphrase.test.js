const expect = require('chai').expect;

const ValidateAuth = require('../index.js');


describe('allowExistingPassphrase(config)', ()=>{
    
    it(`Returns a function when executed with no argument`,()=>{
        const allowExistingPassphrase = ValidateAuth().allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        expect(middleware).to.be.a('function');
    });

    it(`Returns a function when executed with an empty config object`, ()=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        expect(middleware).to.be.a('function');
    });

    it(`It sets req._passphraseAllowed to true`, done=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {};
        const res = {};
        const next = ()=>{
            expect(req._passphraseAllowed).to.be.true;
            done();
        };
        middleware(req, res, next);
    });

    it(`It calls next() if there's no request body`, done=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: undefined};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });

    it(`It calls next() if there's a password but no passphrase (standard/standard location)`, done=>{
        const allowExistingPassphrase = ValidateAuth({}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {password: 'abc', passphrase:null}};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });

    it(`It calls next() if there's a password but no passphrase (custom/standard location)`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {pwd: 'abc', passphrase:null}};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });

    it(`It calls next() if there's a password but no passphrase (standard/custom location)`, done=>{
        const allowExistingPassphrase = ValidateAuth({passphraseLocation: 'pph'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {password: 'abc', pph:null}};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });

    it(`It calls next() if there's a password but no passphrase (custom/custom location)`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation: 'pwd',passphraseLocation: 'pph'}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {pwd: 'abc', pph:null}};
        const res = {};
        const next = done;
        middleware(req, res, next);
    });


});


describe('allowExistingPassphrase(config) acts differently than allowNewPassphrase:', ()=>{

    it(`It accepts a passphrase that's too short, sets the password at a standard location, and calls next`, done=>{
        const allowExistingPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {passphrase:'Abc Def'}};
        const res = {};
        const next = ()=>{
            expect(req.body.password).to.equal('abc def');
            done();
        };
        middleware(req, res, next);
    });

    it(`It accepts a passphrase that's too short, sets the password at a custom location, and calls next`, done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation:'pwd',passphrase:{minWords:3}}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {passphrase:'Abc Def'}};
        const res = {};
        const next = ()=>{
            expect(req.body.pwd).to.equal('abc def');
            done();
        };
        middleware(req, res, next);
    });



    it("It normalizes a good one and sets the password, at a standard password location, and calls next()", done=>{
        const allowExistingPassphrase = ValidateAuth({passphrase:{minWords:3}}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {passphrase:'Abc Def gHi'}};
        const res = {};
        const next = ()=>{
            expect(req.body.password).to.equal('abc def ghi');
            done();
        };
        middleware(req, res, next);
    });

    it("It normalizes a good one and sets the password, at a custom password location, and calls next()", done=>{
        const allowExistingPassphrase = ValidateAuth({passwordLocation:'myPwd',passphrase:{minWords:3}}).allowExistingPassphrase;
        const middleware = allowExistingPassphrase();
        const req = {body: {passphrase:'Abc Def gHi'}};
        const res = {};
        const next = ()=>{
            expect(req.body.myPwd).to.equal('abc def ghi');
            done();
        };
        middleware(req, res, next);
    });


});