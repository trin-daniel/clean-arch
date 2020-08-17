import { Router } from 'express'
import { ExpressRouteAdapter } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { ExpressMiddlewareAdpter } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default (router:Router):void => {
  const adminAuth = ExpressMiddlewareAdpter(makeAuthMiddleware('admin'))
  const userAuth = ExpressMiddlewareAdpter(makeAuthMiddleware())
  router.post('/surveys', adminAuth, ExpressRouteAdapter(makeAddSurveyController()))
  router.get('/surveys', userAuth, ExpressRouteAdapter(makeLoadSurveysController()))
}
