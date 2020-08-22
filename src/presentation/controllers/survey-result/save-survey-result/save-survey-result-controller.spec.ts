import {
  HttpRequest,
  LoadSurveyById,
  SurveyModel,
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultModel
} from './save-survey-result-controller-protocols'

import { forbidden, serverError } from '../../../helpers/http/http-helper'
import { InvalidParamErrors } from '../../../errors'

import { SaveSurveyResultController } from './save-survey-result-controller'
import { set, reset } from 'mockdate'

type SystemUnderTestTypes = {
  loadSurveyByIdStub: LoadSurveyById
  systemUnderTest: SaveSurveyResultController
  saveSurveyResultStub: SaveSurveyResult
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
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

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'valid_id',
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  answer: 'valid_answer',
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

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    public async save (data: SaveSurveyResultModel):Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const systemUnderTest = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return {
    systemUnderTest,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    set(new Date())
  })

  afterAll(() => {
    reset()
  })

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

  test('Should return 403 if an invalid answer is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const response = await systemUnderTest.handle({
      params: {
        surveyId: 'any_survey_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })

    expect(response).toEqual(forbidden(new InvalidParamErrors('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { systemUnderTest, saveSurveyResultStub } = makeSystemUnderTest()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

    await systemUnderTest.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { systemUnderTest, saveSurveyResultStub } = makeSystemUnderTest()
    jest.spyOn(saveSurveyResultStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
