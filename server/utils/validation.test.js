const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealMessage', () => {

    it('should reject a non-string', () => {
        var output = isRealString({test: "this is a non string - it's an object"});

        expect(output).toBeFalsy();
    });

    it('should reject just spaces', () => {
        var output = isRealString('         ');

        expect(output).toBeFalsy();
    });

    it('should Accept a valid string', () => {
        var output = isRealString('    good test string  ');

        expect(output).toBeTruthy();
    })

});


