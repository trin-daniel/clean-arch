import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/controllers/login/sign-up/signup-controller-factory'
import { makeLoginController } from '../factories/controllers/login/sign-in/login-controller-factory'
export default (router:Router):void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/signin', adaptRoute(makeLoginController()))
}
