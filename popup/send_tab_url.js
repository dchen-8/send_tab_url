/**
 * (C)2020 Kevin Sangeelee, released under the GNU GPLv2
 * https://gitlab.com/ksangeelee/send-tab-url/tree/master
 * See the above project for license terms.
 */


let targetUrls;
let targetUrl = 'Undefined';
let sanitisedUrl;

function messageElement() {
    return document.querySelector("#message-content");
}

function sendCurrentTabUrl(tabUrl, pageTitle, button) {

    let targetUrl = button.dataset.url;
    console.log('Sending: ', tabUrl, 'via', targetUrl);

    /*
     * Make a request to send the URL. Server should support CORS (i.e.
     * include response header Access-Control-Allow-Origin), otherwise firefox
     * prevents our code from accessing the response.
     */

    messageElement().classList.remove("hidden");
    messageElement().innerText = "Sending...";

    button.setAttribute('disabled', true);

    /*
     * The targetUrl is the template that's used in the GET request
     * to the target server. The tokens {URL} and {TITLE} will be
     * replaced by the URL and title of the tab. The values MUST
     * be encoded.
     */
    let requestUrl = targetUrl
        .replace('{TITLE}', encodeURIComponent(pageTitle))
        .replace('{URL}', encodeURIComponent(tabUrl));
    let form_data = new FormData()
    form_data.append('url', tabUrl)

    fetch(requestUrl,
        {
            method: 'POST',
            mode: 'no-cors', // no-cors, *cors, same-origin. See Request.mode
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
            body: form_data,
        }
    )
     .then((response) => {
         if(response.status === 200) {
            messageElement().innerText = "URL was sent successfully.";
            document.querySelector("#popup-content").classList.add('fadeout');
            setTimeout( function() {
                document.querySelector("#popup-content").classList.add("hidden");
                messageElement().innerHTML = "<h1>Thanks!</h1>";
                setTimeout( function() { window.close() }, 2300);
            }, 1200);
         } else {
             throw 'Server responded with a failure (' + response.status + ')';
         }
     })
     .catch( (err) => {
         messageElement().innerText = 'Failed to send. ' + err;
         console.log('Error: ', err) 
     } );
} /* end function sendTabUrl() */

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {

  document.addEventListener("click", (e) => {

    /**
     * Check the event came from a button, then call sendCurrentTabUrl()
     */
    if (e.target.classList.contains("button")) {

        let pageTitle = document.querySelector("#title").value;

        sendCurrentTabUrl(sanitisedUrl, pageTitle, e.target);
    }
  });
}

/**
 * Fetch the targetUrl configuration from storage.
 */
browser.storage.local.get()
.then( (config) => {

    if(config.hasOwnProperty('targetUrls') && Array.isArray(config.targetUrls)) {

        targetUrls = config.targetUrls;
        for(idx = 0; idx < 3; idx++) {
            let t = targetUrls[idx];
            let button = document.getElementById('send-button' + idx);

            let disabled = (t.name != '' && t.url != '') ? false : true;
            
            if(disabled) {
                button.setAttribute('disabled', true);
                button.innerText = 'Empty';
                button.dataset.url = '';
            } else {
                button.removeAttribute('disabled');
                button.innerText = 'Send to ' + t.name;
                button.dataset.url = t.url;
            }
        }

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
    //console.log(url);

    url.hash = '';
    url.password = '';
    url.username = '';
    sanitisedUrl = url.href;

    console.log('Sanitised: ', sanitisedUrl);
    document.querySelector("#url").innerText = sanitisedUrl;

    document.querySelector("#title").value = tab.title;
    
    // If we have a valid URL, then listen for clicks
    listenForClicks();
})
.catch(console.log);

