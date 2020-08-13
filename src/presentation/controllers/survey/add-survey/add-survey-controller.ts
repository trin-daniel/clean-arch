import { Controller, HttpResponse, HttpRequest, Validation, AddSurvey } from './add-survey-controller-protocols'
import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = request.body
      await this.addSurvey.add({ question, answers })
      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}
