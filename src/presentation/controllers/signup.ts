import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http-helper'
import { Request, Response } from '../protocols/http'
export class SignUpController {
  handle (request: Request): Response {
    if (!request.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!request.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
