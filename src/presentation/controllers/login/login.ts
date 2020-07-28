import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
export class LoginController implements Controller {
  public async handle (request:HttpRequest): Promise<HttpResponse> {
    if (!request.body.email) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }
    if (!request.body.password) {
      return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
    }
    return { body: {}, statusCode: 200 }
  }
}
