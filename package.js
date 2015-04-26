'use strict';

Package.describe({
  name: 'pstuart2:velocity-notify',
  summary: 'Adding a simple pass / fail notify reporter to meteor-velocity',
  version: '0.0.4',
  git: 'https://github.com/pstuart2/velocity-notify',
  debugOnly: true
});

Npm.depends({
  'node-notifier': '4.0.3'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');
  api.use('velocity:core@0.4.1', 'server');
  api.use('underscore', 'server');
  api.addFiles('pstuart2:velocity-notify.js', 'server');
  api.addFiles('assets/Error.png', 'server');
  api.addFiles('assets/Success.png', 'server');
});
