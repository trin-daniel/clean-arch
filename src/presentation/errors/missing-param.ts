export class MissingParamError extends Error {
  constructor(name: string) {
    super()
    this.message = `Missing Param ${name}`
  }
}
