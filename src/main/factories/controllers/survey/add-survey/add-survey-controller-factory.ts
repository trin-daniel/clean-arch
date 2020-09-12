import { AddSurveyController } from '@presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '@presentation/protocols'
import { makeAddSurveyValidation } from '@main/factories/controllers/survey/add-survey/add-survey-validation-factory'
import { makeDbAddSurvey } from '@main/factories/usecases/survey/add-survey/db-add-survey-factory'
import { makeLogControllerDecorator } from '@main/factories/decorators/log-controller-decorator-factory'

export const makeAddSurveyController = (): Controller => {
  return makeLogControllerDecorator(
    new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey()),
  )
}
