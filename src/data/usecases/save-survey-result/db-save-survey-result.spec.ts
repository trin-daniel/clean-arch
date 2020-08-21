import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols'

import { DbSaveSurveyResult } from './db-save-survey-result'
import { set, reset } from 'mockdate'

type SystemUnderTestTypes = {
  systemUnderTest: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeFakeSurveyResultData = (): SaveSurveyResultModel => ({
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
    public async save (data: SaveSurveyResultModel):Promise<SurveyResultModel> {
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

describe('', () => {
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
})
