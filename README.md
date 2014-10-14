# Conventional Option Parser

> Parse options in Node CLI utilities using a convention over configuration approach

## Installation

    $ npm install conventional

## Usage

There are 3 steps in using this utility. You must require the library, pass it some options, and run it.

```
var parser = require('conventional');

// Define your options
var myOpts = {
  commands: {
    'example': {
      shortcut: 'e',
      desc: 'Example',
      usage: 'example <flags>',
      longDesc: 'An example function',
      flags: {
        'whatever': {
          type: Boolean, 
          value: true,
          required: false,
          shortcut: '-w',
          desc: 'Do whatever'
        },
        'something': {
          type: String,
          value: null,
          required: true,
          shortcut: '-s',
          desc: 'Do something'
        }
      }
    }
  },
  banner: '# sndjs v0.0.1',
  help: 'This is my super awesome custom help text!'
};

parser.run(myOpts);

// Your code goes here now...
```

Using conventional means you create an object to hold your commands and flags. All the options available are shown in the example. Once defined, you pass those options to `conventional.run`.

## How does it work?

Based the options you define, conventional will call the correct function and pass it an object containing your options' matching values as well as an array of remaining values not matched to any flags that you can either choose to use or ignore.

### Example

Using the options from our example above, if a user entered `cli-app-name example whatever something some other stuff here` Conventional will create a functiion call equivalent to this:

```
example({whatever: true, something: 'some'}, ['other', 'stuff', 'here']);
```

This means that by convention your CLI application should be structured in such a way that each command maps to a function that takes an object and an array as arguments like this:

```
function example(options, params) {
	// do stuff with options

	// Loop over params or ignore them
}
```

## What about X scenario?

The answer is maybe. This is an alpha release. Support is planned for apps that have only one default command and do not need to use the whole command/flag pattern that is implemented now. Support for making the params array optional is also being considered. I know that the shortcuts currently don't work. They will in subsequent releases.

Support is __not__ planned for tar-gz style flags like `-xyz` where `-xyz` would expand out to `-x -y -z`. Maybe in the future.

There's a bunch to do still but this worked for my needs at the moment.

## Contributing

In lieu of a formal style guide, take care to maintain the styles currently used in the project (see the [editorconfig](.editorconfig) file). Be sure to add tests for code you add.

## License (MIT)

This project is [MIT Licensed](License).