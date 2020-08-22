import {
  Controller,
  HttpResponse,
  HttpRequest,
  LoadSurveyById
} from './save-survey-result-controller-protocols'

import { forbidden } from '../../../helpers/http/http-helper'
import { InvalidParamErrors } from '../../../errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly LoadSurveyById: LoadSurveyById
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    const { params } = request
    const survey = await this.LoadSurveyById.loadById(params.surveyId)
    if (!survey) {
      return forbidden(new InvalidParamErrors('surveyId'))
    }
    return null
  }
}
