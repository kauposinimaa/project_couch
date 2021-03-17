$(document).ready(function() {

    // Constants
    const webSocket = new WebSocket(
        'ws://' + window.location.host + '/' + gameName + '/' + roomCode + '/' + playerName);
    const $body = $("body");
    const $gameBox = $("#game-box");

    // Variables


    // Events
    $gameBox.on('start_game', (event, data) => {
        $gameBox.html('');
        $gameBox.html('' +
            '<div class="spinner-grow text-secondary" role="status">' +
            '   <span class="sr-only">Loading...</span>' +
            '</div>');
    });

    $gameBox.on('next_player', (event, data) => {
        if(data.currentPlayer === playerName) {
            $gameBox.html('');
            $gameBox.append('' +
                '<h3>Write a word</h3>' +
                '<form id="word-form">' +
                '    <input type="text" id="word-input" name="word-input" required>' +
                '    <button type="submit" id="submit-word">Send</button>' +
                '</form>');

            const $wordInput = $("#word-input");

            $wordInput.keyup(function(){
                let text = $(this).val();
                let isPunctuation = text[0] === '.' || text[0] === ',';
                $(this).val(text.replace(
                    isPunctuation ? /[^.,]/g : /[^A-Za-z]/g ,''
                    ));
            });

            $("#word-form").on('submit', (event) => {
                event.preventDefault();
                webSocket.send(JSON.stringify({
                    'sender': playerName,
                    'event': 'word_added',
                    'data': {
                        word: $wordInput.val(),
                    },
                }));

                $wordInput.val('');
            });
        }
        else {
            $gameBox.html('');
            $gameBox.html('' +
                '<div class="spinner-grow text-secondary" role="status">' +
                '   <span class="sr-only">Loading...</span>' +
                '</div>');
        }
    });

    $gameBox.on('game_closed', (event, data) => {
        console.log('Game closed!');
        window.location.replace('/join');
    });



    // Events from backend
    webSocket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        $gameBox.trigger(message.event, [message.data]);
    }

    webSocket.onerror = function (event) {
        let countdown = 5;
        $gameBox.html('');
        $gameBox.html('' +
            '<h3>Can\'t join game!</h3>' +
            '<p>Please check the room code and make sure the player name is not already in use</p>' +
            '<p id="countdown">' + countdown + '</p>');
            setInterval(() => {
                countdown--;
                $("#countdown").html(countdown);
            }, 1000);
            setTimeout(() => {
                window.location.replace('/join');
            }, countdown*1000);
    }


});