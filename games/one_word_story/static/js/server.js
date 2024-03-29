$(document).ready(function() {

    // Constants
    const $body = $("body");
    const host = new OWSHost(true);
    const $host = host.box;
    const webSocket = new WebSocket(
        'ws://' + window.location.host + '/' + gameName + '/' + roomCode + '/' + playerName);

    // Variables
    let prevPlayerList;
    let currentPlayer;
    let playerList = [];
    function getNextPlayer() {
        return new Promise((resolve, reject) => {
            makeFetch({
                url: '/players',
                method: 'GET',
                data: {
                    roomCode: roomCode,
                    gameName: gameName,
                },
            }).then((response) => {
                console.log(response['players']);
                playerList = response['players'];
                if(!prevPlayerList) {  // If this is the first turn
                    prevPlayerList = playerList;
                    currentPlayer = playerList[0];
                    resolve(currentPlayer);
                    return;
                }

                console.log('players: ' + playerList);
                let index = playerList.indexOf(currentPlayer);
                if(index === -1) {
                    index = prevPlayerList.indexOf(currentPlayer)
                }
                else {
                    index++;
                }
                if(index >= playerList.length) {
                    index = 0;
                }
                console.log('player index: ' + index);

                prevPlayerList = playerList;
                currentPlayer = playerList[index];
                resolve(currentPlayer);

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
        console.log(currentPlayer);
        if(currentPlayer === data.playerName) {
            getNextPlayer().then((name) => {
                webSocket.send(JSON.stringify({
                    sender: playerName,
                    event: 'next_player',
                    data: {
                        playerName: name,
                    },
                }));
            });
        }

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
        let isPunctuation = ['.', ',', '!', '?'].includes(word[0]);
        console.log(isPunctuation);

        // All this to display a word correctly
        if(host.currentText.html().length === 0) {
            if(!isPunctuation) {
                host.addWord(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            }
        }
        else {
            if(!isPunctuation) {
                if([',', '.', '!', '?'].includes(host.currentText.html().slice(-1))) {
                    if(host.currentText.html().slice(-1) === ',') {
                        host.addWord(' ' + word.toLowerCase());
                    }
                    else {
                        host.addWord(' ' + word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
                    }
                }
                else {
                    host.addWord(' ' + word.toLowerCase());
                }
            }
            else {
                host.addWord(word);
            }
        }

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

    $host.on('times_up', (event) => {
        let endResult = host.currentText.html();
        // Notify everybody, that game ended
        webSocket.send(JSON.stringify({
            sender: playerName,
            event: 'end_game',
            data: {},
        }));
        // End game
        host.endGame();

        // Save result to db
        makeFetch({
            url: '/' + gameName + '/' + 'save_result',
            method: 'POST',
            data: {
                'gameName': gameName,
                'roomCode': roomCode,
                'endResult': endResult,
            }
        }).catch((error) => {
            setTimeout(() => {
                host.innerHTML.append('' +
                    '<p class="pt-4">' + error.detail + '</p>');
                console.log(error.detail);
            }, 1000);
        });
    });

    $host.on('restart', (event, data) => {
        webSocket.send(JSON.stringify({
            sender: playerName,
            event: 'start_game',
            data: {},
        }));
    });

    $host.on('close_game', (event, data) => {
        console.log('Game closed!');
    });

    host.showLobby().then(() => {
        host.startBtn.on('click', (event) => {
            webSocket.send(JSON.stringify({
                sender: playerName,
                event: 'start_game',
                data: {},
            }));
        });
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
