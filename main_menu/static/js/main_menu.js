$(document).ready(function(){

    // Redirects to game page
    $('div.buttonbox.available').delegate('', 'click', (event) => {
        let buttonbox = event.currentTarget;
        selectedAnimation($(buttonbox)).then(() => {
            setBackgroundColor($("body"), 0, 0, 0).then(() => {
                window.location.replace($(buttonbox).data('url'))
            });
        });
    })

});