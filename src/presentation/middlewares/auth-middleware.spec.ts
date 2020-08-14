import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
describe('Auth middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const systemUnderTest = new AuthMiddleware()
    const response = await systemUnderTest.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
