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
    console.log('New User Connected');
  
    // Handle a new message - basically we want to forward it onto all users...

    socket.on('createMessage', (message) => {
        console.log('Hi - new message received: ', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
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
