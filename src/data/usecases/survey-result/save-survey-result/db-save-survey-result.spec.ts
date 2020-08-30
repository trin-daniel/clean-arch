import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols'

import { DbSaveSurveyResult } from './db-save-survey-result'
import { set, reset } from 'mockdate'

type SystemUnderTestTypes = {
  systemUnderTest: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
  accountId: 'any_account_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id',
  date: new Date()
})

const makeSaveSurveyResultRespository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    public async save (data: SaveSurveyResultParams):Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResult()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRespository()
  const systemUnderTest = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    systemUnderTest,
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
    const {
      systemUnderTest,
      saveSurveyResultRepositoryStub
    } = makeSystemUnderTest()

    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResult = makeFakeSurveyResultData()

    await systemUnderTest.save(surveyResult)
    expect(saveSpy).toHaveBeenCalledWith(surveyResult)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { systemUnderTest, saveSurveyResultRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = systemUnderTest.save(makeFakeSurveyResultData())

    await expect(promise).rejects.toThrow()
  })

  test('Should return SurveyResult on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const surveyResult = await systemUnderTest.save(makeFakeSurveyResultData())

    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })
})
