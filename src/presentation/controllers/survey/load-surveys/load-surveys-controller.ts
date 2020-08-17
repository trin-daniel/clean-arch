import { Controller, HttpResponse, HttpRequest, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    await this.loadSurveys.load()
    return null
  }
}
