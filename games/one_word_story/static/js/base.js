class GameBox {
    constructor(show=false) {
        this.$box = $('' +  // Box has a loading spinner by default
            '<div class="gamebox yellow p-5">' +
            '   <div class="inner">' +
            '       <div class="d-flex justify-content-center">' +
            '           <div class="spinner-grow text-dark" role="status">' +
            '               <span class="sr-only">Loading...</span>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        this.$innerHTML = this.$box.find('div.inner');
        this.$loader = $( '' +  // Loader HTML to aid with transitions
            '<div class="d-flex justify-content-center">' +
            '   <div class="spinner-grow text-dark" role="status">' +
            '       <span class="sr-only">Loading...</span>' +
            '   </div>' +
            '</div>');

        this.gameTimer = 100;
        this.isShown = show;


        // Adds game box to body
        if(show) {
            this.isShown = true;
            this.$box.css('transform', 'scale(0)');
            $("body").append(this.$box);
            setTimeout(() => {
                this.$box.css('transform', 'scale(1)');
            }, 1100);
        }

    }

    // Getters
    get box() {
        return this.$box;
    }

    get innerHTML() {
        return this.$innerHTML;
    }

    get loader() {
        return this.$loader[0].outerHTML;
    }

    // Methods
    addBoxToBody() {
        this.$box.css('transform', 'scale(0)');
        $("body").append(this.$box);
        setTimeout(() => {
            this.$box.css('transform', 'scale(1)');
        }, 1100);
    }

    setOpacity(value) {  // 0-1
        return new Promise((resolve, reject) => {
            this.$innerHTML.css('opacity', value);
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    transition(html, delay=0) {
        return new Promise((resolve, reject) => {
            this.setOpacity(0).then(() => {
                setTimeout(() => {
                    this.$innerHTML.html(html);
                    this.setOpacity(1).then(() => {
                        resolve();
                    });
                }, delay);
            });
        });
    }
}


class OWSHost extends GameBox {
    constructor(show=true) {
        super(show);
        this.playersTotal = 0;
    }

    // Getters
    get startBtn() {
        return this.innerHTML.find('#start-game');
    }

    get playerList() {
        return this.innerHTML.find('#players');
    }

    get playerCount() {
        return this.innerHTML.find('#player-count');
    }

    get currentText() {
        return this.innerHTML.find('#current-progress');
    }

    // Methods
    showLobby() {
        return new Promise((resolve, reject) => {
            this.transition($('' +
                '<div class="row">' +
                '   <div class="col-xl-5 col-lg-7 col-md-8 col-sm-12 mb-3">' +
                '       <h1>One Word Story</h1>' +
                '       <h3>Room code: <span id="room-code">' + roomCode.toUpperCase() + '</span></h3>' +
                '       <h3>Players in lobby: <span id="player-count">0</span></h3>' +
                '       <button id="start-game">Start game</button>' +
                '   </div>' +
                '   <div class="col-xl-7 col-lg-5 col-md-4 col-sm-12" id="players">' +
                '       ' +
                '   </div>' +
                '</div>'
                ))
            .then(() => {
                resolve();
            })
        });

    }

    startGame() {
        return new Promise((resolve, reject) => {
            this.transition($('' +
                '<div class="row">' +
                '   <div class="col-12">' +
                '       <h1>One Word Story</h1>' +
                '       <h3>Start adding words one by one to create a masterpiece</h3>' +
                '   </div>' +
                '   <div class="col-12">' +
                '        <div class="text-border p-3 bg-white">' +
                '           <p id="current-progress"></p>' +
                '        </div>' +
                '   </div>' +
                '</div>'))
            .then(() => {
                resolve();
            });
        });

    }

    addNewPlayer(name) {
        this.playersTotal++;
        this.playerCount.html(this.playersTotal);
        this.playerList.append($('<p id="player-' + name + '"><i class="fas fa-user fa-2x pr-3"></i>' + name + '</p>'));
    }

    removePlayer(name) {
        this.playersTotal--;
        this.playerCount.html(this.playersTotal);
        this.innerHTML.find('#player-' + name).remove();
    }

    addWord(word) {
        this.currentText.append(word);
    }

    endGame() {

    }
}

class OWSPlayer extends GameBox {
    constructor(show) {
        super(show);
    }

    // Getters
    get wordInput() {
        return this.innerHTML.find("#word-input");
    }

    get wordForm() {
        return this.innerHTML.find("#word-form");
    }

    // Methods
    showWait(message) {
        return new Promise((resolve, reject) => {
            this.transition($('' +
                '<h3>' + message + '...</h3>' + this.loader))
            .then(() => {
                resolve();
            });
        });
    }

    startGame() {
        return new Promise((resolve, reject) => {
            this.showWait('Waiting for turn')
            .then(() => {
                resolve()
            });
        });
    }

    showTurn() {
        return new Promise((resolve, reject) => {
            this.transition($('' +
                '<h3>Write a word</h3>' +
                '<form id="word-form">' +
                '    <input type="text" id="word-input" name="word-input" required>' +
                '    <button type="submit" id="submit-word">Send</button>' +
                '</form>'))
            .then(() => {
                resolve();
            });
        });
    }

    endGame() {

    }
}
