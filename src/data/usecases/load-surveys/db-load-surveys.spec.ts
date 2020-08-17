import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'

interface SystemUnderTestTypes {
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
  test('Should call LoadSuverysRepository', async () => {
    const { systemUnderTest, loadSurveysRepositoryStub } = makeSystemUnderTest()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')

    await systemUnderTest.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})
