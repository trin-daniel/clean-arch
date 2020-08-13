import { HttpRequest, HttpResponse, Controller } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols'
const makeFakeRequest = ():HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: any):Error {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const systemUnderTest = new AddSurveyController(validationStub)
    const request = makeFakeRequest()

    await systemUnderTest.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
