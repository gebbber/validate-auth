const expect = require('chai').expect;

const ValidateAuth = require('../index.js');


describe(`validPassword(candidate) //with default password rules`, ()=>{

    
    it(`returns a function when executed with no argument`,()=>{
        const validateNewPassword = ValidateAuth().validateNewPassword;
        const middleware = validateNewPassword();
        expect(middleware).to.be.a('function');
    });
    
    it(`returns a function when executed with an empty options object`,()=>{
        const validateNewPassword = ValidateAuth().validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        expect(middleware).to.be.a('function');
    });
    
    it(`throws an error if req._passphraseAllowed is true`,()=>{
        const validateNewPassword = ValidateAuth().validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={_passphraseAllowed: true};
        const res={};
        const next=()=>{};
        expect(()=>{middleware(req, res, next)}).to.throw('needs to be passed before');
    });
    
    it(`executes 'next' if there is no request body`,(done)=>{
        const validateNewPassword = ValidateAuth().validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: undefined};
        const res={};
        const next=done;
        middleware(req, res, next);
    });
    
    it(`executes 'next' if there is no password at the default location`,(done)=>{
        const validateNewPassword = ValidateAuth().validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: undefined, pwd: 'Aaaaaa1!'}};
        const res={};
        const next=done;
        middleware(req, res, next);
    });
    
    it(`executes 'next' if there is no password at a specified alternative location`,(done)=>{
        const validateNewPassword = ValidateAuth({passwordLocation: 'pwd'}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: 'Aaaaaa1!', pwd: undefined}};
        const res={};
        const next=done;
        middleware(req, res, next);
    });


    it(`sets a default status of 400 if there is an invalid password specified at the default location`,(done)=>{
        const validateNewPassword = ValidateAuth({}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: '??', pwd: undefined}};
        const res={status: (n)=>{
            expect(n).to.equal(400);
            done()
        }};
        const next=()=>{};
        middleware(req, res, next);
    });

    it(`sets a default status of 400 if there is an invalid password at a specified alternative location`,(done)=>{
        const validateNewPassword = ValidateAuth({passwordLocation: 'pwd'}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: undefined, pwd: '??'}};
        const res={status: (n)=>{
            expect(n).to.equal(400);
            done();
        }};
        const next = ()=>{};        
        middleware(req, res, next);
    });

    it(`sets a custom status if there is an invalid password specified at the default location`,(done)=>{
        const validateNewPassword = ValidateAuth({}).validateNewPassword;
        const options = {errorStatus: 999};
        const middleware = validateNewPassword(options);
        const req={body: {password: '??', pwd: undefined}};
        const res={status: (n)=>{
            expect(n).to.equal(999);
            done()
        }};
        const next=()=>{};
        middleware(req, res, next);
    });

    it(`sets a custom status if there is an invalid password at a specified alternative location`,(done)=>{
        const validateNewPassword = ValidateAuth({passwordLocation: 'pwd'}).validateNewPassword;
        const options = {errorStatus: 999};
        const middleware = validateNewPassword(options);
        const req={body: {password: undefined, pwd: '??'}};
        const res={status: (n)=>{
            expect(n).to.equal(999);
            done();
        }};
        const next = ()=>{};        
        middleware(req, res, next);
    });

    it(`sends a default message if there is an invalid password specified at the default location`,(done)=>{
        const validateNewPassword = ValidateAuth({}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: '??', pwd: undefined}};
        const res={
            status: ()=>{},
            send: (p)=>{
                expect(p).to.equal(`Password doesn't meet requirements`);
                done();
            }
        };
        const next=()=>{};
        middleware(req, res, next);
    });

    it(`sends a default message if there is an invalid password at a specified alternative location`,(done)=>{
        const validateNewPassword = ValidateAuth({passwordLocation: 'pwd'}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: undefined, pwd: '??'}};
        const res={
            status: ()=>{},
            send: (p)=>{
                expect(p).to.equal(`Password doesn't meet requirements`);
                done();
            }
        };
        const next = ()=>{};        
        middleware(req, res, next);
    });

    const altMessageStr = 'alternative message';

    it(`sends a custom message string if there is an invalid password specified at the default location`,(done)=>{
        const validateNewPassword = ValidateAuth({}).validateNewPassword;
        const options = {invalidPasswordMessage: altMessageStr};
        const middleware = validateNewPassword(options);
        const req={body: {password: '??', pwd: undefined}};
        const res={
            status: ()=>{},
            send: (p)=>{
                expect(p).to.equal(altMessageStr);
                done();
            }
        };
        const next=()=>{};
        middleware(req, res, next);
    });

    it(`sends a custom message string if there is an invalid password at a specified alternative location`,(done)=>{
        const validateNewPassword = ValidateAuth({passwordLocation: 'pwd'}).validateNewPassword;
        const options = {invalidPasswordMessage: altMessageStr};
        const middleware = validateNewPassword(options);
        const req={body: {password: undefined, pwd: '??'}};
        const res={
            status: ()=>{},
            send: (p)=>{
                expect(p).to.equal(altMessageStr);
                done();
            }
        };
        const next = ()=>{};        
        middleware(req, res, next);
    });

    const altMessageObj = {en: 'alternative message'};
    it(`passes an object to res.json if there is an invalid password specified at the default location`,(done)=>{
        const validateNewPassword = ValidateAuth({}).validateNewPassword;
        const options = {invalidPasswordMessage: altMessageObj};
        const middleware = validateNewPassword(options);
        const req={body: {password: '??', pwd: undefined}};
        const res={
            status: ()=>{},
            json: (p)=>{
                expect(p).to.equal(altMessageObj);
                done();
            }
        };
        const next=()=>{};
        middleware(req, res, next);
    });

    it(`passes an object to res.json if there is an invalid password at a specified alternative location`,(done)=>{
        const validateNewPassword = ValidateAuth({passwordLocation: 'pwd'}).validateNewPassword;
        const options = {invalidPasswordMessage: altMessageObj};
        const middleware = validateNewPassword(options);
        const req={body: {password: undefined, pwd: '??'}};
        const res={
            status: ()=>{},
            json: (p)=>{
                expect(p).to.equal(altMessageObj);
                done();
            }
        };
        const next = ()=>{};        
        middleware(req, res, next);
    });

    it(`executes 'next' if there is a valid password specified at the default location`,(done)=>{
        const validateNewPassword = ValidateAuth({}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: 'Aaaaaa1!', pwd: undefined}};
        const res={status: ()=>{},send:()=>{}};
        const next=done;
        middleware(req, res, next);
    });

    it(`executes 'next' if there is a valid password at a specified alternative location`,(done)=>{
        const validateNewPassword = ValidateAuth({passwordLocation: 'pwd'}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: undefined, pwd: 'Aaaaaa1!'}};
        const res={status: ()=>{},send:()=>{}};
        const next=done;
        middleware(req, res, next);
    });

    it(`Accepts a password based on specified alternative criteria, and executes next`,(done)=>{
        const validateNewPassword = ValidateAuth({password:{minLength: 4}}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: 'Aa1!'}};
        const res={status: ()=>{},send:()=>{}};
        const next=done;
        middleware(req, res, next);
    });

    it(`Rejects a password based on specified alternative criteria, and executes send`,(done)=>{
        const validateNewPassword = ValidateAuth({password:{minLength: 5}}).validateNewPassword;
        const options = {};
        const middleware = validateNewPassword(options);
        const req={body: {password: 'Aa1!'}};
        const res={status: ()=>{},send:()=>{done();}};
        const next=()=>{};
        middleware(req, res, next);
    });

});