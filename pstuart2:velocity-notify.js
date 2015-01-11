/* global VelocityAggregateReports:true */
/* global VelocityTestReports:true */

'use strict';
var notifier = Npm.require('node-notifier'),
		path = Npm.require('path'),
		disableVelocityNotify = !!process.env.TEAMCITY_DATA_PATH || !!process.env.DISABLE_VELOCITY_NOTIFY,
		isDebug = !!process.env.DEBUG_VELOCITY_NOTIFY;


function getStatus() {
	var aggregateComplete = VelocityAggregateReports.findOne({name: 'aggregateComplete'});
	if (aggregateComplete.result !== 'completed') {
		return 'pending';
	}

	var aggregateResult = VelocityAggregateReports.findOne({name: 'aggregateResult'});
	return aggregateResult.result;
}

function aggregateResult() {
	var status = getStatus();

	// Don't want to report if pending, wait until we get pass / fail.
	if (isDebug) { console.log('[velocity-notify] Test Status: ' + status); }
	if (status === 'pending') {
		if (isDebug) { console.log('[velocity-notify] Status is "pending", not ready to notify.'); }
		return;
	}

	var failed = VelocityTestReports.find({result: 'failed'}).count();
	var packagePath = path.join(process.env.PWD, 'packages/pstuart2:velocity-notify');

	if (isDebug) { console.log('[velocity-notify] Package Path: ' + packagePath); }
	if (isDebug) { console.log('[velocity-notify] Calling notifier, Failed Tests: ' + failed); }

	if (failed > 0) {
		notifier.notify({
			title: 'Velocity Errors',
			message: failed + ' tests failed!',
			icon: path.join(packagePath, 'assets/Error.png')
		});
	} else {
		notifier.notify({
			title: 'Velocity Passed',
			message: 'All tests passed.',
			icon: path.join(packagePath, 'assets/Success.png')
		});
	}
}

if (!process.env.IS_MIRROR && !disableVelocityNotify) {
	Meteor.startup(function () {
		if (isDebug) { console.log('[velocity-notify] Setting up observe.'); }
		VelocityAggregateReports.find({}).observe({
			added: aggregateResult,
			changed: aggregateResult
		});
	});
}
