import { Router } from 'express'
import { authUser } from '@main//middlewares/auth-user'
import { ExpressRouteAdapter } from '@main/adapters/express-route-adapter'
import { makeSaveSurveyResultController } from '@main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '@main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', authUser, ExpressRouteAdapter(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', authUser, ExpressRouteAdapter(makeLoadSurveyResultController()))
}
