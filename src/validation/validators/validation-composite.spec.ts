import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'

interface SutTypes {
  sut: ValidationComposite,
  validationStubs: Validation[]
}

const mockValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input:any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const response = sut.validate({ field: 'any_value' })
    expect(response).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const response = sut.validate({ field: 'any_value' })

    expect(response).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const response = sut.validate({ field: 'any_value' })

    expect(response).toBeFalsy()
  })
})
