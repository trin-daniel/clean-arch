import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError, InvalidParamErrors } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'
import { Authentication } from '../../../domain/usecases/authentication'
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

      await this.authentication.auth(email, password)

      return {
        body: {},
        statusCode: 200
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
