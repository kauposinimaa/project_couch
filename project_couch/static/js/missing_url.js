$(document).ready(function(){
    setTimeout(() => {
        $("#message").attr('hidden', false);
    }, 500);

    $("a").on('click', () => {
        setTimeout(() => {
            window.location.replace('/');
        }, 300);
        $("body").fadeOut(300);
    });
});