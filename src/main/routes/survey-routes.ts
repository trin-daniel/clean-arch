import { ExpressRouteAdapter } from '@main/adapters/express-route-adapter'
import { Router } from 'express'
import { authAdmin } from '@main/middlewares/auth-admin'
import { authUser } from '@main/middlewares/auth-user'
import { makeAddSurveyController } from '@main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default (router: Router): void => {
  router.post(
    '/surveys',
    authAdmin,
    ExpressRouteAdapter(makeAddSurveyController()),
  )
  router.get(
    '/surveys',
    authUser,
    ExpressRouteAdapter(makeLoadSurveysController()),
  )
}
