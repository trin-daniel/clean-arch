export class ServerError extends Error {
  constructor (stackError?:Error) {
    super('Internal server error!')
    this.name = 'ServerError'
    this.stack = stackError?.stack
  }
}
