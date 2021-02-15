$(document).ready(function() {
    const chatSocket = new WebSocket(
        'ws://'
        + window.location.host
        + '/ws/demo_game/'
    );

    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log(data);
    };

    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly');
    };

});