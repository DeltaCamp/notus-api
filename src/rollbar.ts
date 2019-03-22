var Rollbar = require("rollbar");

let instance

if (process.env.ROLLBAR_ACCESS_TOKEN) {
  instance = new Rollbar({
    accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true
  });
} else {
  instance = console
}

export const rollbar = instance
