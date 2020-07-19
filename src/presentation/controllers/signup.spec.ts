import { MissingParamError } from '../errors/missing-param'
import { SignUpController } from './signup'
describe('component signUp controller', () => {
  test('Should return error 400 if not specify name of client', () => {
    const systemUnderTest = new SignUpController()
    const request = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  test('Should return error 400 if not specify e-mail of client', () => {
    const systemUnderTest = new SignUpController()
    const request = {
      body: {
        name: 'any_name',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('Should return error 400 if not specify password of client', () => {
    const systemUnderTest = new SignUpController()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        confirmation: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  test('Should return error 400 if not specify password confirmation of client', () => {
    const systemUnderTest = new SignUpController()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('confirmation'))
  })
})
