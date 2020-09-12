import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  LoadSurveyResult
} from '@presentation/controllers/survey-result/load-survey-result/load-survey-result-controller-protocols'

import { forbidden, serverError, success } from '@presentation/helpers/http/http-helper'
import { InvalidParamErrors } from '@presentation/errors'

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
