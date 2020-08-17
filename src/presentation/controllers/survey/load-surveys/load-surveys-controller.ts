import { Controller, HttpResponse, HttpRequest, LoadSurveys } from './load-surveys-controller-protocols'
import { success } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()
    return success(surveys)
  }
}
