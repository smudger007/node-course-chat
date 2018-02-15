const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

io.on('connection', (socket) => {
    
    // Handle Room Join
    socket.on('join', (params, callback) => {

        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Valid Name and Room are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        // Send updated user list to all users, so they can update their User List. 
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        // On join want to send a welcome message to the owner of the socket 
        socket.emit('newMessage', generateMessage('Admin', `Hi ${params.name} - welcome to the Chat Room`));

        // And then let everyone else know, in this room, that a new user has joined. 
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room..`));

        callback();

    });
  
    
    // Handle a new message - basically we want to forward it onto all users...
    socket.on('createMessage', (message, callback) => {

        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            // Send a message to everyone in this room.
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });



    // Handle geolocation message
    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,coords.latitude,coords.longitude));
        }
    });



    // Handle the disconnection.
    socket.on('disconnect', () => {
        //    Let's remove the user from the room.
        var user = users.removeUser(socket.id);

        if (user) {
            // Send updated user list to all users in room, so they can update their User List. 
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));

            // Tell rest of room that the user left.
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room..`));
        }
    });
});


app.use(express.static(publicPath));


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
