import { Controller } from '@presentation/protocols'
import { LoginController } from '@presentation/controllers/login/sign-in/login-controller'
import { makeDbAuthentication } from '@main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@main/factories/decorators/log-controller-decorator-factory'
import { makeLoginValidation } from '@main/factories/controllers/login/sign-in/login-validation-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(
    new LoginController(makeDbAuthentication(), makeLoginValidation()),
  )
}
