import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http-helper'
import { Request, Response } from '../protocols/http'
export class SignUpController {
  handle (request: Request): Response {
    const requiredFields = ['name', 'email', 'password']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
