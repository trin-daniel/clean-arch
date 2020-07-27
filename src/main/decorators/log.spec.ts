import { LogControllerDecorator } from './log'
import
{
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      public async handle (request:HttpRequest):Promise<HttpResponse> {
        const httpResponse:HttpResponse = {
          statusCode: 200,
          body: {
            name: 'any_name',
            email: 'any_email@gmail.com',
            password: 'any_password',
            confirmation: 'any_password'
          }
        }
        return new Promise(resolve => resolve(httpResponse))
      }
    }
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const systemUnderTest = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    await systemUnderTest.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
