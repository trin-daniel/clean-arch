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
  })
})
