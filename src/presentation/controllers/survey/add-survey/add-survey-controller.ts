import { Controller, HttpResponse, HttpRequest, Validation } from './add-survey-controller-protocols'
import { badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    const { body } = request
    const error = this.validation.validate(body)
    if (error) {
      return badRequest(error)
    }
    return new Promise(resolve => resolve(null))
  }
}
