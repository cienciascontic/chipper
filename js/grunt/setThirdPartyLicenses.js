// Copyright 2002-2015, University of Colorado Boulder

/**
 * This grunt task creates an object literal that describes the third-party libraries that are included in the html deliverable.
 * It shares the object literal with other grunt tasks via global.phet.thirdPartyLicenses.
 * License info is read from sherpa/third-party-licenses.json, and the format of the object literal is similar to that syntax.
 *
 * By convention, the key for each license entry is the name of the JavaScript source file,
 * with the .js suffix stripped off.  For example, for almond-0.2.9.js, the key is 'almond-0.2.9'.
 * (TODO This convention is dubious. Why are we bothering to strip off the .js suffix?)
 *
 * The fields in each license entry are:
 *
 * {string[]} text - the text of the license info. A newline will be appended to each array element
 * {string} license - the license options for the library
 * {string} [projectURL] - the project's URL
 * {string} [licenseURL] - the project's license URL
 * {string} [notes] - optional notes
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

// modules
var assert = require( 'assert' );
var fs = require( 'fs' );
/* jshint -W079 */
var _ = require( '../../../sherpa/lib/lodash-2.4.1.min' ); // allow _ to be redefined, contrary to jshintOptions.js
/* jshint +W079 */

var BUILD_INFO_FILENAME = '../chipper/build.json'; // contains build info, which identifies licenses applicable to all sims
var LICENSE_INFO_FILENAME = '../sherpa/third-party-licenses.json'; // contains third-party license info

/**
 * @param grunt the grunt instance
 * @param {Object} pkg package.json
 */
module.exports = function( grunt, pkg ) {
  'use strict';

  // Read build info
  assert( fs.existsSync( BUILD_INFO_FILENAME ), 'missing ' + BUILD_INFO_FILENAME );
  var buildInfo = grunt.file.readJSON( BUILD_INFO_FILENAME );

  // Read license info
  assert( fs.existsSync( LICENSE_INFO_FILENAME ), 'missing ' + LICENSE_INFO_FILENAME );
  var licenseInfo = grunt.file.readJSON( LICENSE_INFO_FILENAME );

  // Add common licenses, as specified in build.json
  grunt.log.debug( 'Adding common licenses...' );
  assert( buildInfo.common && buildInfo.common.licenseKeys, BUILD_INFO_FILENAME + ' is missing common.licenseKeys' );
  var licenseKeys = buildInfo.common.licenseKeys;

  // Extract keys from pkg.preload, for any dependencies in sherpa
  grunt.log.debug( 'Adding preload licenses...' );
  pkg.preload.forEach( function( path ) {
    if ( path.indexOf( '/sherpa/' ) !== -1 ) {
      path = path.replace( /\.js$/, '' );  // trim .js file suffix
      var lastSlash = path.lastIndexOf( '/' );
      var key = path.substring( lastSlash + 1 );
      licenseKeys.push( key );
    }
  } );

  // Add sim-specific licenses, as specified in the (optional) licenseKeys field of package.json.
  if ( pkg.licenseKeys ) {
    grunt.log.debug( 'Adding sim-specific licenses...' );
    licenseKeys = licenseKeys.concat( pkg.licenseKeys );
  }

   // Add together (data collection) licenses, as specified in build.json
  if ( grunt.option( 'together' ) ) {
    grunt.log.debug( 'Adding together licenses...' );
    assert( buildInfo.together && buildInfo.together.licenseKeys, BUILD_INFO_FILENAME + ' is missing together.licenseKeys' );
    licenseKeys.concat( buildInfo.together.licenseKeys );
  }

  // Sort keys and remove duplicates
  licenseKeys = _.uniq( _.sortBy( licenseKeys, function( key ) { return key.toUpperCase(); } ) );

  grunt.log.debug( 'licenseKeys = ' + licenseKeys.toString() );

  // Combine all licenses into 1 object literal
  var licenseObject = {};
  licenseKeys.forEach( function( key ) {

    var license = licenseInfo[ key ];
    assert( license, 'sherpa/third-party-licenses.json: no entry for key = ' + key );
    assert( license.text, 'sherpa/third-party-licenses.json: no text field for key = ' + key );
    assert( license.license, 'sherpa/third-party-licenses.json: no license field for key = ' + key );

    licenseObject[ key ] = license;
  } );

  // share with other tasks via a global
  global.phet = global.phet || {};
  global.phet.thirdPartyLicenses = licenseObject;
};
