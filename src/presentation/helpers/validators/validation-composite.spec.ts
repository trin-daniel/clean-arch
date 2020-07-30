import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '../../errors'
import { Validation } from './validation'

describe('Validation Composite', () => {
  test('Should return an error if any validations fails', () => {
    class ValidationStub implements Validation {
      validate (input:any):Error {
        return new MissingParamError('field')
      }
    }
    const validationStub = new ValidationStub()

    const systemUnderTest = new ValidationComposite([validationStub])
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
