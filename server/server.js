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

    // socket.emit('newEmail', {
    //     from: 'markdsmi@uk.ibm.com', 
    //     text: 'This is a test email from IBM - You are Fired!!!'
    // });

    // socket.on('createMail', (message) => {
    //     console.log('Email recieved: ', message);
    // });

    socket.emit('newMessage', {
        from: 'theServer', 
        text: "Hi, I'm the server, welcome to the Chat Application!!!", 
        createdAt: "12345678"
    });

    socket.on('createMessage', (message) => {
        console.log('Hi - new message received: ', message);
    });


    socket.on('disconnect', () => {
        console.log('lost connection to client - oh dear!!!!');
    });
});


app.use(express.static(publicPath));


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
