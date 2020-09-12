import {
  AddSurvey,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from '@presentation/controllers/survey/add-survey/add-survey-controller-protocols'
import {
  badRequest,
  noContent,
  serverError,
} from '@presentation/helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = request.body
      await this.addSurvey.add({ question, answers, date: new Date() })
      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}
