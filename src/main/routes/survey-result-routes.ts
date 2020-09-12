import { Router } from 'express'
import { authUser } from '../middlewares/auth-user'
import { ExpressRouteAdapter } from '../adapters/express-route-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultController } from '../factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', authUser, ExpressRouteAdapter(makeSaveSurveyResultController()))
  router.get('/surveys/:surveyId/results', authUser, ExpressRouteAdapter(makeLoadSurveyResultController()))
}
