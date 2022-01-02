const expect = require('chai').expect;

const ValidateAuth = require('../index.js');



describe(`validPassword(candidate) //with default password rules`, ()=>{

    const vp = ValidateAuth().validPassword;
    
    it(`accepts a complex password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aaaaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all upper case`,()=>{
        const pass = "AAAAAA1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all lower case`,()=>{
        const pass = "aaaaaa1!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing symbol`,()=>{
        const pass = "Aaaaaa11";
        expect(vp(pass)).to.be.false;
    });
    
});

describe(`validPassword(candidate) //with specific length requirement`, ()=>{

    const vp = ValidateAuth({password:{minLength: 6}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 5`,()=>{
        const pass = "Aaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all upper case`,()=>{
        const pass = "AAAA1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all lower case`,()=>{
        const pass = "aaaa1!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaa!!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing symbol`,()=>{
        const pass = "Aaaa11";
        expect(vp(pass)).to.be.false;
    });
    
});

describe(`validPassword(candidate) //with specific needMixed:true requirement`, ()=>{

    const vp = ValidateAuth({password:{needMixed: true}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aaaaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all upper case`,()=>{
        const pass = "AAAAAA1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all lower case`,()=>{
        const pass = "aaaaaa1!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing symbol`,()=>{
        const pass = "Aaaaaa11";
        expect(vp(pass)).to.be.false;
    });
    
});

describe(`validPassword(candidate) //with specific needMixed:false requirement`, ()=>{

    const vp = ValidateAuth({password:{needMixed: false}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aa1!1!1!!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aa1!1!!";
        expect(vp(pass)).to.be.false;
    });

    it(`accepts for all upper case`,()=>{
        const pass = "AA1!1!1!!";
        expect(vp(pass)).to.be.true;
    });

    it(`accepts for all lower case`,()=>{
        const pass = "aa1!1!1!!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.false;
    });
        
    it(`rejects for a missing symbol`,()=>{
        const pass = "AAaa1111";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for a missing alpha`,()=>{
        const pass = "1!1!1!1!";
        expect(vp(pass)).to.be.false;
    });
    
});

describe(`validPassword(candidate) //with specific needSymbol:true requirement`, ()=>{

    const vp = ValidateAuth({password:{needSymbol: true}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aaaaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all upper case`,()=>{
        const pass = "AAAAAA1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all lower case`,()=>{
        const pass = "aaaaaa1!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing symbol`,()=>{
        const pass = "Aaaaaa11";
        expect(vp(pass)).to.be.false;
    });
    
});

describe(`validPassword(candidate) //with specific needSymbol:false requirement`, ()=>{

    const vp = ValidateAuth({password:{needSymbol: false}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aaaaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all upper case`,()=>{
        const pass = "AAAAAA1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all lower case`,()=>{
        const pass = "aaaaaa1!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`accepts for a missing symbol`,()=>{
        const pass = "Aaaaaa11";
        expect(vp(pass)).to.be.true;
    });
    
});

describe(`validPassword(candidate) //with specific needNumber:true requirement`, ()=>{

    const vp = ValidateAuth({password:{needNumber: true}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aaaaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all upper case`,()=>{
        const pass = "AAAAAA1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all lower case`,()=>{
        const pass = "aaaaaa1!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing symbol`,()=>{
        const pass = "Aaaaaa11";
        expect(vp(pass)).to.be.false;
    });
    
});

describe(`validPassword(candidate) //with specific needNumber:false requirement`, ()=>{

    const vp = ValidateAuth({password:{needNumber: false}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aaaaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all upper case`,()=>{
        const pass = "AAAAAA1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for all lower case`,()=>{
        const pass = "aaaaaa1!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.true;
    });
    
    it(`rejects for a missing symbol`,()=>{
        const pass = "Aaaaaa11";
        expect(vp(pass)).to.be.false;
    });
    
});







describe(`validPassword(candidate) //with specific needMixed:false but needAlpha:true requirement`, ()=>{

    const vp = ValidateAuth({password:{needAlpha: true, needMixed: false}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aaaaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`accepts for all upper case`,()=>{
        const pass = "AAAAAA1!";
        expect(vp(pass)).to.be.true;
    });

    it(`accepts for all lower case`,()=>{
        const pass = "aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.false;
    });
    
    it(`rejects for a missing alpha`,()=>{
        const pass = "1!1!1!1!";
        expect(vp(pass)).to.be.false;
    });

    it(`rejects for a missing symbol`,()=>{
        const pass = "Aaaaaa11";
        expect(vp(pass)).to.be.false;
    });
    
});

describe(`validPassword(candidate) //with specific needMixed:false and needAlpha:false requirement`, ()=>{

    const vp = ValidateAuth({password:{needAlpha: false, needMixed: false}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects for a length 7`,()=>{
        const pass = "Aaaaa1!";
        expect(vp(pass)).to.be.false;
    });

    it(`accepts for all upper case`,()=>{
        const pass = "AAAAAA1!";
        expect(vp(pass)).to.be.true;
    });

    it(`accepts for all lower case`,()=>{
        const pass = "aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });
    
    it(`rejects for a missing numeral`,()=>{
        const pass = "Aaaaaa!!";
        expect(vp(pass)).to.be.false;
    });

    it(`accepts for a missing alpha`,()=>{
        const pass = "1!1!1!1!";
        expect(vp(pass)).to.be.true;
    });
    
    it(`rejects for a missing symbol`,()=>{
        const pass = "Aaaaaa11";
        expect(vp(pass)).to.be.false;
    });
    
});

describe(`validPassword(candidate) //with password:{override:true}`, ()=>{

    const vp = ValidateAuth({password:{override:true}}).validPassword;
    
    it(`accepts a proper password`,()=>{
        const pass = "Aaaaaa1!";
        expect(vp(pass)).to.be.true;
    });

    it(`rejects an empty password`,()=>{
        const pass = "";
        expect(vp(pass)).to.be.false;
    });

    it(`accepts a single upper-case alpha`,()=>{
        const pass = "A";
        expect(vp(pass)).to.be.true;
    });

    it(`accepts a single lower-case alpha`,()=>{
        const pass = "a";
        expect(vp(pass)).to.be.true;
    });

    it(`accepts a single number`,()=>{
        const pass = "5";
        expect(vp(pass)).to.be.true;
    });

    it(`accepts a single symbol`,()=>{
        const pass = "!";
        expect(vp(pass)).to.be.true;
    });

});