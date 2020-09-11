import { reset, set } from 'mockdate'
import { SurveyModel } from '../../../../domain/models/survey'
import { SurveyResultModel } from '../../../../domain/models/survey-result'
import { LoadSurveyResultRepository } from '../../../protocols/db/survey-result/load-survey-result-repository'
import { LoadSurveyByIdRepository } from '../../../protocols/db/survey/load-survey-by-id-repository'
import { DbLoadSurveyResult } from './db-load-survey-result'

type SutTypes = {
sut: DbLoadSurveyResult,
loadSurveyResultRepoStub: LoadSurveyResultRepository,
loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const mockSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    },
    {
      answer: 'other_answer',
      image: 'other_image'
    }
  ],
  date: new Date()
})

const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0
  }, {
    answer: 'other_answer',
    image: 'other_image',
    count: 0,
    percent: 0
  }],
  date: new Date()
})

const mockLoadSurveyResultRepo = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId (surveyId: string):Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultRepositoryStub()
}

const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    public async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepoStub = mockLoadSurveyResultRepo()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepoStub, loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyResultRepoStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyResult usecase', () => {
  beforeAll(() => {
    set(new Date())
  })

  afterAll(() => {
    reset()
  })

  test('Should call LoadSurveyResultRepository with correct surveyId', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
    await sut.load('any_survey_id')

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepoStub, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    await sut.load('any_survey_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return SurveyResultModel with all answers if count 0 if LoadSurveyResultRespository returns null', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.load('any_survey_id')

    expect(response).toEqual(mockSurveyResultModel())
  })

  test('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load('any_survey_id')

    expect(response).toEqual(mockSurveyResultModel())
  })
})
