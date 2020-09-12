import { MissingParamError } from '@presentation/errors'
import { RequiredFieldValidation } from '@validation/validators/required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}
describe('Required field validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const response = sut.validate({ any_field: 'any_value' })

    expect(response).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const response = sut.validate({ field: 'any_value' })

    expect(response).toBeFalsy()
  })
})
