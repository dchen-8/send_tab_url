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

/**
 * This function was written by Daniel Aleksandersen, taken from his blog
 * https://www.ctrl.blog/entry/firefox-browseraction-close-popout-android.html
 */
function closePopOut()
{
  return Promise.all(
    [
      browser.runtime.getBrowserInfo(),
      browser.runtime.getPlatformInfo()
    ]
  ).then(
    data =>
    {
      if (data[0].name == 'Firefox' &&
          data[1].os == 'android')
      {
        return browser.tabs.update(
          {active: true}
        );
      }
    }
  ).finally(
    window.close
  );
}

