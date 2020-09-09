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

## Standard Usage

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
  }
})

/*

Logs the following JSON to the console and also sends it in a POST request to https://my-elk-stack.com:

{ 
  "level": "error", 
  "message": "Error occurred in app",
  "appName": "my-special-app", 
  "timestamp": "<current timestamp>",
  "error": {
    "name": "BadError",
    "message": "A bad error occurred",
    "stack": "<BadError stacktrace>"
  }
}

*/
logger.error('Error occurred in app', new BadError('A bad error occurred'))

/*

Logs don't have to include a string argument -- they can simply contain an error or regular object.

logger.critical() in this case will log the following JSON to the console 
and also send it in a POST request to https://my-elk-stack.com:

{ 
  "level": "critical", 
  "appName": "my-special-app", 
  "timestamp": "<current timestamp>",
  "error": {
    "name": "AppExplosionError",
    "message": "A very terrible error occurred.",
    "stack": "<BadError stacktrace>"
  }
}

*/
logger.critical(new AppExplosionError('A very terrible error occurred.'))


```

## Serverless Usage: AWS Lambda

Using in an AWS Lambda will work very similar to the above code, with one caveat: if any logs result in asynchronous promises (e.g. sending logs to an HTTP or SQS destination), it is very important to use `logger.flush()` at the end of the lambda handler.

Example `handler.js`:
```js
import { logger } from './logger.js'

export const handler = async (event) => {
  try {
    // Example log. This will send to an HTTP endpoint
    logger.info('Starting process...')

    // Run code
    // ...

  } catch (err) {
    // Handle errors
    // ...

  } finally {
    // This will ensure all logs arrive to the HTTP endpoint before exiting the function.
    await logger.flush()
  }
}
```