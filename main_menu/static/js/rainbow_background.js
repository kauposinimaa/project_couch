$(document).ready(function() {
    // Changes background color to each color in the rainbow

    // Constants
    const body = $('body');

    // Set background color fading speed
    body.css('-webkit-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    body.css('-moz-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    body.css('-o-transition', 'background-color ' + (speed * 1.5) + 'ms ease');
    body.css('transition', 'background-color ' + (speed * 1.5) + 'ms ease');

    // Switches background colors to every color in the rainbow
    async function rainbowBackground() {
        if (isRainbow === true) await setBackgroundColor( body, 255, 0, 0);    // red
        if (isRainbow === true) await setBackgroundColor(body, 255, 127, 0);  // orange
        if (isRainbow === true) await setBackgroundColor(body, 255, 255, 0);  // yellow
        if (isRainbow === true) await setBackgroundColor(body, 0, 255, 0);    // green
        if (isRainbow === true) await setBackgroundColor(body, 0, 0, 255);    // blue
        if (isRainbow === true) await setBackgroundColor(body, 75, 0, 130);   // indigo
        if (isRainbow === true) await setBackgroundColor(body, 148, 0, 211);  // violet
        if (isRainbow === true) rainbowBackground();
    }

    rainbowBackground();

});


