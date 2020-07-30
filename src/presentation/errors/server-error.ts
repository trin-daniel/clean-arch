export class ServerError extends Error {
  constructor (stack:Error) {
    super('Internal Server Error')
    this.stack = stack.stack
  }
}
