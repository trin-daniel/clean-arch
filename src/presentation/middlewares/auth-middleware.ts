import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  public async handle (request: HttpRequest):Promise<HttpResponse> {
    return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
  }
}
