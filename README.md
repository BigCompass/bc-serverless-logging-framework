# @bigcompass/lager

A clean, crisp brew of a logging library that even tastes good on serverless architectures.

## Background

There are already some really great logging libraries out there -- examples including [pino](https://www.npmjs.com/package/pino), [log4js](https://www.npmjs.com/package/log4js), [morgan](https://www.npmjs.com/package/morgan), and obviously, [winston](https://www.npmjs.com/package/winston).

Unfortunately, we encountered a use case that even these libraries did not seem to handle gracefully, and it's becoming a bigger and bigger use case every day -- **serverless**.

Serverless architectures typically require a robust logging implementation involving one or more external target destinations, as opposed to a logging implementation in a typical "serverfull" environment which sometimes is as simple as logging to one or more files.

Many projects already have a way of sending to external resources, but it is difficult to find any way to queue up sending logs to external resources and wait for the logs to send before closing out your process. This scenario is absolutely crucial for a serverless function such as AWS Lambda, as closing the process before logs finish sending to external resources might cause logs to sometimes not make it.

At [Big Compass](https://www.bigcompass.com/) we strive to add value to the cloud community so have decided to implement `lager`: our own JSON logging solution that works easily not only on serverless architectures but on traditional systems as well.

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
    message:
      'Max email threshold almost reached -- 90% of free tier used this month'
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

Using in AWS Lambda is very similar to the above code with one caveat: if any logs result in asynchronous promises (e.g. sending logs to an HTTP or SQS destination), it is very important to use `logger.flush()` at the end of the lambda handler.

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

**Note**: It's very important to use `await` in the example above.

This will work:

```js
await logger.flush()
```

This will **not** work:

```js
logger.flush()
```

## Lager Destinations

`lager` contains the following pre-defined destinations:

- `http`
- `sqs`
- `consoleLog`

More destinations are being planned to implement, and `lager` is structured with ease of new destination implementation in mind.

## Lager Transports

`lager` uses the concept of transports in order to send log messages to one or more destinations.

A transport contains the following properties:

- `destination`: a `lager` destination (see: above). Required unless a `handler` property is defined.
- `handler`: a custom function for handling a `log` object. Required if a `destination` is not defined.
- `level`: Optional property to defined which levels the transport will run for. When specifying a level, the transport will run for the specified levels and all levels above it. For example, if specifying `lager.levels.warn` as the transport level, the transport will run for `logger.warn()`, `logger.error()`, and `logger.critical()`. If not specified, the log will log at all levels.

### Lager Transports Example

```js
const logger = lager.create({
  transports: [
    // Log to sqs at warn-level and above
    {
      level: lager.levels.warn,
      destination: lager.destinations.sqs({
        queueUrl: 'http://example-queue.com'
      })
    },

    // Log to an http endpoint for all log levels
    {
      destination: lager.destinations.http({
        url: 'http://my-log-endpoint.com',
        method: 'POST'
      })
    },

    // Log to the console for info level and above
    {
      level: lager.levels.info,
      destination: lager.destinations.consoleLog()
    },

    // Run a custom log handler
    {
      level: lager.levels.critical,
      handler(log) {
        console.error('CRITICAL ERROR!')
        console.error(log)
      }
    }
  ]
})
```

## Default Logger props

A common use case for logging is to have default properties in each log message. For example, including a `project`, `function`, and/or `jobId` in your logs to add to traceability. Or, adding a timestamp to each log.

`lager` allows default props to be added easily both when creating the logger and after the logger has already been created.

Example setting default props:

```js
import { v4 as uuidv4 } from 'uuid'
const jobId = uuidv4()

const logger = lager.create({
  props: {
    project: 'my-example-project',
    jobId,
    timestamp() {
      return new Date().toISOString()
    }
  }
})
```

If a default prop is a function, the function has access to the log object itself too. Example using the log object:

```js
// The following logger will apply an ageRange value if the
// log object contains an age property
// e.g. logger.info({ age: 22 }) will result in the following JSON:
// { "level": "info", "age": 22, "ageRange": "20-29"}
const logger = lager.create({
  props: {
    project: 'age-calculator-logger',
    ageRange(log) {
      if (typeof log?.age === 'number') {
        const min = log.age - (log.age % 10)
        const max = min + 9
        if (min >= 100) {
          return '100+
        } else {
          return `${min}-${max}`
        }
      }
    }
  }
})
```

## Log Levels

#### Default log levels

`lager` uses the following log levels by default:

- `debug`
- `info`
- `warn`
- `error`
- `critical`

When creating a logger, a function is added for each level and can be used as so:

```js
const logger = lager.create({ ... })

logger.debug('This is a debug message')
logger.info('This is an info message')
logger.warn('This is a warn message')
// etc.
```

All default log levels are accessible directly in the `lager.levels` object. E.g., `lager.levels.info` is set to "info", `lager.levels.error` is set to "error", etc.

Although default lager levels are not expected to change, it is recommended to use these predefined strings if referencing default lager levels in your code.

#### Custom log levels

`lager` can also use custom log levels by passing them into the `lager.create()` function:

```js
const logger = lager.create({
  levels: [
    lager.levels.info,
    'custom_level',
    lager.levels.error,
    lager.levels.critical,
    'custom_level_2'
  ]
})

/*
  Results in the following functions defined in logger:

  logger.info()
  logger.custom_level()
  logger.error()
  logger.critical()
  logger.custom_level_2()
*/
```
