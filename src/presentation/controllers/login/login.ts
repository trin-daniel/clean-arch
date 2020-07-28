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
    if (!request.body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!request.body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }
    const isValid = this.emailValidator.isValid(request.body.email)
    if (!isValid) {
      return new Promise(resolve => resolve(badRequest(new InvalidParamErrors('email'))))
    }
    return {
      body: {},
      statusCode: 200
    }
  }
}
