
var socket = io();

console.log('hello');
        
socket.on('connect', function() {
    console.log('Connected!');

});


// Accept messages from the Server
socket.on('newMessage', function(message) {

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
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

    // console.log('URL is ', message);

    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-location-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
});