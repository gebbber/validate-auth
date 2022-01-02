const expect = require('chai').expect;

const ValidateAuth = require('../index.js');


describe(`pwdReqs(config.password = {})`, ()=>{
    
    it(`Returns an object`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
    });
    
    it(`Requires length 8 if no length is specified`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.minLength).to.equal(8);
    });
    
    it(`Requires a specific length when specified minLength:Number`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={minLength: 99};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.minLength).to.equal(99);
    });
    
    it(`Requires mixed upper/lowercase if not specified`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needMixed).to.equal(true);
    });
    
    it(`Requires mixed upper/lowercase when specified needMixed:true`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={needMixed: true};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needMixed).to.equal(true);
    });
    
    it(`Doesn't require mixed upper/lowercase when specified needMixed:false`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={needMixed: false};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needMixed).to.equal(false);
    });
    
    it(`Requires a symbol if not specified`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needSymbol).to.equal(true);
    });
    
    it(`Requires a symbol when specified needSymbol:true`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={needSymbol: true};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needSymbol).to.equal(true);
    });
    
    it(`Doesn't require a symbol when specified needSymbol:false`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={needSymbol: false};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needSymbol).to.equal(false);
    });
    
    it(`Requires a number if not specified`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needNumber).to.equal(true);
    });
    
    it(`Requires a number if specified needNumber:true`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={needNumber: true};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needNumber).to.equal(true);
    });
    
    it(`Doesn't require a number if specified needNumber:false`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={needNumber: false};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needNumber).to.equal(false);
    });
    
    it(`Requires an alpha if not specified`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needAlpha).to.equal(true);
    });
    
    it(`Requires an alpha if specified needAlpha:true`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={needAlpha:true};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needAlpha).to.equal(true);
    });
    
    it(`Doesn't require an alpha if specified needAlpha:false`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={needAlpha:false};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needAlpha).to.equal(false);
    });
    
    it(`Requires only one character when specified override:true`,()=>{
        const pwdReqs = ValidateAuth().__pwdReqs;
        const password={override:true};
        const reqs = pwdReqs(password);
        expect(reqs).to.be.an('object');
        expect(reqs.needAlpha).to.equal(false);
        expect(reqs.needNumber).to.equal(false);
        expect(reqs.needSymbol).to.equal(false);
        expect(reqs.needMixed).to.equal(false);
        expect(reqs.minLength).to.equal(1);
    });
    
});