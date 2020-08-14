export class InvalidParamErrors extends Error {
  constructor (name: string) {
    super()
    this.message = `Invalid Param ${name}`
  }
}
