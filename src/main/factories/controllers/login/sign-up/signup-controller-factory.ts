import { Controller } from '@presentation/protocols'
import { SignUpController } from '@presentation/controllers/login/sign-up/signup-controller'
import { makeDbAddAccount } from '@main/factories/usecases/account/add-account/db-add-account-factory'
import { makeDbAuthentication } from '@main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@main/factories/decorators/log-controller-decorator-factory'
import { makeSignUpValidation } from '@main/factories/controllers/login/sign-up/signup-validation-factory'

export const makeSignUpController = (): Controller => {
  return makeLogControllerDecorator(
    new SignUpController(
      makeDbAddAccount(),
      makeSignUpValidation(),
      makeDbAuthentication(),
    ),
  )
}
