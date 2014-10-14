#!/usr/bin/env node
/**
 * Live Example Test
 *
 * Call this file with `node ./spec/example.js <command> <flags & options>`.
 * This example implementation is useful for verifying that the parser
 * is working as expected. When contributing do not commit changes to this
 * file unless there's a special case that should be covered in this example.
 * Otherwise all tests should go in the Jasmine specs.
 */
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

var filteredInput = process.argv.slice(2);
console.log('CLI args passed to conventional: ' + filteredInput.join(', ') + '\n');

var functions = {
  example: function(opts, params) {
    console.log('Here are all your options');
    for (var option in opts) {
      console.log(option);
    }

    console.log(opts);

    console.log('\nYOUR PARAMS:');
    console.log('============');

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
