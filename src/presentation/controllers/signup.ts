import { MissingParamError, InvalidParamErrors } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import {
  Request,
  Response,
  EmailValidator,
  Controller
} from '../protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly email:EmailValidator
  ) { this.email }

  handle (request:Request): Response {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmation']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password, confirmation } = request.body
      const isValid = this.email.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamErrors('email'))
      }
      if (password !== confirmation) {
        return badRequest(new InvalidParamErrors('confirmation'))
      }
    } catch (err) {
      return serverError()
    }
  }
}
