import { MissingParam } from '../errors/missingParam'
import { Request, Response } from '../protocols/http'
export class SignUpController {
  handle (request: Request): Response {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new MissingParam('name')
      }
    }

    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new MissingParam('email')
      }
    }
  }
}
