import {
  accountSchema,
  addsurveySchema,
  apiKeyAuthSchema,
  errorSchema,
  saveSurveySchema,
  signinSchema,
  signupSchema,
  surveyAnswerSchema,
  surveyResultAnswerSchema,
  surveyResultSchema,
  surveySchema,
  surveysSchema,
} from '@main/docs/schemas'
import {
  badRequest,
  forbidden,
  notFound,
  serverError,
  unauthorized,
} from '@main/docs/components'
import { signin, signup, surveyPath, surveyResult } from '@main/docs/paths'

export const docs = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'Api do curso do professor Mango',
    version: '1.0.0',
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://opensource.org/licenses/GPL-3.0',
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'SignIn' }, { name: 'Survey' }],
  paths: {
    '/signin': signin,
    '/surveys': surveyPath,
    '/signup': signup,
    '/surveys/{surveyId}/results': surveyResult,
  },

  schemas: {
    account: accountSchema,
    addSurvey: addsurveySchema,
    signin: signinSchema,
    signup: signupSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveyResultAnswer: surveyResultAnswerSchema,
    saveSurvey: saveSurveySchema,
    surveyResult: surveyResultSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden,
  },
}
