/**
 * (C)2020 Kevin Sangeelee, released under the GNU GPLv2
 * https://gitlab.com/ksangeelee/send-tab-url/tree/master
 * See the above project for license terms.
 */


let targetUrl = 'Undefined';
let sanitisedUrl;

function messageElement() {
    return document.querySelector("#message-content");
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {

  document.addEventListener("click", (e) => {

    function sendCurrentTabUrl(tabUrl) {

        console.log('Sending: ', tabUrl);

        /*
         * Make a request to send the URL. Server should support CORS (i.e.
         * include response header Access-Control-Allow-Origin), otherwise firefox
         * prevents our code from accessing the response.
         */

        messageElement().classList.remove("hidden");
        messageElement().innerHTML = "<p>Sending...</p>";
        document.querySelector("#send-button").disabled = true;

        // We can assume that targetUrl has a placeholder, since it's included
        // in the default value, and preferences won't update without one.
        fetch(targetUrl.replace('{URL}', encodeURIComponent(tabUrl)),
            {
                method: 'GET',
                mode: 'cors', // no-cors, *cors, same-origin. See Request.mode
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'omit', // include, *same-origin, omit
            }
        )
         .then((response) => {
             if(response.status === 200) {
                messageElement().innerHTML = "<p>URL was sent successfully.</p>";
                document.querySelector("#popup-content").classList.add('fadeout');
                setTimeout( function() {
                    document.querySelector("#popup-content").classList.add("hidden");
                    messageElement().innerHTML = "<h1>Thanks!</h1>";
                    setTimeout( function() { window.close() }, 2000);
                }, 1200);
             }
         })
         .catch( (err) => {
             messageElement().innerHTML = "<p>Failed to send. Please check server settings.</p>";
             console.log('Error: ', err) 
         } );
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    /**
     * Get the active tab, then call sendCurrentTabUrl()
     */
    if (e.target.classList.contains("button")) {

        sendCurrentTabUrl(sanitisedUrl);
    }
  });
}

/**
 * Fetch the targetUrl configuration from storage.
 */
browser.storage.local.get()
.then( (config) => {

    if(typeof config.targetUrl == 'string') {
        targetUrl = config.targetUrl;
    }
});


/**
 * Get the current tab's URL and store it, then update the popup's HTML so
 * that the user can see the URL being sent to safegaurd against accidentally
 * sending from the wrong tab.
 */

browser.tabs.query( {
    currentWindow: true,
    active: true
})
.then( (tabs) => {
    let tab = tabs[0];
    console.log(tab);
    const url = new URL(tab.url);
    console.log(url);
    url.hash = '';
    url.password = '';
    url.username = '';
    sanitisedUrl = url.href;
    console.log('Sanitised: ', sanitisedUrl);
    document.querySelector("#url").innerHTML = '<span>'+sanitisedUrl+'</span>';
    
    // If we have a valid URL, then listen for clicks
    listenForClicks();
})
.catch(console.log);

