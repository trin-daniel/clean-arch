import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'
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

  test('Should throws if LoadSurveyByIdRepository throws', async () => {
    const { systemUnderTest, loadSurveyByIdRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = systemUnderTest.loadById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
