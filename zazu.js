const path = require('path')

module.exports = {
  name: 'Clipboard',
  version: '1.0.0',
  description: 'Clipboard manager for zazu.',
  icon: 'assets/clipboard.png',
  stylesheet: 'css/preview.css',
  blocks: {
    external: [
      {
        id: 'Database',
        type: 'ServiceScript',
        script: path.join('src', 'database.js'),
        interval: 1000,
      },
      {
        id: 'Monitor',
        type: 'ServiceScript',
        script: path.join('src', 'monitor.js'),
      },
      {
        type: 'Hotkey',
        name: 'ClipboardKey',
        hotkey: 'alt+shift+v',
        connections: ['searcher']
      },
    ],
    input: [
      {
        id: 'searcher',
        type: 'PrefixScript',
        space: true,
        args: 'Optional',
        prefix: 'clip',
        script: path.join('src', 'search.js'),
        connections: ['CopyToClipboard'],
      },
    ],
    output: [
      {
        id: 'CopyToClipboard',
        type: 'UserScript',
        script: path.join('src', 'copy.js'),
      },
    ],
  },
}
