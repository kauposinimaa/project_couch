$(document).ready(function() {

    // Constants
    const $body = $("body");
    const host = new OWSHost(true);
    const $host = host.box;
    host.showLobby().then(() => {
        host.startBtn.on('click', (event) => {
            webSocket.send(JSON.stringify({
                sender: playerName,
                event: 'start_game',
                data: {
                    allowNewPlayers: false,
                },
            }));
        });
    });

    const webSocket = new WebSocket(
        'ws://' + window.location.host + '/' + gameName + '/' + roomCode + '/' + playerName);

    // Variables
    let playerIndex = 1
    function getNextPlayer() {
        return new Promise((resolve, reject) => {
            makeFetch({
                url: '/active_players',
                method: 'GET',
                data: {
                    roomCode: roomCode,
                    gameName: gameName,
                },
            }).then((response) => {
                console.log(response);
                let index;
                if(playerIndex < response.activePlayers.length) {
                    index = playerIndex;
                    playerIndex++;
                }
                else {
                    index = 1;
                    playerIndex = index + 1;
                }
                console.log(index);
                console.log(playerIndex);
                resolve(response.activePlayers[index]);

            })
        })

    }

    // Events
    $host.on('player_joined', (event, data) => {
        host.addNewPlayer(data.playerName);
        console.log(data.playerName + ' joined!');
    });

    $host.on('player_disconnected', (event, data) => {
        host.removePlayer(data.playerName);
        console.log(data.playerName + ' left!');
    });

    $host.on('start_game', () => {
        host.startGame().then(() => {
            getNextPlayer().then((name) => {
                webSocket.send(JSON.stringify({
                    sender: playerName,
                    event: 'next_player',
                    data: {
                        playerName: name,
                    },
                }));
            });
        });
    });

    $host.on('word_added', (event, data) => {
        let word = data.word;
        let isPunctuation = word.includes('.') || word.includes(',');
        host.addWord(isPunctuation ? word : (' ' + word));

        getNextPlayer().then((name) => {
            webSocket.send(JSON.stringify({
                sender: playerName,
                event: 'next_player',
                data: {
                    playerName: name,
                },
            }));
        });
    });

    $host.on('game_closed', (event, data) => {
        console.log('Game closed!');
    });



    // Events from backend
    webSocket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        console.log(message);
        $host.trigger(message.event, [message.data]);
    };

    // webSocket.onerror = function (event) {
    //     console.log(event)
    //     let countdown = 5000;
    //     $gameBox.html('');
    //     $gameBox.html('' +
    //         '<h3>Can\'t start game!</h3>' +
    //         '<p>Connection to websocket was unsuccessful!</p>' +
    //         '<p id="countdown">' + countdown + '</p>');
    //         setInterval(() => {
    //             countdown--;
    //             $("#countdown").html(countdown);
    //         }, 1000);
    //         setTimeout(() => {
    //             window.location.replace('/');
    //         }, countdown*1000);
    // }

});
