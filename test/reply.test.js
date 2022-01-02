const expect = require('chai').expect;

const ValidateAuth = require('../index.js');
const reply = ValidateAuth().__reply;


describe(`reply(res, status, payload)`, ()=>{
    
    it(`Sets the status code`,(done)=>{
        const status = 200;
        const payload = "";
        const res = {
            status: (s)=>{
                expect(s).to.equal(status);
                done();
            },
            json: (obj)=>{
                // done();
            },
            send: (str)=>{
                // done();
            }
        };
        reply(res, status, payload);
    });

    it(`Chooses 'send' for a string`,(done)=>{
        const status = 200;
        const payload = "";
        const res = {
            status: (s)=>{
                // done();
            },
            json: (obj)=>{
                // done();
            },
            send: (str)=>{
                expect(true).to.be.true;
                done();
            }
        };
        reply(res, status, payload);
    });

    it(`Chooses 'json' for an object`,(done)=>{
        const status = 200;
        const payload = {en: 'hi', frCA: 'bonjour'};
        const res = {
            status: (s)=>{
                // done();
            },
            json: (obj)=>{
                expect(true).to.be.true;
                done();
            },
            send: (str)=>{
                // done();
            }
        };
        reply(res, status, payload);
    });

});