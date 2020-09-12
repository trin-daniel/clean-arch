import { Validation } from '@presentation/protocols/validation'
import
{
  ValidationComposite,
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation
} from '@validation/validators'
import { EmailValidatorAdapter } from '@infra/validators/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations:Validation[] = []
  for (const field of ['name', 'email', 'password', 'confirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'confirmation'))
  validations.push(new EmailValidation(
    'email',
    new EmailValidatorAdapter()
  ))

  return new ValidationComposite(validations)
}
