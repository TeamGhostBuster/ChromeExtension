# Collaborative Lists Chrome Extension
Chrome plugin for CollaborativeList. The extension uses the identity of the account logged into the browser when creating articles.

## Development
## Install Packages
`$ npm install -g yo gulp bower`

## Build
In order to generate the /app/script directory from the babel files, run:
`$ gulp build`

## Update
To ensure that your build is always up to date, run:
`$ gulp babel`

Or, to update your source while working, use:
`$ gulp watch`

## Test
Test the extension in Google Chrome by going to `chrome://extensions` in the address bar, enabling developer mode, and loading the `/app/` directory as an unpacked extension.

## Customize
If you wish to alter (extend, refine, etc.) the extension, load the it as an unpacked extension, then pack it to create an `app.crx` file and the `app.pem` keyfile. 

Upon creation of a new key, you need to update the client ID in the [Chrome Developer Console](https://console.developers.google.com). You then need to update the client ID in the `manifest.json` file.
