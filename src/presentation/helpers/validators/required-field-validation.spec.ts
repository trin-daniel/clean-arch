import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '../../errors'

describe('RequiredFieldValidation', () => {
  test('Should returna a MissingParamError if validation fails', () => {
    const systemUnderTest = new RequiredFieldValidation('field')
    const error = systemUnderTest.validate({ any_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
