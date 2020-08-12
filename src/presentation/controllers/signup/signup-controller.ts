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
  Validation,
  Authentication
} from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation:Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request:HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = request.body
      await this.addAccount.add({
        name,
        email,
        password
      })
      const accessToken = await this.authentication.auth({ email, password })
      return success({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
