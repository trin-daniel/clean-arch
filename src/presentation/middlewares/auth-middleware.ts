import {
  HttpRequest,
  HttpResponse,
  Middleware
} from '../protocols'
import { forbidden, success } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    const token = request.headers?.['x-access-token']
    if (token) {
      const account = await this.loadAccountByToken.load(token)
      if (account) {
        return success({ account_id: account.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
