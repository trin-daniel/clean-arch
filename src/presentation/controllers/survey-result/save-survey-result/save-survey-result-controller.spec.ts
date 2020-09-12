import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SurveyModel,
  SurveyResultModel,
} from '@presentation/controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import {
  forbidden,
  serverError,
  success,
} from '@presentation/helpers/http/http-helper'
import { reset, set } from 'mockdate'

import { InvalidParamErrors } from '@presentation/errors'
import { SaveSurveyResultController } from '@presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'

type SutTypes = {
  loadSurveyByIdStub: LoadSurveyById
  sut: SaveSurveyResultController
  saveSurveyResultStub: SaveSurveyResult
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id',
})

const mockSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
    },
  ],
  date: new Date(),
})

const mockSurveyResult = (): any => ({
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  answer: 'valid_answer',
  date: new Date(),
})

const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    public async loadById(id: string): Promise<SurveyModel> {
      return new Promise((resolve) => resolve(mockSurvey()))
    }
  }
  return new LoadSurveyByIdStub()
}

const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    public async save(
      data: SaveSurveyResultParams,
    ): Promise<SurveyResultModel> {
      return new Promise((resolve) => resolve(mockSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}

const mockRequestWithoutToken = (): any => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'wrong_answer',
  },
})

const makeSystemUnderTest = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResult()
  const sut = new SaveSurveyResultController(
    loadSurveyByIdStub,
    saveSurveyResultStub,
  )

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
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
    const { sut, loadSurveyByIdStub } = makeSystemUnderTest()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(mockRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSystemUnderTest()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(forbidden(new InvalidParamErrors('surveyId')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSystemUnderTest()
    jest
      .spyOn(loadSurveyByIdStub, 'loadById')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSystemUnderTest()
    const response = await sut.handle(mockRequestWithoutToken())

    expect(response).toEqual(forbidden(new InvalidParamErrors('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSystemUnderTest()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

    await sut.handle(mockRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      date: new Date(),
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSystemUnderTest()
    jest
      .spyOn(saveSurveyResultStub, 'save')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSystemUnderTest()
    const response = await sut.handle(mockRequest())

    expect(response).toEqual(success(mockSurveyResult()))
  })
})
