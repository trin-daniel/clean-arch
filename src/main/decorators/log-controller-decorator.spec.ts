import { AccountModel } from '@domain/models/account'
import { serverError, success } from '@presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { LogErrorRepository } from '@data/protocols/db/log/log-error-repository'
import { LogControllerDecorator } from '@main/decorators/log-controller-decorator'

type SutTypes = {
  sut:LogControllerDecorator
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}

const mockController = ():Controller => {
  class ControllerStub implements Controller {
    public async handle (request:HttpRequest):Promise<HttpResponse> {
      return new Promise(resolve => resolve(success(mockAccountModel())))
    }
  }
  return new ControllerStub()
}

const mockLogErrorRepository = ():LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    public async logError (stack: string):Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

const mockRequest = ():HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    confirmation: 'any_password'
  }
})

const mockAccountModel = ():AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

const mockServerError = ():HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_error'
  return serverError(fakeError)
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(mockRequest())
    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(success(mockAccountModel()))
  })

  test('Should call LogErrorRepository with correct error if controller a server error', async () => {
    const { controllerStub, sut, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(mockServerError()))

    await sut.handle(mockRequest())
    expect(logSpy).toHaveBeenCalledWith('any_error')
  })
})
