/**
 * (C)2020 Kevin Sangeelee, released under the GNU GPLv2
 * https://gitlab.com/ksangeelee/send-tab-url/tree/master
 * See the above project for license terms.
 */

/*
 * If no target URL exists in storage, then create a default
 * configuration in storage.
 */
window.onload = ( () => {

    const defaultUrl = 'https://www.twitbook.uk/store_url.php?p={URL}&title={TITLE}';

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

