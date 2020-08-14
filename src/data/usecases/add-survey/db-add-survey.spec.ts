import { DbAddSurvey } from './db-add-survey'
import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

interface SystemUnderTestTypes{
  systemUnderTest: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}
const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    public async add (surveyData: AddSurveyModel):Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeSystemUnderTest = () :SystemUnderTestTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const systemUnderTest = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    systemUnderTest,
    addSurveyRepositoryStub
  }
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

describe('DbAddSurvey usecase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { systemUnderTest, addSurveyRepositoryStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()

    await systemUnderTest.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})
