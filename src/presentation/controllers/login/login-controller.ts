import { Authentication, Controller, HttpRequest, HttpResponse, Validation } from './login-controller-protocols'
import { badRequest, serverError, unauthorized, success } from '../../helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly validation:Validation,
    private readonly authentication: Authentication
  ) {
    this.validation
    this.authentication
  }

  public async handle (request:HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = request.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }
      return success({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
