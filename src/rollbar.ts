var Rollbar = require("rollbar");

const debug = require('debug')('rollbar')

let instance

if (process.env.ROLLBAR_ACCESS_TOKEN) {
  instance = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
  });
}

export const rollbar = {
  error: function (...any) {
    debug.call(undefined, arguments)
    if (instance) {
      instance.error.call(instance, arguments)
    }
  }
}
