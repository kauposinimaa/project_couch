const zeroPad = (hex) => hex.length === 1 ? '0' + hex : hex;  // E.g. changes A to 0A

// Changes background color to specified value
function setBackgroundColor(elem, red, green, blue, timeout = speed) {
    return new Promise((resolve) => {
        elem.css('background-color', '#' + zeroPad(red.toString(16)) + zeroPad(green.toString(16)) + zeroPad(blue.toString(16)));
        setTimeout(() => {
            resolve();
        }, timeout);
    });
}

// Buttonbox selected animation
async function selectedAnimation(elem){
    elem.css('transition', 'transform 0.2s');
    elem.css('transform', 'scale(1.3)');
    setTimeout(() => {
        elem.css('transform', 'scale(0)');
    }, 200)
    isRainbow = false;
}

// Function for Fetch API
function makeFetch({url, method, data = {}}){
    return new Promise((resolve, reject) => {
        method = method.toUpperCase();
        // For GET requests with data. Adds params to url
        if(method === 'GET' && !jQuery.isEmptyObject(data)){
            let params = new URLSearchParams(data);
            url += '?' + params.toString();
        }
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: ['GET', 'HEAD'].includes(method) ? null : JSON.stringify(data),
        })
        .then(response => {
            let contentType = response.headers.get('content-type');
            let isJSON = contentType && contentType.includes('application/json');

            if(!response.ok){  // Unsuccessful response is handled in catch
                throw response;
            }

            return isJSON ? response.json() : response.text();  // Returns either a object or plain text
        })
        .then(data => {
            resolve(data);
        })
        .catch((error) => {
            // Handles unsuccessful fetch request
            if(error instanceof Response){
                let contentType = error.headers.get('content-type');
                let isJSON = contentType && contentType.includes('application/json');

                // Handles backend errors
                if(error.status >= 500){
                    reject({
                        detail: 'Internal server error',
                        status: error.status,
                    });
                }
                else{
                    // Handles JSON error response
                    if(isJSON){
                        error.json().then((json) => {
                            reject({
                                detail: json.detail || json,
                                status: error.status,
                            })
                        });
                    }
                    // Handles text error response
                    else{
                        error.text().then((text) => {
                            reject({
                                detail: text,
                                status: error.status,
                            })
                        });
                    }
                }
            }
            // Shows errors with fetch function itself
            else{
                reject({
                    detail: error,
                    status: '',
                });
            }
        });
    });
}
