export class InvalidParamErrors extends Error {
  constructor (name: string) {
    super(`Missing param: ${name}`)
    this.name = name
  }
}
