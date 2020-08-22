import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel
} from './save-survey-result-controller-protocols'

import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamErrors } from '../../../errors'

import { SaveSurveyResultController } from './save-survey-result-controller'

type SystemUnderTestTypes = {
  loadSurveyByIdStub: LoadSurveyById
  systemUnderTest: SaveSurveyResultController
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    public async loadById (id: string):Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const systemUnderTest = new SaveSurveyResultController(loadSurveyByIdStub)

  return {
    systemUnderTest,
    loadSurveyByIdStub
  }
}

describe('SaveSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await systemUnderTest.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(null))
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(forbidden(new InvalidParamErrors('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { systemUnderTest, loadSurveyByIdStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
