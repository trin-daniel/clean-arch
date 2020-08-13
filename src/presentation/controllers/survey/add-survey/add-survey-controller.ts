import { Controller, HttpResponse, HttpRequest, Validation, AddSurvey } from './add-survey-controller-protocols'
import { badRequest } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    const error = this.validation.validate(request.body)
    if (error) {
      return badRequest(error)
    }
    const { question, answers } = request.body
    await this.addSurvey.add({ question, answers })
    return null
  }
}
