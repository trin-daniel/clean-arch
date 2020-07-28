import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'

interface SystemUnderTestTypes{
  systemUnderTest: LoginController
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const systemUnderTest = new LoginController()
  return {
    systemUnderTest
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        password: 'any_password'
      }
    }
    const error = new MissingParamError('email')
    const response = await systemUnderTest.handle(request)
    expect(response).toEqual(badRequest(error))
  })

  test('Should return 400 if no password is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const error = new MissingParamError('password')
    const response = await systemUnderTest.handle(request)
    expect(response).toEqual(badRequest(error))
  })
})
