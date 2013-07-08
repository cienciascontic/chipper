/**
 * JSHint options for simulations and common code, meant to be passed to grunt-contrib-jshint
 */
module.exports = {
  // options documented at http://www.jshint.com/docs/#options

  // enforcing options
  curly: true, // require braces around blocks for loops and conditionals
  eqeqeq: true, // prohibit == and !=, use === and !===
  immed: true, // prohibits the use of immediate function invocations without wrapping them in parentheses
  latedef: true, // prohibits the use of a variable before it was defined
  newcap: true, // requires you to capitalize names of constructor functions
  noarg: true, // prohibits the use of arguments.caller and arguments.callee
  nonew: true, // prohibits calling new without assigning result to a variable
  undef: true, // prohibits the use of explicitly undeclared variables
  strict: true, // requires all functions to run in ECMAScript 5's strict mode

  // relaxing options
  expr: true, // suppresses warnings about the use of expressions where normally you would expect to see assignments or function calls, so we can use assert && assert( ... )
  loopfunc: true, // suppresses warnings about defining functions inside of loops, but we know how not to shoot ourselves in the foot, and this is useful for _.each

  // tell JSHint about global variables that are defined elsewhere. If value is false (default), JSHint will consider that variable as read-only.
  globals: {

    // writable globals ---------------------------------

    sceneryAssert: true,  // for removal of scenery assertions
    sceneryAssertExtra: true, // for removal of scenery assertions
    sceneryLayerLog: true, // scenery logging levels
    sceneryEventLog: true, // scenery logging levels
    sceneryAccessibilityLog: true, // scenery accessibility levels
    Float32Array: true, // we actually polyfill this, so allow it to be set

    // read-only globals ---------------------------------

    define: false, // require.js
    require: false, // require.js
    Uint16Array: false,
    Uint32Array: false,
    document: false,
    window: false,
    console: false,
    HTMLImageElement: false,
    HTMLCanvasElement: false,
    Backbone: false, // backbone is currently run outside of requirejs
    module: false, // as used in Gruntfile.js
    $: false, // jQuery
    _: false, // underscore, lodash
    clearTimeout: false,
    Image: false, // DOM.js
    Blob: false,  // DOM.js
    canvg: false,
    io: false, //socket.io,
    TWEEN: false, //sole/tween.js
    navigator: false, //For Mobile Safari detection, see http://stackoverflow.com/questions/3007480/determine-if-user-navigated-from-mobile-safari
    Howl: false, //for web audio
    PxLoader: false //for preloading images
  }
};
