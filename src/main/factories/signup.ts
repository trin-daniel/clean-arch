import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = ():Controller => {
  const signupController = new SignUpController(
    new EmailValidatorAdapter(),
    new DbAddAccount(
      new BcryptAdapter(12),
      new AccountMongoRepository()
    )
  )
  return new LogControllerDecorator(signupController)
}
