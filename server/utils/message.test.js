var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

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


describe('generateLocationMessage', () => {

    it('should generate a location message', () => {
        var from = 'Sergio_9320';
        var lat = '123';
        var lng = '456';
        var out = generateLocationMessage(from,lat,lng);

        expect(out).toMatchObject({
            from, 
            url: `https://www.google.com/maps?q=${lat},${lng}`
        });
        expect(out.createdAt).toBeGreaterThan(0);
    });

});