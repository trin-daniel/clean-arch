import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  LoadSurveyResult
} from './load-survey-result-controller-protocols'

import { forbidden, serverError, success } from '../../../helpers/http/http-helper'
import { InvalidParamErrors } from '../../../errors'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  public async handle (req: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = req.params
    try {
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamErrors('surveyId'))
      }
      const result = await this.loadSurveyResult.load(surveyId)
      return success(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
