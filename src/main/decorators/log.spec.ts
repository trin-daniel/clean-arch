import { LogControllerDecorator } from './log'
import
{
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'

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
const makeLogErrorRepository = ():LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    public async log (stack: string):Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}
interface SystemUnderTest {
  systemUnderTest:LogControllerDecorator
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}
const makeSystemUnderTest = ():SystemUnderTest => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const systemUnderTest = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    systemUnderTest,
    controllerStub,
    logErrorRepositoryStub
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

  test('Should return the same result of the controller', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    })
  })
  test('Should call LogErrorRepository with correct error if controller a server error', async () => {
    const { controllerStub, systemUnderTest, logErrorRepositoryStub } = makeSystemUnderTest()
    const fakeError = new Error()
    fakeError.stack = 'any_error'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(error)))
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    await systemUnderTest.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_error')
  })
})
