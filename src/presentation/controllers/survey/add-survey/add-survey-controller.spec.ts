import {
  AddSurvey,
  AddSurveyParams,
  HttpRequest,
  Validation
} from '@presentation/controllers/survey/add-survey/add-survey-controller-protocols'

import {
  badRequest,
  serverError,
  noContent
} from '@presentation/helpers/http/http-helper'

import { AddSurveyController } from '@presentation/controllers/survey/add-survey/add-survey-controller'

import { set, reset } from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation,
  addSurveyStub: AddSurvey
}

const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    add (data: AddSurveyParams):Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

const mockRequest = ():HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
})

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    set(new Date())
  })

  afterAll(() => {
    reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')

    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith(mockRequest().body)
  })

  test('Should returns 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should returns 204 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())

    expect(response).toEqual(noContent())
  })
})
