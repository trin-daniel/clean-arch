import { MissingParamError } from '../errors/missing-param'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { Request, Response } from '../protocols/http'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamErrors } from '../errors/invalid-param'

export class SignUpController implements Controller {
  constructor (
    private readonly email:EmailValidator
  ) { this.email }

  handle (request:Request): Response {
    const requiredFields = ['name', 'email', 'password', 'confirmation']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email } = request.body
    const isValid = this.email.isValid(email)
    if (!isValid) {
      return badRequest(new InvalidParamErrors('email'))
    }
  }
}
