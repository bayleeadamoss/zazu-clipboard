module.exports = {
  name: 'Clipboard',
  version: '1.0.0',
  author: 'Blaine Schmeisser',
  description: 'Clipboard manager for zazu.',
  icon: 'assets/clipboard.png',
  homepage: 'https://github.com/tinytacoteam/clipboard',
  git: 'git@github.com:tinytacoteam/clipboard.git',
  install: 'npm install',
  blocks: {
    external: [
      {
        type: 'ServiceScript',
        script: './node_modules/.bin/electron ./src/monitor.js',
      },
      {
        type: 'Hotkey',
        hotkey: 'alt+shift+v',
        connections: ['clip']
      },
    ],
    input: [
      {
        id: 'clip',
        type: 'PrefixScript',
        space: true,
        args: 'Required',
        prefix: 'clip',
        script: 'node ./src/search.js "{query}"',
        connections: ['CopyToClipboard'],
      },
    ],
    output: [
      {
        id: 'CopyToClipboard',
        type: 'UserScript',
        script: './node_modules/.bin/electron ./src/copy.js "{value}"',
      },
    ],
  },
}
