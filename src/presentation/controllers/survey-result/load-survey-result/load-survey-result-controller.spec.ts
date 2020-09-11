import { HttpRequest, LoadSurveyById } from './load-survey-result-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { SurveyModel } from '../../../../domain/models/survey'

type SutTypes = {
sut: LoadSurveyResultController,
loadSurveyByIdStub: LoadSurveyById
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    public async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(null)
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)
  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResult Controller', () => {
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
