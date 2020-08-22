import {
  Controller,
  HttpResponse,
  HttpRequest,
  LoadSurveyById
} from './save-survey-result-controller-protocols'

import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamErrors } from '../../../errors'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly LoadSurveyById: LoadSurveyById
  ) {}

  public async handle (request: HttpRequest):Promise<HttpResponse> {
    try {
      const { surveyId } = request.params
      const { answer } = request.body

      const survey = await this.LoadSurveyById.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map(item => item.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamErrors('answer'))
        }
      } else {
        return forbidden(new InvalidParamErrors('surveyId'))
      }
      return null
    } catch (err) {
      return serverError(err)
    }
  }
}
