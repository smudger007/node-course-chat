const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    
    // console.log('New User Connected');
  
    // On connection want to send a welcome message to the owner of the socket 

    socket.emit('newMessage', {
        from: 'Admin', 
        text: 'Welcome to the Chat Room', 
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin', 
        text: 'New User joined the room', 
        createdAt: new Date().getTime()
    });

    // Handle a new message - basically we want to forward it onto all users...

    socket.on('createMessage', (message) => {

        // Send a message to everyone.

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

        // Broadcast example below - this will go to all users apart from the one related to this socket. 

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });

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
