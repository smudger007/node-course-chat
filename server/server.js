const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    
    // console.log('New User Connected');
  
    // On connection want to send a welcome message to the owner of the socket 

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat Room'));

    // And then let everyone else know a new user has joined. 

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined the room'));

    // Handle a new message - basically we want to forward it onto all users...

    socket.on('createMessage', (message, callback) => {

        // Send a message to everyone.

        io.emit('newMessage', generateMessage(message.from, message.text));

        callback('ACK - OK');

    });

    // Handle the disconnection.
    socket.on('disconnect', () => {
        console.log('lost connection to client - oh dear!!!!');
    });
});


app.use(express.static(publicPath));


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
