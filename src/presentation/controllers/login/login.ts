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
      const { email, password } = request.body
      if (!email) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }
      if (!password) {
        return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return new Promise(resolve => resolve(badRequest(new InvalidParamErrors('email'))))
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
