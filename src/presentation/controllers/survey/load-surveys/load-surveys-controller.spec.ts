import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys } from './load-surveys-controller-protocols'
import { success, serverError, noContent } from '../../../helpers/http/http-helper'
import { set, reset } from 'mockdate'

type SystemUnderTestTypes = {
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

  test('Should return 200 on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const response = await systemUnderTest.handle({})

    expect(response).toEqual(success(makeFakeSurveys()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { systemUnderTest, loadSurveysStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const response = await systemUnderTest.handle({})

    expect(response).toEqual(noContent())
  })

  test('Should return 500 if LoadSurvey throws', async () => {
    const { systemUnderTest, loadSurveysStub } = makeSystemUnderTest()
    jest.spyOn(loadSurveysStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = await systemUnderTest.handle({})

    expect(response).toEqual(serverError(new Error()))
  })
})
