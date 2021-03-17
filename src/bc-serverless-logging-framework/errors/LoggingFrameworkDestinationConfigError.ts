/**
 * Error to throw when there is a problem
 * configuration a destination
 */
export class LoggingFrameworkDestinationConfigError extends Error {
  constructor(message: any) {
    super(message)
    this.message = message
  }
}
