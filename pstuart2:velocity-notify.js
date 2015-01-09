/* global VelocityAggregateReports:true */
/* global VelocityTestReports:true */

'use strict';
var notifier = Npm.require('node-notifier'),
		path = Npm.require('path');

function getStatus() {
	var aggregateComplete = VelocityAggregateReports.findOne({name: 'aggregateComplete'});
	if (aggregateComplete.result !== 'completed') {
		return 'pending';
	}

	var aggregateResult = VelocityAggregateReports.findOne({name: 'aggregateResult'});
	return aggregateResult.result;
}

function aggregateResult() {
	// Check for complete and status.
	var status = getStatus();
	if (status === 'pending') {
		return;
	}

	// TODO: Check env options
	var jasmineServerUnitFailed = VelocityTestReports.find({framework: 'jasmine-server-unit', result: 'failed'}).count(),
			jasmineServerIntegrationFailed = VelocityTestReports.find({framework: 'jasmine-server-integration', result: 'failed'}).count(),
			jasmineClientIntegrationFailed = VelocityTestReports.find({framework: 'jasmine-client-integration', result: 'failed'}).count();

	var failed = jasmineServerUnitFailed + jasmineServerIntegrationFailed + jasmineClientIntegrationFailed,
			assetPath = path.join(process.env.PWD, 'packages/pstuart2:velocity-notify');

	if (failed > 0) {
		notifier.notify({
			title: 'Velocity Errors',
			message: failed + ' tests failed!',
			icon: path.join(assetPath, 'assets/Error.png')
		});
	} else {
		notifier.notify({
			title: 'Velocity Passed',
			message: 'All tests passed.',
			icon: path.join(assetPath, 'assets/Success.png')
		});
	}
}

if (!process.env.IS_MIRROR) {
	Meteor.startup(function () {
		VelocityAggregateReports.find({}).observe({
			added: aggregateResult,
			changed: aggregateResult
		});
	});
}
