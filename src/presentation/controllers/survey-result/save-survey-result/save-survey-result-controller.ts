import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadSurveyById,
  SaveSurveyResult,
} from '@presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import {
  forbidden,
  serverError,
  success,
} from '@presentation/helpers/http/http-helper'

import { InvalidParamErrors } from '@presentation/errors'

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly LoadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = request.params
      const { answer } = request.body
      const { accountId } = request

      const survey = await this.LoadSurveyById.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map((item) => item.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamErrors('answer'))
        }
      } else {
        return forbidden(new InvalidParamErrors('surveyId'))
      }
      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        answer,
        surveyId,
        date: new Date(),
      })
      return success(surveyResult)
    } catch (err) {
      return serverError(err)
    }
  }
}
