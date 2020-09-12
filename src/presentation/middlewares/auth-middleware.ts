import {
  HttpRequest,
  HttpResponse,
  LoadAccountByToken,
  Middleware,
} from '@presentation/middlewares/auth-middleware-protocols'
import {
  forbidden,
  serverError,
  success,
} from '@presentation/helpers/http/http-helper'

import { AccessDeniedError } from '../errors'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const token = request.headers?.['x-access-token']
      if (token) {
        const account = await this.loadAccountByToken.load(token, this.role)
        if (account) {
          return success({ accountId: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (err) {
      return serverError(err)
    }
  }
}
