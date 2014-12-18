# Conventional Option Parser [![Build Status](https://travis-ci.org/billpatrianakos/conventional.svg)](https://travis-ci.org/billpatrianakos/conventional)

> Node option parser for CLI apps using a convention over configuration approach

## Installation

    $ npm install conventional --save

## Usage

### The anatomy of a conventional command (user's perspective)

Imagine a command line application that has a command to shoot a phaser at someone. It takes some options and parameters. Using it on the command line can look like this:

```bash
phaser shoot jeff mode stun
```

In the example above, `phaser` is the command line app name, `shoot` is the command to be run, `mode` is a flag passed in to slightly alter the way the command works, `stun` is the value given to that flag (if flags are boolean they don't take values), and `jeff` is the parameter passed to the command to take action on. So we're basically saying "Set phaser to 'stun' and shoot Jeff".

If you understand this then the rest of this guide should be much easier to follow. I've tried to make it as simple as possible but option parsers are fucking nuts and even though Conventional is probably the simplest one ever, its configuration may sound difficult at first.

### Creating an application

There are 3 steps in using this utility. You must require the library, pass it some options, and run it. Please read this before looking at the example below:

1. __Create an object to contain all of your command line actions and flags.__ These are your "options" and they just define what commands can be accepted and what flags are available to them. Here, an action name maps to a command a user can type to make your program run and its flag(s) is/are an option passed to that command. The options object is structured like so:

```js
var options = {
    commands: {}, // This holds the names of available commands and their flags
    banner: 'Super CLI App v2.0', // The CLI banner when help is called (Not yet implemented)
    help: 'Here is how to use this app...' // Conventional does not parse out usage for an enture app yet. Here you can define your own help text
}
```

2. __Next, create an object that will hold the functionality called by each named command.__ The name of each property here needs to correspond to a property contained in your `options.commands` object. *Note that while each property in `options.commands` must be a string (`command['action']`), the properties of your actions object can be written in standard JS object notation.*

```js
var actions = {
    doStuff: function(options, parsedOpts, params) {
        // Do stuff with the parsedOptions and params here. The function signature is explained next
    },
    anotherCommand: function(options, parsedOpts, params) {...}
}
```

3. __Make your app do stuff within the `actions.commandName` functions.__ You'll notice that in the example above the actions accept 3 arguments - `options, parsedOpts, params`. Every function needs to accept all three of these to operate. These arguments contain:

- __`options`__: This holds your app's options object. You can name it anything you want, just make sure to pass it to each action. Here it's called `options` because that' the name we gave it in step 1. It can be called `foo` and Conventional will pass `foo` to your action.
- __`parsedOpts`__: This is an object containing the names and values of any flags passed to the command. Conventional parses out the values and validates the input, throwing an error if an invalid value was passed to the CLI. If a flag was not set then the property will not be set and you'll get `undefined` as the value. For this reason you should use the `options` object to set a default value as a fallback. For example, in an app that has an action named `doSomething` and a flag named `mode` you should set up your function like this:

Assuming a user types in `doSomething mode crazy`

```js
var defaults    = options.commands.doSomething.flags;   // Save only this command's flags and default vals to this variable
var mode        = parsedOpts.mode || defaults.mode.val; // Returns 'crazy' instead of whatever the default is
```

- __`params`__: This is an array of strings. Because flags and their values can come in any order, all strings that didn't wind up matching a command or a flag wind up in the `params` array in the order they were entered by the user. If your command only taks a single parameter as input then you'd just grab `param[0]`. Otherwise you can use `forEach` to iterate over the array.

When you write your own option/command definitions this becomes much clearer. Basically, you define what your app does and what it will accept, then write the functions to accept those values. Remember, when actually using the application, the order of most flags and parameters does not matter. As long as the app name follows the command name whatever comes after will be parsed by Conventional.

### Example

In this example we recreate the phaser application from the beginnig of the readme. We define what commands and flags your app will accept plus some other options like setting a banner for help text and the help text itself.

```js
// Define your commands/options/flags
var myOpts = {
  commands: { // Contains all valid commands - commands are never required
    'shoot': { // Results in `phaser shoot` being a command (!!! THE PROP NAME MUST BE IN STRING NOTATION: 'myProp' is good. myProp (no quotes) is bad)
      shortcut: 'e', // Shortcuts not implemented yet but you can include them anyway
      desc: 'Shoots a phaser',
      usage: 'phaser shoot <person> [flags]',
      longDesc: 'This shoots the phaser at a person. You can set the phaser to non-lethal modes if you want',
      flags: { // Flags themselves are optional but the flags object MUST exist even if empty
        'blanks': { // Commands and flags must be strings.
          type: Boolean, // The type of input to expect. Currently supports
          value: false,
          required: false,
          shortcut: '-w',
          desc: 'Shoot only blanks'
        },
        'mode': { // A mandatory flag
          type: String,
          value: null, // No default value set
          required: true,
          shortcut: '-s',
          desc: 'Set the mode. Valid modes are stun, kill, and puppies'
        }
      }
    },
    'secondcommand': {...} // Define any number of commands
  },
  banner: '# sndjs v0.0.1',
  help: 'This is my super awesome custom help text!'
};

// Now create your actions - these map to the properties in `myOpts.commands`
var actions = {
    shoot: function(options, parsedOpts, params) {
        // Make sure all params are there. In this case we require and accept at least 1 parameter
        if(params.length < 1) {
            console.warn('You have to choose at least one target to shoot at');
            exit 1;
        }

        // Gather up all of our variables
        var defaults    = options.commands.shoot.flags;
        var mode        = parsedOpts.mode; // You can expect this to be present because its required
        var blanks      = parsedOpts.blanks || defaults.mode.val; // Check for defaults or validate yourself because we defined this as optional
        var target      = params;

        var shootBlanks = (blanks) ? 'shooting blanks' : 'shooting live phaser ammo';

        console.log('We are ' + shootBlanks + ' in ' + mode + ' at ' + target.join(' and '));
    }
}

// This line runs the app
var run = require('conventional')(myOpts, actions);
```

With the app set up and passed to Conventional, we can now use it. Here's an example of some input and output you'd get using the app in the example above:

```bash
$ phaser shoot mode stun Steve Janice Olga Andrew
> We are shooting live phaser ammo in stun mode at Steve and Janice and Olga and Andrew
```

__Some notes you should know:__

* Shortcuts are not implemented yet but you can include them anyway and they'll work when they are
* Flags are optional but the flags object MUST exist even if empty
* Flags support the following input types: `array, string, integer, boolean`
* Commands and flags must be written using string notation. For example:

```js
// GOOD!
var opts = {
    commands: {
        'my-command': {...} // Notice that 'my-command' is enclosed in single quotes.
    }
    ...
}

// BAD!
var opts = {
    commands: {
        mycommand: {...} // NO! You have to wrap command names (just the names) in quotes for Conventional to be able to run your application
    }
    ...
}
```

## How does it work?

Under the hood Conventional is mapping your `options.commands` property names to the corresponding function held in an action object and running them when the first parameter passed to your CLI app matches any of those action property names.

## What about X scenario?

The answer is maybe. This is an alpha release. Support is planned for apps that have only one default command and do not need to use the whole command/flag pattern that is implemented now. Support for making the params array optional is also being considered. I know that the shortcuts currently don't work. They will in subsequent releases.

Support is __not__ planned for tar-gz style flags like `-xyz` where `-xyz` would expand out to `-x -y -z`. Maybe in the future.

There's a bunch to do still but this worked for my needs at the moment.

## Contributing

In lieu of a formal style guide, take care to maintain the styles currently used in the project (see the [editorconfig](.editorconfig) file). Be sure to add tests for code you add.

## License (MIT)

This project is [MIT Licensed](License).
