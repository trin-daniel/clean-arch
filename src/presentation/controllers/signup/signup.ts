import
{
  MissingParamError,
  InvalidParamErrors
} from '../../errors'

import
{
  badRequest,
  serverError,
  success
} from '../../helpers/http-helper'

import
{
  Request,
  Response,
  EmailValidator,
  Controller,
  AddAccount
} from './signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly email:EmailValidator,
    private readonly addAccount: AddAccount
  ) {
    this.email
    this.addAccount
  }

  async handle (request:Request): Promise<Response> {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmation']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, confirmation } = request.body
      const isValid = this.email.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamErrors('email'))
      }
      if (password !== confirmation) {
        return badRequest(new InvalidParamErrors('confirmation'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return success(account)
    } catch (err) {
      return serverError()
    }
  }
}
