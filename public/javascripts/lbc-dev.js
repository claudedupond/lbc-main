/**
 * Created by Belkhiria on 2/1/14.
 */

var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});