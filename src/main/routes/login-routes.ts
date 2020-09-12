import { ExpressRouteAdapter } from '@main/adapters/express-route-adapter'
import { Router } from 'express'
import { makeLoginController } from '@main/factories/controllers/login/sign-in/login-controller-factory'
import { makeSignUpController } from '@main/factories/controllers/login/sign-up/signup-controller-factory'
export default (router: Router): void => {
  router.post('/signup', ExpressRouteAdapter(makeSignUpController()))
  router.post('/signin', ExpressRouteAdapter(makeLoginController()))
}
