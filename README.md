# velocity-notify
Adding a simple pass / fail notify reporter to meteor-velocity.

## Description
This package uses [node-notifier](https://www.npmjs.com/package/node-notifier) to send system notifications on
a successful or failed build. When working with multiple virtual desktops it is useful so you don't have to go
look at the browser that contains Velocity to see if your tests are passing.

## Options
* DISABLE_VELOCITY_NOTIFY=1 Disables the notifications.
* DEBUG_VELOCITY_NOTIFY=1 Logs some debug information out to the console.

Check out the some screens on the [wiki](https://github.com/pstuart2/velocity-notify/wiki).
