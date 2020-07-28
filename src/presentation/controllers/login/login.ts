import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { resolve } from 'path'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
export class LoginController implements Controller {
  public async handle (request:HttpRequest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }
}
