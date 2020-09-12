export class ServerError extends Error {
  constructor(message: Error) {
    super('Internal Server Error')
    this.stack = message.stack
  }
}
