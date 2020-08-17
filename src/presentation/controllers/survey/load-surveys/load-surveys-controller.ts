import {
  Controller,
  HttpResponse,
  HttpRequest,
  LoadSurveys
} from './load-surveys-controller-protocols'
import { success, serverError } from '../../../helpers/http/http-helper'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      return success(surveys)
    } catch (err) {
      return serverError(err)
    }
  }
}
