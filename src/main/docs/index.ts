import {
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden
} from './components'

import {
  accountSchema,
  signinSchema,
  errorSchema,
  surveySchema,
  surveyAnswerSchema,
  surveysSchema,
  signupSchema,
  apiKeyAuthSchema
} from './schemas'

import { signin, surveyPath, signup } from './paths'

export const docs = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'Api do curso do professor Mango',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://opensource.org/licenses/GPL-3.0'
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'SignIn' }, { name: 'Survey' }],
  paths: { '/signin': signin, '/surveys': surveyPath, '/signup': signup },

  schemas: {
    account: accountSchema,
    signin: signinSchema,
    signup: signupSchema,
    error: errorSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
    forbidden
  }
}
