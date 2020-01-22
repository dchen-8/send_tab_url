/**
 * (C)2020 Kevin Sangeelee, released under the GNU GPLv2
 * https://gitlab.com/ksangeelee/send-tab-url/tree/master
 * See the above project for license terms.
 */


function getUrlElement() { return document.querySelector('#url') }

/*
 * There are message <spans> under the URL box, and under the save button that
 * give feedback when the URL has been saved, or when it doesn't validate.
 */
function setMessage(message1, message2) {
    document.querySelector('#message1').textContent = message1;
    document.querySelector('#message2').textContent = message2;
}


document.querySelector('#save-button').addEventListener('click', function() {

    let url = getUrlElement().value;

    if( ! url.includes('{URL}') ) {
        setMessage('Warning: no {URL} in target URL.', 'Not saved!');
    } else {
        let config = { targetUrl: url };

        browser.storage.local.set( config )
        .then( () => {
            setMessage('', 'Saved');
            setTimeout( function() { setMessage('', '') }, 3000);
        } );
    }
});

window.onload = function() {

    browser.storage.local.get()
    .then( (config) => {

        if(config.targetUrl.includes('{URL}')) {
            getUrlElement().setAttribute('value', config.targetUrl);
        }
    })
    .catch( console.log );
}

