
var socket = io();

function scrollToBottom() {

    // Selectors

    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    // Heights

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

        
socket.on('connect', function() {
    
    // Grab the search string in the URL (use deparams to conver this to an object)
    var params = jQuery.deparam(window.location.search);

    // Emit to server - to manage the room join. (name and room should be in params)
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';    // Revert user to Join Page....
        } else {
            console.log('we are OK');
        }
    });
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

    scrollToBottom();
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
    var template = jQuery('#message-location-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);

    scrollToBottom();
});



// Add a listener for user list update
socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});

