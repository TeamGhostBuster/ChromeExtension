# ChromeExtension
Chrome plugin for CollaborativeList

## Install Packages
`$ npm install -g yo gulp bower`

## Build
In order to generate the /app/script directory from the babel files run:
`$ gulp build`

## Update
To ensure that your build is always up to date run:
`$ gulp babel`
Or, to update your source while working, use:
`$ gulp watch`

## Test
Test the extension in Google Chrome by going to `chrome://extensions` in the address bar, enabling developer mode, and loading the app directory as an unpacked extension.
