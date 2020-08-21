import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'

import { set, reset } from 'mockdate'

type SystemUnderTestTypes = {
  systemUnderTest: DbLoadSurveys,
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }]
}

const makeLoadSurveysRepository = () : LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    public async loadAll ():Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const systemUnderTest = new DbLoadSurveys(loadSurveysRepositoryStub)
  return {
    systemUnderTest,
    loadSurveysRepositoryStub
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    set(new Date())
  })

  afterAll(() => {
    reset()
  })

  test('Should call LoadSuverysRepository', async () => {
    const { systemUnderTest, loadSurveysRepositoryStub } = makeSystemUnderTest()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')

    await systemUnderTest.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  test('Should return list of surveys on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const surveys = await systemUnderTest.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { systemUnderTest, loadSurveysRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = systemUnderTest.load()
    await expect(promise).rejects.toThrow()
  })
})
