const expect = require('chai').expect;

const ValidateAuth = require('../index.js');


describe(`validateEmail(config)`, ()=>{

    it(`Returns a function when executed with no argument`,()=>{
        const validateEmail = ValidateAuth().validateEmail;
        const middleware = validateEmail();
        expect(middleware).to.be.a('function');
    });

    it(`Returns a function when executed with an empty options object`,()=>{
        const validateEmail = ValidateAuth().validateEmail;
        const options = {};
        const middleware = validateEmail(options);
        expect(middleware).to.be.a('function');
    });

    it(`Runs 'next' if no request body`,(done)=>{
        const moduleOptions = {}; //{emailLocation:'', transformEmailLowerCase:''}
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req={};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };
        const next = done;
        middleware(req, res, next);
    });

    it(`Runs 'next' if no email at a specified alternative location`,(done)=>{
        const moduleOptions = {emailLocation: 'address'}; //{emailLocation:'', transformEmailLowerCase:''}
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req={body: {email: 'wrong@address-location.com'}};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };
        const next = done;
        middleware(req, res, next);
    });

    it(`Trims whitespace from an email address at the default location`,(done)=>{
        const moduleOptions = {}; //{emailLocation:'', transformEmailLowerCase:''}
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req={body: {email: '  test@somewhere.net  '}};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };
        const next = ()=>{
            expect(req.body.email).to.equal('test@somewhere.net');
            done();
        };
        middleware(req, res, next);
    });

    it(`Trims whitespace from an email address at a specified alternative location`,(done)=>{
        const moduleOptions = {emailLocation: 'address'}; //{emailLocation:'', transformEmailLowerCase:''}
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req={body: {address: '  test@somewhere.net  '}};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };
        const next = ()=>{
            expect(req.body.address).to.equal('test@somewhere.net');
            done();
        };
        middleware(req, res, next);
    });

    it(`Transforms an email to lower case by default, at the default location`,(done)=>{
        const moduleOptions = {}; //{emailLocation:'', transformEmailLowerCase:''}
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req={body: {email: 'TEST@SOME.NET'}};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };
        const next = ()=>{
            expect(req.body.email).to.equal('test@some.net');
            done();
        };
        middleware(req, res, next);
    });

    it(`Transforms an email to lower case by default, at a specified alternative location`,(done)=>{
        const moduleOptions = {emailLocation: 'address'}; //{emailLocation:'', transformEmailLowerCase:''}
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req={body: {address: 'TEST@SOME.NET'}};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };
        const next = ()=>{
            expect(req.body.address).to.equal('test@some.net');
            done();
        };
        middleware(req, res, next);
    });

    it(`Transforms an email to lower case, when explicitly specified`,(done)=>{
        const moduleOptions = {transformEmailLowerCase: true}; //{emailLocation:'', transformEmailLowerCase:''}
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req={body: {email: 'TEST@SOME.NET'}};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };
        const next = ()=>{
            expect(req.body.email).to.equal('test@some.net');
            done();
        };
        middleware(req, res, next);
    });

    it(`Preserves upper case on an email, when transformEmailLowerCase:false`,(done)=>{
        const moduleOptions = {transformEmailLowerCase: false}; //{emailLocation:'', transformEmailLowerCase:''}
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req={body: {email: 'TEST@SOME.NET'}};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };
        const next = ()=>{
            expect(req.body.email).to.not.equal('test@some.net');
            expect(req.body.email).to.equal('TEST@SOME.NET');
            done();
        };
        middleware(req, res, next);
    });

    
    // Testing responses to various email address attempts
    const emailsToTry = [
        'a@b.co', true,
        'a@.b.co', false,
        'a@b.co.', false,
        'a@b.c', false,
        'a@b.c.co', true,
        'a@b..c.co', false,
        'a@b', false,
        '@b.co', false,
        'a@', false,
        'a.@b.co', false,
        '.a@b.co', false,
        '.a.@b.co', false,
        'a.b@b.co', true,
        'a..b@b.co', false,
        'a.b.c@b.co', true,
    ];

    if (emailsToTry.length % 2 !== 0) throw new Error('odd number of parameters in above array');
    const emails = []; const expected = [];
    while (emailsToTry.length) {
        if (typeof emailsToTry[0] === 'string') emails.push(emailsToTry.shift());
        else throw new Error('expecting an email address');
        if (typeof emailsToTry[0] === 'boolean') expected.push(emailsToTry.shift());
        else throw new Error('expecting an boolean');
    }

    it(`Correctly tests ${emails.length} email address${emails.length !== 1?'es':''}`,(done)=>{
        // This test will time out if it fails, or if any of the above email / boolean pairings
        // are incorrect!!!
        const moduleOptions = {transformEmailLowerCase: false};
        const validateEmail = ValidateAuth(moduleOptions).validateEmail;
        const middlewareOptions = {};
        const middleware = validateEmail(middlewareOptions);
        const req=emails.map(email=>{ return {body: {email}};});
        const res={
            status: ()=>{},
            send: ()=>{},
            json: ()=>{}
        };

        let tested = 0;
        
        const success = ()=>{tested++; if (tested===emails.length) done();};

        for (let i = 0; i<emails.length; i++) {
            if (expected[i]) middleware(req[i], res, success);
            else middleware(req[i], {...res, send:success}, ()=>{});
        }

    });

    it(`Sets a default status if a non-email-address is passed`,(done)=>{
        const validateEmail = ValidateAuth({}).validateEmail;
        const middleware = validateEmail();
        const req={body: {email: 'not-an-email'}};
        const res={
            status: (a)=>{
                expect(a).to.equal(400);
                done();
            },
            send: ()=>{},
            json: ()=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`Sends a default response string if a non-email-address is passed`,(done)=>{
        const validateEmail = ValidateAuth({}).validateEmail;
        const middleware = validateEmail();
        const req={body: {email: 'not-an-email'}};
        const res={
            status: ()=>{},
            send: (s)=>{
                expect(s).to.include('Invalid email address');
                done();
            },
            json: ()=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`Sends a specified alternative response status if a non-email-address is passed`,(done)=>{
        const validateEmail = ValidateAuth({}).validateEmail;
        const middleware = validateEmail({
            errorStatus: 999
        });
        const req={body: {email: 'not-an-email'}};
        const res={
            status: (e)=>{
                expect(e).to.equal(999);
                done();
            },
            send: ()=>{},
            json: ()=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`Sends a specified alternative response string with 'send' if a non-email-address is passed`,(done)=>{
        const validateEmail = ValidateAuth({}).validateEmail;
        const middleware = validateEmail({
            invalidEmailMessage: `bad address`
        });
        const req={body: {email: 'not-an-email'}};
        const res={
            status: ()=>{},
            send: (s)=>{
                expect(s).to.equal('bad address');
                done();
            },
            json: ()=>{}
        };
        const next = ()=>{};
        middleware(req, res, next);
    });

    it(`Sends a specified alternative response object with 'json' if a non-email-address is passed`,(done)=>{
        const o = {en: 'test'};
        const validateEmail = ValidateAuth({}).validateEmail;
        const middleware = validateEmail({
            invalidEmailMessage: o
        });
        const req={body: {email: 'not-an-email'}};
        const res={
            status: ()=>{},
            send: ()=>{},
            json: (ob)=>{
                expect(ob).to.equal(o);
                done();
            }
        };
        const next = ()=>{};
        middleware(req, res, next);
    });


});


