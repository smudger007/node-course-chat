
var socket = io();

console.log('hello');
        
socket.on('connect', function() {
    console.log('Connected!');

});


// Accept messages from the Server

socket.on('newMessage', function(message) {
    console.log('Message from Server: ', message);
});


// Handle disconnection. 

socket.on('disconnect', function() {
    console.log('We were Disconnected!!!!');
});



