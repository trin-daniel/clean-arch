import {
  badRequest,
  serverError,
  unauthorized,
  notFound
} from './components'

import {
  accountSchema,
  signinSchema,
  errorSchema
} from './schemas'

import { signin } from './paths/sign-in-path'

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
  tags: [{ name: 'SignIn' }],
  paths: { '/signin': signin },

  schemas: {
    account: accountSchema,
    signin: signinSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound
  }
}
