## Clipboard manager for Zazu

[![Build Status](https://travis-ci.org/tinytacoteam/zazu-clipboard.svg?branch=master)](https://travis-ci.org/tinytacoteam/zazu-clipboard)

Remembers the things you've copied into your clipboard, and gives it back in a
searchable format.

![screenshot](screenshot.png)

## Usage

Most commonly this is opened with a keyboard shortcut `alt+shift+v`, which can
be overwritten. Simply hit this key and you'll immediately be shown your recent
clips that can be searched.

Without a keyboard shortcut, open Zazu and use the prefix `clip` to search
through your clips. For example if you want to search your clips for the word
emoji you can use this example:

~~~
clip emoji
~~~

## Installing

Add the package to your plugins array in `./zazurc.js`.

~~~ json
{
  "plugins": [
    "tinytacoteam/zazu-clipboard"
  ]
}
~~~

You can overwrite the keyboard shortcut by defining a variable with the name
`ClipboardKey`.

~~~ json
{
  "name": "tinytacoteam/zazu-clipboard",
  "variables": {
    "ClipboardKey": "cmd+shift+v"
  }
}
~~~

If you prefer to disable image storing, you can set the `ignoreImages` to
`true`.

~~~ json
{
  "name": "tinytacoteam/zazu-clipboard",
  "variables": {
    "ignoreImages": true
  }
}
~~~

By defualt we remember the last 50 items in your clipboard. To change this add a
`size` variable to your configuration.

~~~ json
{
  "name": "tinytacoteam/zazu-clipboard",
  "variables": {
    "size": 1000
  }
}
~~~

The clipboard monitor update interval is `1000` ms (except `3000` ms for Linux system) by default, however, user can customize the interval by setting `updateInterval` option in the configuration. The interval has to be no less than `250` ms.

```json
{
  "name": "tinytacoteam/zazu-clipboard",
  "variables": {
    "updateInterval": 1500
  }
}
```

## Screenshots

![text](./assets/text_screenshot.png)

![color](./assets/color_screenshot.png)
