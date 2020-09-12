export class EmailInUseError extends Error {
  constructor() {
    super('E-mail is already in use ')
    this.name = 'EmailInUseError'
  }
}
