import { HttpRequest, AddSurvey, AddSurveyModel, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http/http-helper'

interface SystemUnderTestTypes {
  systemUnderTest: AddSurveyController
  validationStub: Validation,
  addSurveyStub: AddSurvey
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add (data: AddSurveyModel):Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const systemUnderTest = new AddSurveyController(validationStub, addSurveyStub)
  return {
    systemUnderTest,
    validationStub,
    addSurveyStub
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

  test('Should return 400 if Validation fails', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { systemUnderTest, addSurveyStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const request = makeFakeRequest()

    await systemUnderTest.handle(request)
    expect(addSpy).toHaveBeenCalledWith(request.body)
  })
})
