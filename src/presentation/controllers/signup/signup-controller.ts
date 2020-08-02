import
{
  badRequest,
  serverError,
  success
} from '../../helpers/http/http-helper'

import
{
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation:Validation
  ) {
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
