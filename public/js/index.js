
var socket = io();

console.log('hello');
        
socket.on('connect', function() {
    console.log('Connected!');

});


// Accept messages from the Server
socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    // Create a list item element (using jquery)
    var li = jQuery('<li></li>');

    // Populate it with message details sent from server.
    li.text(`${formattedTime} - ${message.from}: ${message.text}`);

    // Now render to the screen (append it to the ordered list element called messages.
    jQuery('#messages').append(li);

});


// Handle disconnection. 
socket.on('disconnect', function() {
    console.log('We were Disconnected!!!!');
});


// Add a listener to the Message Form.
jQuery("#message-form").on('submit', function(e) {

    var messageTextbox = jQuery('[name=message]');
    // prevent old school page refres
    e.preventDefault(); 

    // Now send message via sociket.io
    socket.emit('createMessage', {
        from: 'User', 
        text: messageTextbox.val()
    }, function(ack) {
        // Lets remove the contents of the message box if successfully sent.
        messageTextbox.val('');
    });
});

// Add a click listener to the location button.
var locationButton = jQuery('#send-location');
locationButton.on('click', function() {

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser - unlucky!!!');
    }

    locationButton.attr('disabled', 'disabled').text('Sending.....');

    navigator.geolocation.getCurrentPosition( function(position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location');
    });

});

// Add a listener for new Location Messages
socket.on('newLocationMessage', function(message) {

    var formattedTime = moment(message.createdAt).format('h:mm a');

    // Create a list item element (using jquery)
    var li = jQuery('<li></li>');

    // Create an anchor tag
    var a = jQuery('<a target="_blank">My Current Location</a>');
    
    li.text(`${formattedTime} - ${message.from}: `);
    li.append(a);
    a.attr('href', message.url);

    // Now render to the screen (append it to the ordered list element called messages.
    jQuery('#messages').append(li);


});