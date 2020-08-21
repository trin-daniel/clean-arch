import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyByIdRepository } from '../../protocols/db/survey/load-survey-by-id-repository'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { set, reset } from 'mockdate'

type SystemUnderTestTypes = {
  systemUnderTest: DbLoadSurveyById,
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }],
  date: new Date()
})

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string):Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

const makeSystemUnderTest = ():SystemUnderTestTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const systemUnderTest = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return {
    systemUnderTest,
    loadSurveyByIdRepositoryStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    set(new Date())
  })

  afterAll(() => {
    reset()
  })

  test('Should call LoadSurveyByIdRepository', async () => {
    const { systemUnderTest, loadSurveyByIdRepositoryStub } = makeSystemUnderTest()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await systemUnderTest.loadById('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return survey on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const survey = await systemUnderTest.loadById('any_id')

    expect(survey).toEqual(makeFakeSurvey())
  })
})
