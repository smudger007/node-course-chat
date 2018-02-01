
var socket = io();

console.log('hello');
        
socket.on('connect', function() {
    console.log('Connected!');

    // Send a message to the Chat App on connection. 

    socket.emit('createMessage', {
        text: "I've just connected - hello Chat App", 
        from: "sergio9320@mcfc.com"
    });

});


// Accept messages from the Server

socket.on('newMessage', function(message) {
    console.log('Message from Server: ', message);
});


// Handle disconnection. 

socket.on('disconnect', function() {
    console.log('We were Disconnected!!!!');
});



