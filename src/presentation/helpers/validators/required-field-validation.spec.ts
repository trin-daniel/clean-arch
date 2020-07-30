import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

describe('RequiredFieldValidation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const systemUnderTest = new RequiredFieldValidation('field')
    const error = systemUnderTest.validate({ any_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const systemUnderTest = new RequiredFieldValidation('field')
    const error = systemUnderTest.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
