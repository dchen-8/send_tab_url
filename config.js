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

    const defaultUrls = [
        { name: 'twitbook', url: 'https://www.twitbook.uk/store_url.php?p={URL}&t={TITLE}' },
        { name: 'Linkalot', url: 'https://127.0.0.1/linkalot/?url={URL}&txt={TITLE}&key=SECRET' },
        { name: '', url: '' }
    ];

    let options = { targetUrls: defaultUrls };

    browser.storage.local.get()
    .then( (config) => {

        // Old single target config? Then convert to multi-target
        if(config.hasOwnProperty('targetUrl')) {
            defaultUrls[0] = { name: 'Default', url: config.targetUrl };
            defaultUrls[1] = { name: '', url: '' };
            defaultUrls[2] = { name: '', url: '' };
        }

        // Remove the existing configuration item.
        browser.storage.local.remove('targetUrl');

        // Do we have the new (array) config type? Then assign them, else initialise.
        if(config.hasOwnProperty('targetUrls') && Array.isArray(config.targetUrls))
            options.targetUrls = config.targetUrls;
        else {
            browser.storage.local.set( options );
        }
    })
    .catch( console.log );
});

