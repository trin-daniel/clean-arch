import { signinPath } from './paths/sign-in-path'
import { accountSchema } from './schemas/account-schema'
import { signinSchema } from './schemas/signin-schema'

export const docs = {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'Api do curso do professor Mango',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'SignIn'
  }],
  paths: {
    '/signin': signinPath
  },
  schemas: {
    account: accountSchema,
    signin: signinSchema
  }
}
