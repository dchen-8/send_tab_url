### Firefox extension - send the current tab's URL as a GET request to a server.

This was written as part of the Commerce Filtered Search initiative to record
the URLs of high-quality or otherwise interesting web pages, and by default this
extension logs the URLs to my server.

(See https://www.susa.net/wordpress/random/cfs-commerce-filtered-search/ for more
details, though note that the add-on can be used as a generic link-sender, that is,
it can be configured to send to your own logging server instead.)

All URLs submitted will be made available as a public download, the idea being
that people can create directories or search indexes from those URLs, and use
them as a starting point to discover other quality content.

My personal proxy for 'quality content' is to look at how many requsts get
blocked by uBlock Origin. The lower the number, the higher the quality. If you
want to participate, please only send sincerely created interesting stuff, no
click-bait and mainstream news articles, etc.

Alternatively, if you want to send tab URLs to your own server, just configure
your own URL in the Add-ons Preferences, and the extension will send there
instead.

The code has been kept to an absolute minimum so as to be easily auditable.
There's very little to it, you can easily unzip the .xpi file to verify that it
matches the code in this repository.

This project is released under the GNU GPLv2, except the 'tag-plus-outline' icon
which is by Michael Richins (@MrGrigri), available from Material Design Icons at
https://materialdesignicons.com/ Used here with thanks!

#### My server code that receives URLs
The following example shows PHP code that receives a request from the add-on and
writes the given URL to a SQLite database (or alternatively, just a plain-text
file).

Make sure the web server process (e.g. the www-data user) has permission to write
the db or txt file.

Since the add-on allows you to configure your target URL however you want, none
of this is mandatory. Any handler that processes a GET request can be used.

```
<?php

/*
 * store_url.php
 */

class UrlDB extends SQLite3
{
    function __construct() {
        $this->open('/opt/url_logger/url_store.db');
        $this->exec('create table if not exists urls(' .
            'url text unique, integer status)');
    }
}

if(isset($_REQUEST['p'])) {

    $url = $_REQUEST['p'];

    $db = new UrlDB();

    $statement = $db->prepare("insert or ignore into urls(url) values(:url)");
    $statement->bindValue(':url', $url);
    $statement->execute();

    $db->close();

    echo "OK: $url";

    // Alternatively, forget the database and just log to a text file.
    // file_put_contents('/opt/url_logger/interesting_urls.txt', "{$url}\n", FILE_APPEND);
}
?>
```
