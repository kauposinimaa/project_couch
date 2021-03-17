$(document).ready(function() {

    // Constants
    const $body = $("body");
    const gameBox = new GameBox();
    const $gameBox = gameBox.$box;
    const webSocket = new WebSocket(
        'ws://' + window.location.host + '/' + gameName + '/' + roomCode + '/' + playerName);

    const $playerCounter = $("#player-amount");
    gameBox.showLobby();


    // Variables
    let playerCount = 0;
    let playerNames = [];
    let currentPlayerCount = 0;

    // Events
    $gameBox.on('player_joined', (event, data) => {
        playerCount++;
        $playerCounter.html(playerCount);
        gameBox.addNewPlayer(data.playerName);
        playerNames.push(data.playerName);
        console.log(data.playerName + ' joined!');
    });

    $gameBox.on('player_disconnected', (event, data) => {
        playerCount--;
        $playerCounter.html(playerCount);
        let index = playerNames.indexOf(data.playerName)
        index > -1 ? playerNames.splice(index, 1) : false;
        console.log(data.playerName + ' left!');
    });

    $gameBox.on('start_game', (event, data) => {
        gameBox.showGame();
    });

    $gameBox.on('word_added', (event, data) => {
        let word = data.word;
        let isPunctuation = word.includes('.') || word.includes(',');
        $("#current-progress").append(
            isPunctuation ? word : (' ' + word)
        );

        currentPlayerCount = currentPlayerCount < playerNames.length-1 ? (currentPlayerCount+1) : 0;
        webSocket.send(JSON.stringify({
            sender: host_name,
            event: 'next_player',
            data: {
                currentPlayer: playerNames[currentPlayerCount],
            },
        }));

    });

    $gameBox.on('game_closed', (event, data) => {
        console.log('Game closed!');
    });



    // Events from backend
    webSocket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        console.log(message);
        $gameBox.trigger(message.event, [message.data]);
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



    // Events from frontend
    $("#start-game").on('click', (event) => {
        webSocket.send(JSON.stringify({
            sender: host_name,
            event: 'start_game',
            data: {
                allowNewPlayers: false,
            },
        }));
        webSocket.send(JSON.stringify({
            sender: host_name,
            event: 'next_player',
            data: {
                currentPlayer: playerNames[currentPlayerCount],
            },
        }));
    });

});
