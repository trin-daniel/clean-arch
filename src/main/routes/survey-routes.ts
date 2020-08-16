import { Router } from 'express'
import { ExpressRouteAdapter } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { ExpressMiddlewareAdpter } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router:Router):void => {
  const auth = ExpressMiddlewareAdpter(makeAuthMiddleware('admin'))
  router.post('/surveys', auth, ExpressRouteAdapter(makeAddSurveyController()))
}
