import { LogControllerDecorator } from './log'
import
{
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'

interface SystemUnderTest {
  systemUnderTest:LogControllerDecorator
  controllerStub: Controller,
}
const makeController = ():Controller => {
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
  return new ControllerStub()
}

const makeSystemUnderTest = ():SystemUnderTest => {
  const controllerStub = makeController()
  const systemUnderTest = new LogControllerDecorator(controllerStub)
  return {
    systemUnderTest,
    controllerStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, systemUnderTest } = makeSystemUnderTest()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
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
