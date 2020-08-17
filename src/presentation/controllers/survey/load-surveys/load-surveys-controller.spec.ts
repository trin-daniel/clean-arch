import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { set, reset } from 'mockdate'

interface SystemUnderTestTypes {
  systemUnderTest: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    public async load ():Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysStub()
}

const makeSystemUnderTest = ():SystemUnderTestTypes => {
  const loadSurveysStub = makeLoadSurveys()
  const systemUnderTest = new LoadSurveysController(loadSurveysStub)
  return {
    systemUnderTest,
    loadSurveysStub
  }
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

describe('LoadSurveys controller', () => {
  beforeAll(() => {
    set(new Date())
  })

  afterAll(() => {
    reset()
  })

  test('Should call LoadSurveys', async () => {
    const { systemUnderTest, loadSurveysStub } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await systemUnderTest.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })
})
