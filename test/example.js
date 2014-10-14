#!/usr/bin/env node

var options = {
  commands: {
    'example': {
      shortcut: 'e',
      desc: 'Run the example',
      usage: 'example <flag> VALUE',
      longDesc: 'Longer description',
      flags: {
        'mode': {
          type: String,
          value: null,
          required: false,
          shortcut: '-m',
          desc: 'Mode'
        },
        'option': {
          type: String,
          value: null,
          required: true,
          shortcut: '-o',
          desc: 'Random option'
        }
      }
    }
  },
  banner: 'My CLI Tool Example',
  help: 'This doesn\'t need custom help text'
};

console.log(process.argv.slice(2));

var functions = {
  example: function(opts, params) {
    console.log('Here are all your options');
    for (var option in opts) {
      console.log(option);
    }

    console.log('\nYOUR PARAMS:');
    console.log('===============================');

    if (params.length > 0) {
      for (var i = 0; i < params.length; i++) {
        console.log(params[i]);
      }
    } else {
      console.log('No params were entered. All options had arguments.');
    }
  }
};

var parser = require('../src/conventional')(options, functions);
