$(document).ready(function() {

    // Constants
    const $body = $("body");
    const player = new OWSPlayer(true);
    const $player = player.$box;
    const webSocket = new WebSocket(
        'ws://' + window.location.host + '/' + gameName + '/' + roomCode + '/' + playerName);

    if(gameStatus === 'in_game') {
        player.startGame();
    }
    else {
        player.showWait('Waiting for the game to start');
    }

    // Variables


    // Events
    $player.on('start_game', (event, data) => {
        player.startGame();
    });

    $player.on('next_player', (event, data) => {
        if(data.playerName === playerName) {
            player.showTurn().then(() => {
                player.wordInput.keyup(function(){
                    let text = $(this).val();
                    let isPunctuation = text[0] === '.' || text[0] === ',' || text[0] === '!' || text[0] === '?';
                    $(this).val(text.replace(
                        isPunctuation ? /[^.,!?]/g : /[^A-Za-z0-9öäüõÖÄÜÕ\-:'"]/g ,''
                        ));
                });

                player.wordForm.on('submit', (event) => {
                    event.preventDefault();
                    webSocket.send(JSON.stringify({
                        'sender': playerName,
                        'event': 'word_added',
                        'data': {
                            word: player.wordInput.val(),
                        },
                    }));

                    player.wordInput.val('');
                    player.showWait('Waiting for turn');
                });
            });
        }
    });

    $player.on('end_game', (event) => {
        console.log('Game ended');
        player.endGame();
    });

    $player.on('close_game', (event) => {
        window.location.replace('/join');
    });

    // $player.on('times_up', (event) => {
    //     webSocket.send(JSON.stringify({
    //         'sender': playerName,
    //         'event': 'word_added',
    //         'data': {
    //             word: '',
    //         },
    //     }));
    //
    //     player.showWait('Waiting for turn');
    // });





    // Events from backend
    webSocket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        $player.trigger(message.event, [message.data]);
    }

    webSocket.onerror = function (event) {
        let countdown = 5;
        $player.transition('' +
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