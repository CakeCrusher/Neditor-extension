# Neditor
<a href="https://sites.google.com/view/neditor/home"><img src="https://i.imgur.com/Zwnm8vE.png"></a>

Neditor is a network editing tool built for anyone who seeks a better browsing experience. Users create custom instructions (nedits) for how the network requests ought to be handled when a page is being loaded. The nedits are then uploaded to the database once used or saved so that any other user may use it.

# Download
<a href="https://chrome.google.com/webstore/detail/neditor/decdgljidgldegkhmbiaphkmjadhclkg">Chrome</a>

<a href="https://addons.mozilla.org/zh-TW/firefox/addon/neditor/?utm_source=addons.mozilla.org&utm_medium=referral&utm_content=search">Firefox</a>

# Primary components
Neditor is mainly composed from 3 components and utils (along with the GraphQL Node.js Server):

- **[background](background)**: serves (more than it is already meant to be) as the base of the application within which most of the non UI related functions are handled.
- **[popup](popup)**: displays important information about the current nedit as well as offering a convenient way for a user to browse and select a nedit to use. Additionally the popup also gives the user access to the settings so that the user may customize the way Neditor behaves.
- **[panel](panel)**: provides the user Neditor’s tools for network editing as well as feed from the site being edited. Together these features enable the user to create a custom nedit.
- **[utils.js](utils.js)**: contains functions that potentially have uses across multiple files.

## Background
<img src="https://i.imgur.com/VgKaqxt.png" align="right">
Contains 8 files that embody the aspects of the background.

- **Nedit execution**: orchestrates how the nedit is executed ([neditExecuters.js](background/neditExecuters.js)).
- **Message handler**: ties all of the components together through message passing ([messanger.js](background/messanger.js)).
- **Storage administration**: administrator for the storage so that all of the storage changes are handled here ([storageAdministration.js](background/storageAdministration.js)).
- **Automatic nedit**: if the user has automatic nedit set, it is handled here ([automaticNeditHandler.js](background/automaticNeditHandler.js)).
- **Final script**: sets up the rest of background ([main.js](background/main.js)).
- **Request handler**: all requests pass through here for processing ([onBeforeRequest.js](background/onBeforeRequest.js)).
- **When reloaded**: triggers important changes when a page has hit a loading milestone like loading and completed ([onUpdated.js](background/onUpdated.js)).
- **Icon state**: handles the state of the extension icon ([setState.js](background/setState.js)).

## Popup
<img src="https://i.imgur.com/0m4EKt5.png" align="right">
Contains 7 files that embody the aspects of popup.

- **Gives the HTML use**: activates and gives complex use to the HTML components ([activateHTML.js](popup/activateHTML.js)).
- **Initialize**: initiates the popup when opened ([init.js](popup/init.js)).
- **Popup styling**: contains the CSS for the popup ([main.css](popup/mian.css)).
- **Popup HTML**: contains the HTML for the popup ([main.html](popup/mian.html)).
- **Final script**: sets up the rest of the popup ([main.js](popup/main.js)).
- **Message handler**: handles all incoming messages ([messageListener.js](popup/messageListener.js)).
- **Neditor toggle styling**: contains the CSS for the Neditor activate toggle ([toggle.css](popup/toggle.css)).

## Panel
<img src="https://i.imgur.com/wI25wSv.png" align="right">
Contains 7 files that embody the aspects of the panel and 2 devtools files for configuration of the panel .

- **Gives the rest of the HTML use**: activates and gives complex use to the HTML components other than the tables. ([activateHTML.js](devtools/panel/activateHTML.js)).
- **Gives the tables use**: activates and gives complex use to the tables. ([handleTables.js](devtools/panel/handleTables.js)).
- **Initialize**: initiates the panel when opened ([init.js](devtools/panel/init.js)).
- **Panel styling**: contains the CSS for the panel ([main.css](devtools/panel/mian.css)).
- **Panel HTML**: contains the HTML for the panel ([main.html](devtools/panel/mian.html)).
- **Final script**: sets up the rest of the panel ([main.js](devtools/panel/main.js)).
- **Message handler**: handles all incoming messages ([messageListener.js](devtools/panel/messageListener.js)).
- **Devtools HTML**: contains the devtools HTML ([devtools.html](devtools/devtools.html)).
- **Devtools setup**: sets up the panel within devtools ([toggle.css](devtools/devtools.js)).

## Utils
<img src="https://i.imgur.com/hyZ5Rd2.png" align="right">
Is a single file

- **All utility functions**: ([utils.js](utils.js)).
