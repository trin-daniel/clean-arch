export class MissingParamError extends Error {
  constructor (name: string) {
    super(`Missing Param ${name}`)
  }
}
