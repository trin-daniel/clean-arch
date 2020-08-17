import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'
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

describe('DbLoadSurveys', () => {
  test('Should call LoadSuverysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      public async loadAll ():Promise<SurveyModel[]> {
        return new Promise(resolve => resolve(makeFakeSurveys()))
      }
    }
    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
    const systemUnderTest = new DbLoadSurveys(loadSurveysRepositoryStub)
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')

    await systemUnderTest.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
})
