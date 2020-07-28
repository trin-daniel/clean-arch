import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const systemUnderTest = new LoginController()
    const request = {
      body: {
        password: 'any_password'
      }
    }
    const error = new MissingParamError('email')
    const response = await systemUnderTest.handle(request)
    expect(response).toEqual(badRequest(error))
  })
})
