class DestinationError extends Error {
  constructor(message) {
    super(message)
    this.message = message
  }
}