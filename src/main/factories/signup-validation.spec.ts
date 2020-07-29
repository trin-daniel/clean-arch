import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignupValidation Factory ', () => {
  test('Should all ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations:Validation[] = []
    for (const field of ['name', 'email', 'password', 'confirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'confirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})