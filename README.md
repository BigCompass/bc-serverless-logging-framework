# bc-serverless-logging-framework

An easy-to-use logging framework that simplifies logging within serverless architectures.

## Background

There are already some really great logging libraries out there -- examples including [pino](https://www.npmjs.com/package/pino), [log4js](https://www.npmjs.com/package/log4js), [morgan](https://www.npmjs.com/package/morgan), and obviously, [winston](https://www.npmjs.com/package/winston).

Unfortunately, we encountered a use case that even these libraries did not seem to handle gracefully, and it's becoming a bigger and bigger use case every day -- **serverless**.

Serverless architectures typically require a robust logging implementation involving one or more external target destinations, as opposed to a logging implementation in a typical "serverfull" environment which sometimes is as simple as logging to one or more files.

Many projects already have a way of sending to external resources, but it is difficult to find any way to queue up sending logs to external resources and wait for the logs to send before closing out your process. This scenario is absolutely crucial for a serverless function such as AWS Lambda, as closing the process before logs finish sending to external resources might cause logs to sometimes not make it.

At [Big Compass](https://www.bigcompass.com/) we strive to add value to the cloud community so have decided to implement `bc-serverless-logging-framework`: our own JSON logging solution that works easily not only on serverless architectures but on traditional systems as well.

## Installation

Below details the installation methods for this framework. Both methods end in the same result, and do not need any environmental configurations.

Since this framework is managed by you, and typically deployed as a dependency in your applications, you decide if you deploy this with any public facing resources.

No IAM roles or policies are specifically needed to install this framework in your applications. No sensitive information is stored as a part of this installation either. You choose where you want to send logs. If you connect to an external target, be sure to follow best practices for storing your credentials securely. Tools like AWS Secrets Manager can help.

This installation is completely free. You only pay for the applications/microservices you deploy this framework on.

### Skills Required
Before installing this dependency, it is recommended you have skills with:
1. NodeJS
2. Git CLI
3. NPM

### NPM/Yarn Dependency (Recommended Deployment Option)

#### Prerequisites
1. Either Yarn or NPM is installed for installing the framework as a dependency

This project is not currently registered with NPM, but can be added as a dependency in your applications in less than a minute using NPM by referencing this repository directly.

npm:

```
npm install --save https://github.com/BigCompass/bc-serverless-logging-framework.git
```

yarn:

```
yarn add https://github.com/BigCompass/bc-serverless-logging-framework.git
```

### Clone the Repository

#### Prerequisites
1. Git CLI is installed on your server/machine

You may also clone the repository and include this framework in your applications by using a local version of the code. It is still recommended to manage this framework from a central location and as a dependency in your microservices/applications. This installation technique takes less than a minute.

```
git clone git@github.com:BigCompass/bc-serverless-logging-framework.git
```

## Current Features

`bc-serverless-logging-framework` currently supports the following features:

- Support for sending logs to:
  - SQS
  - Console
  - HTTP
  - Custom-defined destinations
- Default log levels, with the ability to define custom ones
- Add default properties to every log, both static properties and dynamic ones
- The ability to wait for all asynchronous logs to finish sending, which is important for most serverless functions.
- The ability to create a logger based off of an existing logger (e.g. clone a logger), and add new properties to it

## Future features

- Support for more destinations, such as logging to one or multiple files
- Retries with exponential backoff when saving to external endpoints such as HTTP or SQS
- Batching logs when saving to external endpoints such as HTTP or SQS
- Integration with streaming services such as AWS Kinesis and Kafka

## Standard Usage

The easiest way to get started with `bc-serverless-logging-framework` is to simply create a logger! Use `bcLogger.create` to get going:

`logger.js`

```js
import { bcLogger } from 'bc-serverless-logging-framework'

export const logger = bcLogger.create({
  // Designate default props to add to each log
  props: {
    appName: 'my-special-app',
    timestamp: () => new Date().toISOString()
  },

  transports: [
    // Log info-level logs and above to the console.
    {
      level: bcLogger.levels.info,
      destination: bcLogger.destinations.consoleLog()
    },

    // Log error-level logs to some API
    {
      level: bcLogger.levels.error,
      destination: bcLogger.destinations.http({
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

## bc-serverless-logging-framework Destinations

`bc-serverless-logging-framework` contains the following pre-defined destinations:

- `http`
- `sqs`
- `consoleLog`

More destinations are being planned to implement, and `bc-serverless-logging-framework` is structured with ease of new destination implementation in mind.

## bc-serverless-logging-framework Transports

`bc-serverless-logging-framework` uses the concept of transports in order to send log messages to one or more destinations.

A transport contains the following properties:

- `destination`: a `bc-serverless-logging-framework` destination (see: above). Required unless a `handler` property is defined.
- `handler`: a custom function for handling a `log` object. Required if a `destination` is not defined.
- `level`: Optional property to defined which levels the transport will run for. When specifying a level, the transport will run for the specified levels and all levels above it. For example, if specifying `bcLogger.levels.warn` as the transport level, the transport will run for `logger.warn()`, `logger.error()`, and `logger.critical()`. If not specified, the log will log at all levels.

### bc-serverless-logging-framework Transports Example

```js
const logger = bcLogger.create({
  transports: [
    // Log to sqs at warn-level and above
    {
      level: bcLogger.levels.warn,
      destination: bcLogger.destinations.sqs({
        queueUrl: 'http://example-queue.com'
      })
    },

    // Log to an http endpoint for all log levels
    {
      destination: bcLogger.destinations.http({
        url: 'http://my-log-endpoint.com',
        method: 'POST'
      })
    },

    // Log to the console for info level and above
    {
      level: bcLogger.levels.info,
      destination: bcLogger.destinations.consoleLog()
    },

    // Run a custom log handler
    {
      level: bcLogger.levels.critical,
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

`bc-serverless-logging-framework` allows default props to be added easily both when creating the logger and after the logger has already been created.

Example setting default props:

```js
import { v4 as uuidv4 } from 'uuid'
const jobId = uuidv4()

const logger = bcLogger.create({
  props: {
    project: 'my-example-project',
    jobId
  }
})
```

## Computed props

`bc-serverless-logging-framework` allows for computed props as well, represented as functions that have access to the properties within the log object. A common computed property to add to a logger is a `timestamp()` function, but they can also be used to format specific properties or make complicated computations on log property values.

Example:

```js
import { v4 as uuidv4 } from 'uuid'
const jobId = uuidv4()

const logger = bcLogger.create({
  props: {
    project: 'my-example-project',
    jobId
  },
  computed: {
    // Add a timestamp to every log
    timestamp: () => new Date().toISOString()

    // Format success property to be 1 or 0
    success: log => log.success ? 1 : 0

    // Attach flag if error occurred
    errorOccurred(log) {
      if (log.level === bcLogger.levels.error || log.level === bcLogger.levels.critical) {
        return true
      }
    }
  }
})

logger.info('Things are going well.', { success: true })
// -> {
//      "level": "info",
//      "message": "Things are going well.",
//      "timestamp": "<current timestamp>",
//      "success": 1
//    }

logger.error('An error occurred.', { success: false })
// -> {
//      "level": "error",
//      "message": "An error occurred.",
//      "timestamp": "<current timestamp>",
//      "success": 0,
//      "errorOccurred": true
//    }
```

## Log Levels

#### Default log levels

`bc-serverless-logging-framework` uses the following log levels by default:

- `debug`
- `info`
- `warn`
- `error`
- `critical`

When creating a logger, a function is added for each level and can be used as so:

```js
const logger = bcLogger.create({ ... })

logger.debug('This is a debug message')
logger.info('This is an info message')
logger.warn('This is a warn message')
// etc.
```

All default log levels are accessible directly in the `bcLogger.levels` object. E.g., `bcLogger.levels.info` is set to "info", `bcLogger.levels.error` is set to "error", etc.

Although default log levels are not expected to change, it is recommended to use these predefined strings if referencing default log levels in your code.

#### Custom log levels

`bc-serverless-logging-framework` can also use custom log levels by passing them into the `bcLogger.create()` function:

```js
const logger = bcLogger.create({
  levels: [
    bcLogger.levels.info,
    'custom_level',
    bcLogger.levels.error,
    bcLogger.levels.critical,
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

## Child Loggers

Sometimes it can make sense to make a new logger based on a parent logger. With `bc-serverless-logging-framework` it's possible to do just that. Simply create a top-level logger and then call `logger.child()` to get a clone of the logger.

You can pass a configuration into the `child()` function to result in a logger with a configuration merged with the parent's.

Example:

```js
const logger = bcLogger.create({
  props: {
    loggerName: 'parent-logger',
    test: true
  },
  computed: {
    timestamp: () => new Date().toISOString()
  },
  transports: [
    {
      destination: bcLogger.destinations.consoleLog()
    }
  ]
})

logger.info('This is from the parent logger!')
// -> {
//      "level": "info",
//      "message": "This is from the parent logger!",
//      "loggerName": "parent-logger",
//      "test": true,
//      "timestamp": "2020-09-21T16:39:48.945Z"
//    }

const childLogger = logger.child({
  props: {
    loggerName: 'child-logger',
    isChild: true
  },
  computed: {
    randomDecimal: () => Math.random()
  }
})

childLogger.info('This is from the child logger!')
// -> {
//      "level": "info",
//      "message": "This is from the child logger!",
//      "loggerName": "child-logger",
//      "test": true,
//      "isChild": true,
//      "timestamp": "2020-09-21T16:39:48.948Z",
//      "randomDecimal": 0.9632872942532387
//    }
```

As a second argument, `child()` takes in a `BCLoggerChildOptions` argument. This argument is a configuration with the following properties:

| Property            | Details                                      |
| ------------------- | -------------------------------------------- |
| `replaceTransports` | Replace the parent logger's transports array |
| `replaceProps`      | Replace the parent logger's props object     |
| `replaceComputed`   | Replace the parent logger's computed object  |

## Architecture
### Traditional Logging Architecture
Traditional logging architecture might look like the below diagram. It is very simple and straightforward.
![image](https://user-images.githubusercontent.com/5343588/109753355-57eb7f80-7b9f-11eb-8e3c-2357017edd32.png)
### Serverless Logging Architecture
The architecture of serverless and microservices logging looks like this, and this is exactly how the Big Compass Serverless Logging Framework can be installed on the various serverless services to help standardize and send logs to a logging target.
![image](https://user-images.githubusercontent.com/5343588/109753449-82d5d380-7b9f-11eb-8f2d-15072da67aee.png)

## AWS Best Practices
* Follow [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) when deploying to AWS
* Do not use the root user for any deployments to AWS
* Follow IAM best practices for providing least privilege access to AWS users and roles assumed by services

## Support
This framework is open source, developed by Big Compass and supported by the community. Feel free to make feature requests for support or reach out to Big Compass for logging help.

