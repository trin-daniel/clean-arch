import { CompareFieldsValidation } from '@validation/validators/compare-fields-validation'
import { InvalidParamErrors } from '@presentation/errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFieldsValidation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const systemUnderTest = makeSut()
    const error = systemUnderTest.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value',
    })

    expect(error).toEqual(new InvalidParamErrors('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const systemUnderTest = makeSut()
    const error = systemUnderTest.validate({
      field: 'valid_value',
      fieldToCompare: 'valid_value',
    })

    expect(error).toBeFalsy()
  })
})
