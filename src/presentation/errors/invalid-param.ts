export class InvalidParamErrors extends Error {
  constructor (name: string) {
    super(`Invalid Param ${name}`)
  }
}
