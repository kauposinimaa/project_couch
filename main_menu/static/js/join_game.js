$(document).ready(function(){

    $("#join-form").on('submit', function(event) {
        event.preventDefault();

        let joinData = new FormData(document.getElementById('join-form'));
        let formErrors = false;
        for(let entry of joinData.entries()) {
            let $field = $("#" + entry[0]);
            $field.removeClass('is-invalid');
            if(!entry[1]) {
                $field.addClass('is-invalid');
                formErrors = true;
            }
        }
        if(formErrors) {
            return;
        }


        let requestData = {
            'roomCode': joinData.get('room-code'),
            'playerName': joinData.get('player-name'),
        }

        makeFetch({
            url: '/connect',
            method: 'GET',
            data: requestData,
        }).then((response) => {
            let params = new URLSearchParams(requestData);
            let redirectUrl = response['redirectUrl'] + '?' + params.toString();
            window.location.replace(redirectUrl);
        }).catch((error) => {
            $("#join-errors").html(error.status === 400 ? error.detail : 'Unexpected error!');
        });
    });



});