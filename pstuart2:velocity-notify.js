/* global VelocityAggregateReports:true */
/* global VelocityTestReports:true */

'use strict';
var notifier = Npm.require('node-notifier'),
		path = Npm.require('path'),
		disableVelocityNotify = !!process.env.TEAMCITY_DATA_PATH || (process.env.DISABLE_VELOCITY_NOTIFY === '1');


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
	if (status === 'pending') {
		return;
	}

	var failed = VelocityTestReports.find({result: 'failed'}).count();
	var packagePath = path.join(process.env.PWD, 'packages/pstuart2:velocity-notify');

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
		VelocityAggregateReports.find({}).observe({
			added: aggregateResult,
			changed: aggregateResult
		});
	});
}
