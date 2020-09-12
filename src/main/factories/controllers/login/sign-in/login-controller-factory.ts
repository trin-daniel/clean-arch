import { Controller } from '@presentation/protocols'
import { LoginController } from '@presentation/controllers/login/sign-in/login-controller'
import { makeLoginValidation } from '@main/factories/controllers/login/sign-in/login-validation-factory'
import { makeDbAuthentication } from '@main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '@main/factories/decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(
    new LoginController(
      makeDbAuthentication(),
      makeLoginValidation()
    )
  )
}
