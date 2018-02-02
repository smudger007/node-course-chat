
var socket = io();

console.log('hello');
        
socket.on('connect', function() {
    console.log('Connected!');

});


// Accept messages from the Server

socket.on('newMessage', function(message) {
    // console.log('Message from Server: ', message);

    // Create a list item element (using jquery)
    var li = jQuery('<li></li>');

    // Populate it with message details sent from server.
    li.text(`${message.from}: ${message.text}`);

    // Now render to the screen (append it to the ordered list element called messages.
    jQuery('#messages').append(li);

});


// Handle disconnection. 

socket.on('disconnect', function() {
    console.log('We were Disconnected!!!!');
});


// Add a listener to the Message Form.

jQuery("#message-form").on('submit', function(e) {
    // prevent old school page refres
    e.preventDefault(); 

    // Now send message via sociket.io
    socket.emit('createMessage', {
        from: 'User', 
        text: jQuery('[name=message]').val()
    }, function(ack) {
        // This is the acknowledgement handler.
        console.log('From Server: ', ack);
    });
});