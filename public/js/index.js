'use strict';

/*==================================================
    NOTE: this is client side code
==================================================*/

const socket = io();

/*==================================================
    NOTE: Listeners
==================================================*/
socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    console.log('newMessage', message);
    let li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
    let formattedTime = moment(message.createdAt).format('h:mm a');
    console.log('newMessage', message);
    let li = jQuery('<li></li>');
    let a  = jQuery('<a target="_blank">My Current Location</a>');

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);

    jQuery('#messages').append(li);
});

/*==================================================
    NOTE: emitters
==================================================*/
jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();

    let messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()   //  get the val
    }, function(){
        messageTextBox.val('');   //  set the val
    });
});

//  emit geolocation
let locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if ( !navigator.geolocation ) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location.');
    });
});