var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {

    it('should generate a message correctly', () => {

        var from = 'sergio-9320';
        var text = 'hey - did you see my goal';
        var msg = generateMessage(from, text);
        
        expect(msg.createdAt).toBeGreaterThan(0);
        expect(msg).toMatchObject({
            from,
            text
         });

    });

});