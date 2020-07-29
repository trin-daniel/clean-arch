import { Authentication, Controller, HttpRequest, HttpResponse, EmailValidator } from './login-protocols'
import { MissingParamError, InvalidParamErrors } from '../../errors'
import { badRequest, serverError, unauthorized, success } from '../../helpers/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator:EmailValidator,
    private readonly authentication: Authentication
  ) {
    this.emailValidator
    this.authentication
  }

  public async handle (request:HttpRequest): Promise<HttpResponse> {
    try {
      const fields = ['email', 'password']
      for (const names of fields) {
        if (!request.body[names]) {
          return badRequest(new MissingParamError(names))
        }
      }

      const { email, password } = request.body
      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamErrors('email'))
      }

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return success({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
