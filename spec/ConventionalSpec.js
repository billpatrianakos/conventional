/**
 * Conventional Parser Test Suite
 *
 * Describe and test public methods
 * and private functions here.
 * NOTE: Any private functions need
 * to be declared within the test suite
 * itself as they are not accessible
 * within the scope of the tested module.
 */

// Test private `parseBoolean()` function
describe('String to boolean conversion', function() {
  // A copy of our private function - it isn't
  // efficient but we have to remember to copy
  // this into the tests each time it changes
  function parseBoolean(str) {
    return ('true' === str.toLowerCase() || 't' === str.toLowerCase());
  }
  var trueString    = 'true',
      trueAbbrev    = 't',
      falseString   = 'false',
      falseAbbrev   = 'f',
      randomString  = function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ ) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      };

  it('should parse a string to a boolean', function() {
    expect(parseBoolean(trueString)).toEqual(true);
  });

  it('should parse a single letter to a boolean', function() {
    expect(parseBoolean(trueAbbrev)).toEqual(true);
  });

  it('should parse false as a string to boolean', function() {
    expect(parseBoolean(falseString)).toEqual(false);
  });

  it('should parse the string "f" to a boolean', function() {
    expect(parseBoolean(falseAbbrev)).toEqual(false);
  });

  it('should be able to handle any string', function() {
    expect(parseBoolean(randomString())).toEqual(false);
  });
});
