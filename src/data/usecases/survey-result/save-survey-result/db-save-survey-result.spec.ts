import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel,
  LoadSurveyResultRepository
} from '@data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

import { DbSaveSurveyResult } from '@data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { set, reset } from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository,
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const mockSurveyResult = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
  date: new Date()
})

const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 1,
    percent: 50
  }, {
    answer: 'other_answer',
    image: 'other_image',
    count: 2,
    percent: 51
  }],
  date: new Date()
})

const mockSaveSurveyResultRespository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    public async save (data: SaveSurveyResultParams):Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    public async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const makeSystemUnderTest = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRespository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
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

    await sut.save(mockSurveyResult())
    expect(saveSpy).toHaveBeenCalledWith(mockSurveyResult())
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.save(mockSurveyResult())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSystemUnderTest()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    await sut.save(mockSurveyResult())

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(mockSurveyResult().surveyId)
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSystemUnderTest()
    const surveyResult = await sut.save(mockSurveyResult())

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.save(mockSurveyResult())
    await expect(promise).rejects.toThrow()
  })
})
