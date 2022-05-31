> :warning: You must have a Discogs account to run this project.

**TropoDisc** helps you manage your audio library from your  [Discogs](https://www.discogs.com) collection. It was developed mainly for the personal use of its author, and made available under the GPL license.
> :information_source: It can also be used to highlight the location of albums via LED :bulb: strips... but that's another story :smiley:

# Screenshots
<img width="500" src="https://user-images.githubusercontent.com/4351162/156552334-916137d6-0d66-4131-bd23-a05de1468590.png">
<img width="500" src="https://user-images.githubusercontent.com/4351162/156573837-3de1d156-c956-46a3-8435-6b9d2a7ff474.png">
<img width="500" src="https://user-images.githubusercontent.com/4351162/156573943-f4630099-be1f-41c1-b56e-870cf2c00126.png">
<img width="500" src="https://user-images.githubusercontent.com/4351162/156573962-93f8c532-9ed4-4b65-be56-c408317a7274.png">

# Quick start 

TropoDisc can be used as **a simple wrapper for your Discogs collection**, or do a little more by communicating with your audio library Arduino server to **highlight the location of your albums using leds**. That's how I use it, but it needs more work. We will focus here on the simplest way:
```bash
$ git clone https://github.com/esaracco/tropodisc.git
$ cd tropodisc/
$ npm i --omit=dev
$ cp .env.sample .env
$ vim .env
..
```
There is a lot of settings constants, but only two are really required:
- `REACT_APP_DISCOGS_USER`: your Discogs account user.
- `REACT_APP_DISCOGS_TOKEN`: your Discogs token.

More details [here](https://www.discogs.com/developers#page:authentication).
```bash
..
$ npm run build
$ sudo npm i -g serve
$ serve -s build
```
Thats it :smiley:
TropoDisc will be available on http://localhost:3000

# To take full advantage of it
TropoDisc has been designed to handle three custom Discogs user fields:
- `place` (*textarea, 1 line*):
The physical position of your album in your audio library.
- `price`  (*textarea, 1 line*):
The purchase price of your album.
- `styles`  (*textarea, 1 line*):
This field is for your own albums styles, separated by comma. This makes it possible to have something simpler than the plethora of existing Discogs styles...

First you have to create these fields from your Discogs account. More details [here](https://support.discogs.com/hc/en-us/articles/360007331674-Customizing-Your-Collection-Notes).
Once these fields are created, edit the `.env` file to set the following constants:
- `REACT_APP_DISCOGS_FIELD_PLACE`
- `REACT_APP_DISCOGS_FIELD_PRICE`
- `REACT_APP_DISCOGS_FIELD_STYLES`
- `REACT_APP_DISCOGS_FIELDS_REQUIRED`

Then restart the app server and re-sync your collection by clicking the `Synchronize` :arrows_counterclockwise: button from the TropoDisc menu.

# Docker

To build and run the Docker, do the following:
```bash
$ cp .env.sample .env
$ vim .env
..
```
Customize `.env` as explained above, then:
```bash
..
$ docker build -t tropodisc:prod .
$ docker run -it --rm -p [yourlocalport]:3000 tropodisc:prod
```
Finally, connect to http://localhost:[yourlocalport] to use it.

:tada: Have fun!
