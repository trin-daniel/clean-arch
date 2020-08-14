export class AccessDeniedError extends Error {
  constructor () {
    super()
    this.message = 'Access denied'
  }
}
