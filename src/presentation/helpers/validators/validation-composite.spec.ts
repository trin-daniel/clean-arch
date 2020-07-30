import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../errors'
import { Validation } from './validation'

interface SystemUnderTestType {
  systemUnderTest: ValidationComposite,
  validationStub: Validation
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
  const validationStub = makeValidation()
  const systemUnderTest = new ValidationComposite([validationStub])
  return {
    systemUnderTest,
    validationStub
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validations fails', () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(
        new MissingParamError('field')
      )
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
