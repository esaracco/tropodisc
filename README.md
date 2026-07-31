[![GPL License](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE) [![Discogs API](https://img.shields.io/badge/Powered%20by-Discogs-orange.svg)](https://www.discogs.com/developers/) [![Made with React](https://img.shields.io/badge/React-17-61DAFB.svg)](https://reactjs.org/) [![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)](Dockerfile)

# TropoDisc

_Organize your collection, enrich it with your own metadata, and optionally locate albums instantly using LED strips._

**TropoDisc** is an open-source music collection manager built on top of the [Discogs](https://www.discogs.com) API. Originally developed for personal use, it is now available under the GPL license.

## Why TropoDisc?

Discogs already provides an excellent way to catalog music collections, but browsing a large physical library can still be frustrating.

TropoDisc aims to bridge the gap between your online Discogs collection and your shelves.

With TropoDisc you can:

- 🔎 Browse and search your collection quickly
- 🏷️ Add your own metadata through Discogs custom fields
- 📍 Store the exact physical location of every album
- 💡 Instantly locate an album using ESP32-controlled LED strips *(optional)*
- ❤️ Keep complete ownership of your collection data through Discogs

Whether you simply want a cleaner interface for Discogs or enjoy building hardware around your music library, TropoDisc is designed to stay lightweight and easy to deploy.


## Features

- 🎵 Browse your entire Discogs collection
- 🔍 Fast album search
- 🏷️ Custom metadata (price, styles, storage location...)
- 🔄 One-click synchronization with Discogs
- 💡 Optional ESP32-powered LED location system
- 🐳 Docker support
- 🔓 100% open source (GPL)

## Screenshots

<img width="500" src="https://user-images.githubusercontent.com/4351162/156552334-916137d6-0d66-4131-bd23-a05de1468590.png">
<img width="500" src="https://user-images.githubusercontent.com/4351162/156573837-3de1d156-c956-46a3-8435-6b9d2a7ff474.png">
<img width="500" src="https://user-images.githubusercontent.com/4351162/156573943-f4630099-be1f-41c1-b56e-870cf2c00126.png">
<img width="500" src="https://user-images.githubusercontent.com/4351162/156573962-93f8c532-9ed4-4b65-be56-c408317a7274.png">

## Requirements

- A Discogs account
- Node.js 18+ (or your minimum supported version)
- Yarn

## Quick Start

TropoDisc works perfectly as a standalone interface for your Discogs collection. The LED integration is entirely optional and can be configured later.

Clone the repository and install the dependencies:

```bash
git clone https://github.com/esaracco/tropodisc.git
cd tropodisc
yarn

cp .env.sample .env
vim .env
```

The `.env` file contains several configuration options, but only these two are required:

- `VITE_DISCOGS_USER` — your Discogs username
- `VITE_DISCOGS_TOKEN` — your personal Discogs API token

You can generate your personal token here:

https://www.discogs.com/developers#page:authentication

Build and launch the application:

```bash
yarn build

sudo yarn global add serve
serve -s build
```

That's it!

Open your browser at:

```
http://localhost:3000
```

## Using Discogs Custom Fields

TropoDisc can take advantage of three optional custom fields in your Discogs collection:

### `place`

*Textarea (1 line)*

Stores the physical location of an album in your collection.

### `price`

*Textarea (1 line)*

Stores the purchase price of the album.

### `styles`

*Textarea (1 line)*

Stores your own style tags, separated by commas. This provides a simpler alternative to Discogs' extensive list of predefined styles.

First, create these custom fields in your Discogs account.

More information is available here:

https://support.discogs.com/hc/en-us/articles/360007331674-Customizing-Your-Collection-Notes

Then update your `.env` file with the corresponding field identifiers:

- `VITE_DISCOGS_FIELD_PLACE`
- `VITE_DISCOGS_FIELD_PRICE`
- `VITE_DISCOGS_FIELD_STYLES`
- `VITE_DISCOGS_FIELDS_REQUIRED`

Restart the application, then click the **Synchronize** button in the TropoDisc menu to import the new fields.

## Docker

Copy and customize the configuration:

```bash
cp .env.sample .env
vim .env
```

Build the Docker image:

```bash
docker build -t tropodisc:prod .
```

Run the container:

```bash
docker run --rm -it -p <local-port>:3000 tropodisc:prod
```

Then open:

```
http://localhost:<local-port>
```

in your browser.

## Contributing

Contributions, bug reports and feature requests are welcome.

If you would like to improve TropoDisc, feel free to open an issue or submit a pull request.

## License

TropoDisc is released under the GNU GPL v3 License.

See the [LICENSE](LICENSE) file for details.

---

Enjoy! 🎵

