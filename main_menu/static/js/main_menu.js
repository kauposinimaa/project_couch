$(document).ready(function(){
    var speed = 2000;
    var isRainbow = true;

    $('body').css('-webkit-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    $('body').css('-moz-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    $('body').css('-o-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    $('body').css('transition', 'background-color ' + (speed * 1.5) + 'ms ease');

    const zeroPad = (hex) => hex.length === 1 ? '0' + hex : hex;

    function setBodyColor(red, green, blue, timeout = speed){
        return new Promise((resolve) => {
            $('body').css('background-color', '#' + zeroPad(red.toString(16)) + zeroPad(green.toString(16)) + zeroPad(blue.toString(16)));
            setTimeout(() => {
                resolve();
            }, timeout);
        });
    }

    // Changes background color in a binary pattern
    async function binaryRainbow(){
        if(isRainbow)   await setBodyColor(255, 0, 0);
        if(isRainbow)   await setBodyColor(0, 255, 0);
        if(isRainbow)   await setBodyColor(255, 255, 0);
        if(isRainbow)   await setBodyColor(0, 0, 255);
        if(isRainbow)   await setBodyColor(255, 0, 255);
        if(isRainbow)   await setBodyColor(0, 255, 255);
        if(isRainbow)   await setBodyColor(255, 255, 255);
        if(isRainbow)   await setBodyColor(0, 0, 0);
        if(isRainbow)   binaryRainbow();
    }

    binaryRainbow();

    async function selectedAnimation(buttonbox){
        $(buttonbox).css('transition', 'transform 0.2s');
        $(buttonbox).css('transform', 'scale(1.3)');
        setTimeout(() => {
            $('div.buttonbox').css('transform', 'scale(0)');
        }, 200)
        isRainbow = false;
        await setBodyColor(0, 0, 0);
        $('div.container').html('');
        $('div.container').prepend('' +
        '<div class="d-flex justify-content-center">' +
            '<div class="spinner-border big text-light" role="status"></div>' +
        '</div>').hide().fadeIn(500);
    }

    $('div.buttonbox.available').delegate('', 'click', (event) => {
        let buttonbox = event.currentTarget;
        selectedAnimation(buttonbox);
        setTimeout(() => {
            $('div.container').fadeOut(500);
            setTimeout(() => {
                $('div.container').html('');
                isRainbow = true;
                binaryRainbow();

            }, 500);
        }, 4000);
    })

});