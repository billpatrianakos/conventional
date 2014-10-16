// Conventional option parser
// ==========================
//
// Quick and easy option parsing for Node apps
// following convention over configuration
'use strict';

var _     = require('lodash');
var chalk = require('chalk');

// Console theme (alias to console.log() using Chalk for formatting)
var say = {
  message: function(message) {
    console.log(message);
  },
  error: function(message) {
    console.warn(chalk.bold.red(message));
  },
  success: function(message) {
    console.log(chalk.green(message));
  },
  note: function(message) {
    console.log(chalk.dim(message));
  },
  important: function(message) {
    console.log(chalk.bgRed.black.bold(message));
  }
};

// Main module
module.exports = function(opt, functions) {

  var userInput = process.argv.slice(2);
  var command   = userInput[0];
  var remaining = userInput.slice(1);

  var validCommands = [];
  var validFlags    = [];
  var requiredFlags = [];

  var passedValues  = {};
  var params        = [];

  // Determine whether to parse as a command:flags command
  // or a standalone app with only flags
  if (opt.commands['_']) { // jshint ignore:line
    // Parse everything as flags only
  } else {
    // Generate list of valid commands and flags
    //
    // Begin with commands...
    for (var commandName in opt.commands) {
      // TODO: Sanitize the input here
      validCommands.push(commandName);
    }

    // Ensure a valid command was entered
    if (_.contains(validCommands, command)) {
      // ...then parse command list for associated flags
      for (var flag in opt.commands[command].flags) {
        validFlags.push(flag);
        opt.commands[command].flags[flag].required && requiredFlags.push(flag); // jshint ignore:line
      }
    } else {
      say.error('Error: "' + command +'" is not a valid command');
      // TODO: Implement function to dynamically display help from options object
      process.exit(1);
    }

    // Validate required flags
    var unmetRequirements = _.difference(requiredFlags, remaining);
    if (unmetRequirements.length > 0) {
      say.error('Required flags missing: ' + unmetRequirements.join(', '));
      process.exit(1);
    }

    /**
     * Passed values
     * =============
     *
     * Example of the structure of
     * the passedValues object.
     *
     *     var passed = {
     *       flag: value
     *     }
     *
     * We create an object which gets
     * passed to the called function
     */

    // Grab all the remaining flags and their values
    for (var i = remaining.length - 1; i >= 0; i--) {
      // Run validation on matched flags
      if (_.contains(validFlags, remaining[i])) {
        // Check its type
        switch(opt.commands[command].flags[remaining[i]].type) {
          case Boolean:
            passedValues[remaining[i]] = _.contains(validFlags, remaining[i + 1]) ? opt.commands[command].flags[remaining[i]].value : parseBoolean(remaining[i + 1]);
            !_.contains(validFlags, remaining[i + 1]) && remaining.splice((i + 1), 1);
            break;
          case String:
            passedValues[remaining[i]] = _.contains(validFlags, remaining[i + 1]) ? opt.commands[command].flags[remaining[i]].value : remaining[i + 1];
            if (!_.contains(validFlags, remaining[i + 1])) remaining.splice((i + 1), 1);
            break;
          case Number:
            passedValues[remaining[i]] = _.contains(validFlags, remaining[i + 1]) ? opt.commands[command].flags[remaining[i]].value : parseInt(remaining[i + 1]);
            if (!_.contains(validFlags, remaining[i + 1])) remaining.splice((i + 1), 1);
            break;
          case Array:
            var rest = _.rest(remaining, (i + 1));
            // Loop over the rest, stop at the next flag
            for (var j = 0; j < rest.length; j++) {
              if (_.contains(validFlags, rest[j])) {
                break;
              } else {
                passedValues[remaining[i]].push(rest[j]);
                // Remove  each of these values before moving on or increment `i`?
                if (!_.contains(validFlags, rest[j + 1])) remaining.splice((i + 1), 1);
              }
            }
            break;
          default:
            say.important('Invalid flag type set: ' + remaining[i]);
            process.exit(1);
        }
      } else { // Store any input not belonging to a flag
        params.push(remaining[i]);
      }
    }
  }

  // Invoke the command as a function
  eval('functions.' + command)(opt, passedValues, params); // jshint ignore:line
};

// parseBoolean
//
// Takes 'true'/'false' as a string and returns
// its value as if it were a boolean
function parseBoolean(str) {
  return ('true' === str.toLowerCase() || 't' === str.toLowerCase());
}
