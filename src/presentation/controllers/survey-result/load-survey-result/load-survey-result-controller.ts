import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById
} from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  public async handle (req: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(req.params.surveyId)
    return null
  }
}
