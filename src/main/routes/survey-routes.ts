import { Router } from 'express'
import { ExpressRouteAdapter } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { authAdmin } from '../middlewares/auth-admin'
import { authUser } from '../middlewares/auth-user'

export default (router:Router):void => {
  router.post('/surveys', authAdmin, ExpressRouteAdapter(makeAddSurveyController()))
  router.get('/surveys', authUser, ExpressRouteAdapter(makeLoadSurveysController()))
}
