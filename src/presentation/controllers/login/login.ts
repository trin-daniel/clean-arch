import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError, InvalidParamErrors } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'
export class LoginController implements Controller {
  constructor (
    private readonly emailValidator:EmailValidator
  ) {
    this.emailValidator
  }

  public async handle (request:HttpRequest): Promise<HttpResponse> {
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
    return {
      body: {},
      statusCode: 200
    }
  }
}
