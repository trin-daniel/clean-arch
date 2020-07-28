import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError, success } from '../../presentation/helpers/http-helper'
import { AccountModel } from '../../domain/models/account'

interface SystemUnderTest {
  systemUnderTest:LogControllerDecorator
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}
const makeController = ():Controller => {
  class ControllerStub implements Controller {
    public async handle (request:HttpRequest):Promise<HttpResponse> {
      return new Promise(resolve => resolve(success(makeFakeAccount())))
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

const makeFakeRequest = ():HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    confirmation: 'any_password'
  }
})
const makeFakeAccount = ():AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

const makeFakeServerError = ():HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_error'
  return serverError(fakeError)
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, systemUnderTest } = makeSystemUnderTest()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await systemUnderTest.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const httpResponse = await systemUnderTest.handle(makeFakeRequest())
    expect(httpResponse).toEqual(success(makeFakeAccount()))
  })
  test('Should call LogErrorRepository with correct error if controller a server error', async () => {
    const {
      controllerStub,
      systemUnderTest,
      logErrorRepositoryStub
    } = makeSystemUnderTest()

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(makeFakeServerError()))
      )
    await systemUnderTest.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_error')
  })
})
