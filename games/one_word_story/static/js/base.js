class GameBox {
    constructor() {
        this.$box = $('' +
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
        this.$loader = $( '' +
            '<div class="d-flex justify-content-center">' +
            '   <div class="spinner-grow text-dark" role="status">' +
            '       <span class="sr-only">Loading...</span>' +
            '   </div>' +
            '</div>');
        this.$box.css('transform', 'scale(0)');

        $("body").append(this.$box);
        setTimeout(() => {
            this.$box.css('transform', 'scale(1)');
        }, 2000)
    }

    // Getters
    get box() {
        return this.$box;
    }

    get innerHTML() {
        return this.$innerHTML;
    }

    playerJoinedHTML(name) {
        return $('' +
            '<p>' +
            '   <i class="fas fa-user fa-x pr-3"></i>' + name +
            '</p>');
    }

    get lobbyHTML() {
        return $('' +
            '<div class="row">' +
            '   <div class="col-lg-6 col-md-12">' +
            '       <h1>One Word Story</h1>' +
            '       <h3>Room code: <span id="room-code">' + roomCode.toUpperCase() + '</span></h3>' +
            '       <h3>Players in lobby: <span id="player-count">0</span></h3>' +
            '       <button>Start game</button>' +
            '   </div>' +
            '   <div class="col-lg-6 col-md-12" id="players">' +
            '       ' +
            '   </div>' +
            '</div>'
            );
    }

    get gameHTML() {
        return $('' +
            '<div class="row">' +
            '   <div class="col-12">' +
            '       <h1>One Word Story</h1>' +
            '       <h3>Start adding words one by one to create a masterpiece</h3>' +
            '   </div>' +
            '   <div class="col-12>' +
            '        <div class="text-border p-3 bg-white">' +
            '           <p id="current-progress"></p>' +
            '        </div>' +
            '   </div>' +
            '</div>');
    }

    // Methods
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

    showLobby() {
        this.transition(this.lobbyHTML);

    }

    showGame() {
        this.transition(this.gameHTML);
    }

    addNewPlayer(name) {
        let $playerList = this.innerHTML.find('#players');
        $playerList.append(this.playerJoinedHTML(name));
    }
}


class Server extends GameBox {
    constructor() {
        super();
    }

    // Getters


    // Methods


}

class Player extends GameBox {
    constructor() {
        super();
    }

    // Getters


    // Methods


}
