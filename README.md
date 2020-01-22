Firefox extension - send the current tab's URL as a GET request to a server.

This was written as part of the Commerce Filtered Search initiative to record
the URLs of high-quality or otherwise interesting web pages, and by default this
extension logs the URLs to my server.

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
