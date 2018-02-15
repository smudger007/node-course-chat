const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

    var users;

    beforeEach(() => {
        users = new Users;

        users.users = [{
            id: '1', 
            name: 'Jimmy', 
            room: 'ping pong'
        }, {
            id: '2', 
            name: 'Billy', 
            room: 'flip flop'
        }, {
            id: '3', 
            name: 'Dingbat', 
            room: 'ping pong'
        } ];

    });


    it('should add a new user', () => {
        var users = new Users();
        var user = {
            id: '12345',
            name: 'Smudger', 
            room: 'priest chat'
        };

        var res = users.addUser(user.id, user.name, user.room);
        expect(res).toMatchObject(user);
        expect(users.users).toMatchObject([user]);
        expect(users.users).toEqual(expect.arrayContaining([user]));    // Same as above....
        
    });


    it('should return users in the ping pong room', () => {

        var userList = users.getUserList('ping pong');

        expect(userList).toMatchObject(['Jimmy', 'Dingbat']);

    });

    it('should return users in the flip flop room', () => {

        var userList = users.getUserList('flip flop');

        expect(userList).toMatchObject(['Billy']);

    });

    it('should get a user', () => {

        var user = users.getUser('2');        

        expect(user).toMatchObject({
            id: '2', 
            name: 'Billy', 
            room: 'flip flop'
        });

    });

    it('should not get a user', () => {

        var user = users.getUser('10');
        expect(user).toBeUndefined();

    });


    it('should remove a user', () => {

        var user = users.removeUser('2');

        expect(user).toMatchObject({
            id: '2', 
            name: 'Billy', 
            room: 'flip flop'
        });

        expect(users.users).toMatchObject([{
            id: '1', 
            name: 'Jimmy', 
            room: 'ping pong'
        }, {
            id: '3', 
            name: 'Dingbat', 
            room: 'ping pong'
        } ]);

    });

    it('should NOT remove a user', () => {

        var user = users.removeUser('7');

        expect(user).toBeUndefined();

        expect(users.users).toMatchObject([{
            id: '1', 
            name: 'Jimmy', 
            room: 'ping pong'
        }, {
            id: '2', 
            name: 'Billy', 
            room: 'flip flop'
        }, {
            id: '3', 
            name: 'Dingbat', 
            room: 'ping pong'
        } ]);

    });

});