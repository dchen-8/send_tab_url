/*
 * If no target URL exists in storage, then create a default
 * configuration in storage.
 */
window.onload = ( () => {

    const defaultUrl = 'https://www.twitbook.uk/store_url.php?p={URL}';

    let options = { targetUrl: defaultUrl };

    browser.storage.local.get()
    .then( (config) => {

        if(typeof config.targetUrl == 'string')
            options.targetUrl = config.targetUrl;
        else {
            browser.storage.local.set( options );
        }
    })
    .catch( console.log );
});

