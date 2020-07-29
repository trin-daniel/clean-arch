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
  HttpRequest,
  HttpResponse,
  EmailValidator,
  Controller,
  AddAccount,
  Validation
} from './signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly email:EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation:Validation
  ) {
    this.email
    this.addAccount
    this.validation
  }

  async handle (request:HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = request.body
      const isValid = this.email.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamErrors('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return success(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
