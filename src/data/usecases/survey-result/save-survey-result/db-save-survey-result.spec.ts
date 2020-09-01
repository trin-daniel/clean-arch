import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols'

import { DbSaveSurveyResult } from './db-save-survey-result'
import { set, reset } from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const mockSurveyResult = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
  date: new Date()
})

const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
  date: new Date()
})

const mockSaveSurveyResultRespository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    public async save (data: SaveSurveyResultParams):Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(mockSurveyResultModel()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSystemUnderTest = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRespository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult usecase', () => {
  beforeAll(() => {
    set(new Date())
  })

  afterAll(() => {
    reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSystemUnderTest()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    await sut.save(mockSurveyResultModel())
    expect(saveSpy).toHaveBeenCalledWith(mockSurveyResultModel())
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.save(mockSurveyResult())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSystemUnderTest()
    const survey = await sut.save(mockSurveyResult())

    expect(survey).toEqual(mockSurveyResultModel())
  })
})
