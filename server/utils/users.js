// Use ES6 classes

class Users {


    constructor () {
        // Create empty users array
        this.users = [];
    }


    addUser(id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    

    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        return users.map((user) => user.name);
    }

    removeUser(id) {
        
        var ret = this.getUser(id);
        
        if (ret) {
            this.users = this.users.filter((user) => {
                return user.id !== id;
            });
        }

        return (ret);
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
 
}

module.exports = { Users };