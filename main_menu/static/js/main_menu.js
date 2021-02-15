$(document).ready(function(){

    // Global variable defaults
    var speed = 2000;
    var isRainbow = true;

    // Constants
    const body = $('body');
    const zeroPad = (hex) => hex.length === 1 ? '0' + hex : hex;  // E.g. changes A to 0A

    // Set background color fading speed
    body.css('-webkit-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    body.css('-moz-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    body.css('-o-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    body.css('transition', 'background-color ' + (speed * 1.5) + 'ms ease');

    // Changes background color to specified value
    function setBodyColor(red, green, blue, timeout = speed){
        return new Promise((resolve) => {
            body.css('background-color', '#' + zeroPad(red.toString(16)) + zeroPad(green.toString(16)) + zeroPad(blue.toString(16)));
            setTimeout(() => {
                resolve();
            }, timeout);
        });
    }

    // Switches background colors to every color in the rainbow
    async function rainbowBackground(){
        if(isRainbow) await setBodyColor(255, 0, 0);    // red
        if(isRainbow) await setBodyColor(255, 127, 0);  // orange
        if(isRainbow) await setBodyColor(255, 255, 0);  // yellow
        if(isRainbow) await setBodyColor(0, 255, 0);    // green
        if(isRainbow) await setBodyColor(0, 0, 255);    // blue
        if(isRainbow) await setBodyColor(75, 0, 130);   // indigo
        if(isRainbow) await setBodyColor(148, 0, 211);  // violet
        if(isRainbow) rainbowBackground();
    }
    rainbowBackground();

    async function selectedAnimation(buttonbox){
        $(buttonbox).css('transition', 'transform 0.2s');
        $(buttonbox).css('transform', 'scale(1.3)');
        setTimeout(() => {
            $('div.buttonbox').css('transform', 'scale(0)');
        }, 200)
        isRainbow = false;
        await setBodyColor(0, 0, 0);
    }

    $('div.buttonbox.available').delegate('', 'click', (event) => {

        let buttonbox = event.currentTarget;
        selectedAnimation(buttonbox).then(() => {
            window.location.replace($(buttonbox).data('url'))
        });
    })



});