import {
  Controller,
  HttpResponse,
  HttpRequest,
  LoadSurveyById
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly LoadSurveyById: LoadSurveyById
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    const { params } = request
    await this.LoadSurveyById.loadById(params.surveyId)
    return null
  }
}
