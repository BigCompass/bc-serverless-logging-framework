# lager

A clean, crisp brew of a logging library that even tastes good on serverless architectures.

## Background

There are already some really great logging libraries out there -- examples including [pino](https://www.npmjs.com/package/pino), [log4js](https://www.npmjs.com/package/log4js), [morgan](https://www.npmjs.com/package/morgan), and obviously, [winston](https://www.npmjs.com/package/winston).

Unfortunately, we encountered a use case that even these libraries did not seem to handle gracefully, and it's becoming a bigger and bigger use case every day -- **serverless**.

Serverless architectures typically require a robust logging implementation involving one or more external target destinations, as opposed to a logging implementation in a typical "serverfull" environment which sometimes is as simple as logging to one or more files. 

Many projects already have a way of sending to external resources, but it is difficult to find any way to queue up sending logs to external resources and wait for the logs to send before closing out your process. This scenario is absolutely crucial for a serverless function such as AWS Lambda, as closing the process before logs finish sending to external resources might cause logs to sometimes not make it.

At Big Compass, we strive to add value to the cloud community as a whole so have decided to implement `lager`: our own JSON logging solution that works easily not only on serverless architectures but on traditional systems as well.

## Installation

npm:
```
> npm install --save @bigcompass/lager
```

yarn:
```
> yarn add @bigcompass/lager
```

## Usage

The easiest way to get started with `lager` is to simply create a logger! Use `lager.create` to get going:

`logger.js`
```js
import { lager } from '@bigcompass/lager'

export const logger = lager.create({

  // Designate default props to add to each log
  props: {
    appName: 'my-special-app',
    timestamp: () => new Date().toISOString()
  },

  transports: [

    // Log info-level logs and above to the console.
    {
      level: lager.levels.info,
      destination: lager.destinations.consoleLog()
    },

    // Log error-level logs to some API
    {
      level: lager.levels.error,
      destination: lager.destinations.http({
        url: 'https://my-elk-stack.com',
        method: 'POST',
        headers: {
          'x-api-key': process.env.API_KEY
        }
      })
    }

  ]

})
```

`index.js`
```js
import { logger } from './logger.js'

/*

Logs nothing to the console, because the logger has no transports logging at the debug level.

*/
logger.debug('this will not go anywhere.')

/*

logs the following json to the console:
{ 
  "level": "info", 
  "message": "test info message",
  "appName": "my-special-app", 
  "timestamp": "<current timestamp>"
}

*/
logger.info('test info message')

/*

Logs the following json to the console:
{ 
  "level": "warn", 
  "message": "A warning occurred. View warning body for more details",
  "appName": "my-special-app", 
  "timestamp": "<current timestamp>",
  "warning": {
    "code": "MAX_EMAIL_THRESHOLD_90",
    "message": "Max email threshold almost reached -- 90% of free tier used this month"
  }
}

*/
logger.warn('A warning occurred. View warning body for more details', {
  warning: {
    code: 'MAX_EMAIL_THRESHOLD_90',
    message: 'Max email threshold almost reached -- 90% of free tier used this month'
  },
  warning
})
```
