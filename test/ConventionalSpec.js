// Conventional parser test suite

// define(function (require) {
//     var lodash = require('lodash');
// });

define([
  'lodash',
  'chalk'
  ], function(_, chalk) {
    'use strict';

    describe('Conventional Option Parser', function() {
      var trueString  = 'true',
          trueAbbrev  = 't',
          falseString = 'false',
          falseAbbrev = 'f';

      it('Should parse a string to a boolean', function() {
        expect(parseBoolean(trueString)).toEqual(true);
      });

      it('Should parse a single letter to a boolean', function() {
        expect(parseBoolean(trueAbbrev)).toEqual(true);
      });

      it('Should parse false as a string to boolean', function() {
        expect(parseBoolean(falseString)).toEqual(false);
      });

      it('Should parse the string "f" to a boolean', function() {
        expect(parseBoolean(falseAbbrev)).toEqual(false);
      });
    });
  });
