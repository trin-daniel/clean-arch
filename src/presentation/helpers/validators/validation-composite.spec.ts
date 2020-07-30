import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../errors'
import { Validation } from './validation'

interface SystemUnderTestType {
  systemUnderTest: ValidationComposite,
  validationStubs: Validation[]
}

const makeValidation = ():Validation => {
  class ValidationStub implements Validation {
    validate (input:any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSystemUnderTest = (): SystemUnderTestType => {
  const validationStubs = [makeValidation(), makeValidation()]
  const systemUnderTest = new ValidationComposite(validationStubs)
  return {
    systemUnderTest,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { systemUnderTest, validationStubs } = makeSystemUnderTest()
    jest.spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(
        new MissingParamError('field')
      )
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { systemUnderTest, validationStubs } = makeSystemUnderTest()
    jest.spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(
        new Error()
      )
    jest.spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(
        new MissingParamError('field')
      )
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
