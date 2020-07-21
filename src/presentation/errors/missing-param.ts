export class MissingParamError extends Error {
  constructor (name: string) {
    super(`Invalid param: ${name}`)
    this.name = 'InvalidParamError'
  }
}
