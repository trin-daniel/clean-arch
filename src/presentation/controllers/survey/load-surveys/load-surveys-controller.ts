import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveys,
} from '@presentation/controllers/survey/load-surveys/load-surveys-controller-protocols'
import {
  noContent,
  serverError,
  success,
} from '@presentation/helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return surveys.length ? success(surveys) : noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}
