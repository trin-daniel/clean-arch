import { HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols'

interface SystemUnderTestTypes {
  systemUnderTest: AddSurveyController
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationStub = makeValidation()
  const systemUnderTest = new AddSurveyController(validationStub)
  return {
    systemUnderTest,
    validationStub
  }
}

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
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeRequest()

    await systemUnderTest.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
