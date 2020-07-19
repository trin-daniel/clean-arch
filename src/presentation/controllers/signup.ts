import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { Request, Response } from '../protocols/http'

export class SignUpController implements Controller {
  handle (request:Request): Response {
    const requiredFields = ['name', 'email', 'password', 'confirmation']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
