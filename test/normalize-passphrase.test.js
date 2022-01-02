const expect = require('chai').expect;

const ValidateAuth = require('../index.js');


describe(`normalizePassphrase(input)`, ()=>{
    
    it(`Converts to lower case`,()=>{
        const normalizePassphrase = ValidateAuth({passphrase: {minWords: 2}}).__normalizePassphrase;
        const input = `Abc Def`;
        const output = normalizePassphrase(input);
        expect(output).to.equal(`abc def`);
    });

    it(`Removes unwanted characters`,()=>{
        const normalizePassphrase = ValidateAuth({passphrase: {minWords: 2}}).__normalizePassphrase;
        const input = `!Abc Def can't -! !!!!!`;
        const output = normalizePassphrase(input);
        expect(output).to.equal(`abc def cant`);
    });

    it(`Removes double spaces`,()=>{
        const normalizePassphrase = ValidateAuth({passphrase: {minWords: 2}}).__normalizePassphrase;
        const input = `abc def  ghi ! jkl`;
        const output = normalizePassphrase(input);
        expect(output).to.equal(`abc def ghi jkl`);
        expect(output).to.not.include(`  `);
    });

    it(`Ignores an extra space at the beginning`,()=>{
        const normalizePassphrase = ValidateAuth({passphrase: {minWords: 2}}).__normalizePassphrase;
        const input = ` abc def ghi`;
        const output = normalizePassphrase(input);
        expect(output).to.equal(`abc def ghi`);
    });

    it(`Ignores an extra space at the end`,()=>{
        const normalizePassphrase = ValidateAuth({passphrase: {minWords: 2}}).__normalizePassphrase;
        const input = `abc def ghi `;
        const output = normalizePassphrase(input);
        expect(output).to.equal(`abc def ghi`);
    });

    it(`Removes duplicate words`,()=>{
        const normalizePassphrase = ValidateAuth({passphrase: {minWords: 1}}).__normalizePassphrase;
        const input = `abc abc`;
        const output = normalizePassphrase(input);
        expect(output).to.equal(`abc`);
    });

    it(`Persists the first occurrence of duplicate words`,()=>{
        const normalizePassphrase = ValidateAuth({passphrase: {minWords: 1}}).__normalizePassphrase;
        const input = `abc def abc ghi`;
        const output = normalizePassphrase(input);
        expect(output).to.equal(`abc def ghi`);
    });

    it(`Removes single-letter words`,()=>{
        const normalizePassphrase = ValidateAuth({passphrase: {minWords: 1}}).__normalizePassphrase;
        const input = `abc def z ghi`;
        const output = normalizePassphrase(input);
        expect(output).to.equal(`abc def ghi`);
    });

});
