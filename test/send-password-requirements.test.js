const expect = require('chai').expect;

const ValidateAuth = require('../index.js');

describe('sendPasswordRequirements(req, res)', ()=>{
    
    it('Runs res.json',(done)=>{
        const sendPR = ValidateAuth({}).sendPasswordRequirements;
        sendPR({}, {
            json: (o) => {
                done();         
            }
        });
    });

    it(`Sends an object with {minLength, needMixed, needSymbol, needNumber, needAlpha}`,(done)=>{
        const sendPR = ValidateAuth({}).sendPasswordRequirements;
        sendPR({}, {
            json: (o) => {
                expect(o).to.have.all.keys('minLength', 'needMixed', 'needSymbol', 'needNumber', 'needAlpha', 'minPassphraseWords');
                done();
            }
        });
    });

    it(`Sends an object with default password settings`, done=>{
        const sendPR = ValidateAuth({}).sendPasswordRequirements;
        sendPR({}, {
            json: (o) => {
                expect(o.minLength).to.equal(8);
                expect(o.needMixed).to.equal(true);
                expect(o.needSymbol).to.equal(true);
                expect(o.needNumber).to.equal(true);
                expect(o.needAlpha).to.equal(true);
                done();
            }
        });
    });

    it(`Sends an object with explicit 'true' password settings`, done=>{
        const password = {
            minLength: 10,
            needMixed: true,
            needSymbol: true,
            needNumber: true,
            needAlpha: true
        };
        const sendPR = ValidateAuth({password}).sendPasswordRequirements;
        sendPR({}, {
            json: (o) => {
                expect(o.minLength).to.equal(10);
                expect(o.needMixed).to.equal(true);
                expect(o.needSymbol).to.equal(true);
                expect(o.needNumber).to.equal(true);
                expect(o.needAlpha).to.equal(true);
                done();
            }
        });
    });
    
    it(`Sends an object with explicit 'false' password settings`, done=>{
        const password = {
            minLength: 3,
            needMixed: false,
            needSymbol: false,
            needNumber: false,
            needAlpha: false
        };
        const sendPR = ValidateAuth({password}).sendPasswordRequirements;
        sendPR({}, {
            json: (o) => {
                expect(o.minLength).to.equal(3);
                expect(o.needMixed).to.equal(false);
                expect(o.needSymbol).to.equal(false);
                expect(o.needNumber).to.equal(false);
                expect(o.needAlpha).to.equal(false);
                done();
            }
        });
    });

    it(`Sends an object with default password settings, when explicitly set override:false`, done=>{
        const sendPR = ValidateAuth({password:{override:false}}).sendPasswordRequirements;
        sendPR({}, {
            json: (o) => {
                expect(o.minLength).to.equal(8);
                expect(o.needMixed).to.equal(true);
                expect(o.needSymbol).to.equal(true);
                expect(o.needNumber).to.equal(true);
                expect(o.needAlpha).to.equal(true);
                done();
            }
        });
    });

    it(`Sends an object with minimal password settings, when explicitly set override:true`, done=>{
        const sendPR = ValidateAuth({password:{override:true}}).sendPasswordRequirements;
        sendPR({}, {
            json: (o) => {
                expect(o.minLength).to.equal(1);
                expect(o.needMixed).to.equal(false);
                expect(o.needSymbol).to.equal(false);
                expect(o.needNumber).to.equal(false);
                expect(o.needAlpha).to.equal(false);
                done();
            }
        });
    });

});