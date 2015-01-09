'use strict';

Package.describe({
  name: 'pstuart2:velocity-notify',
  summary: ' /* Fill me in! */ ',
  version: '0.0.1',
  git: ' /* Fill me in! */ ',
  debugOnly: true
});

Npm.depends({
  'node-notifier': '4.0.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use('velocity:core', 'server');
  api.use('underscore', 'server');
  api.addFiles('pstuart2:velocity-notify.js', 'server');
  api.addFiles('assets/Error.png', 'server');
  api.addFiles('assets/Success.png', 'server');
});

//Package.onTest(function(api) {
//  api.use('tinytest');
//  api.use('pstuart2:velocity-growl');
//  api.addFiles('pstuart2:velocity-growl-tests.js');
//});
