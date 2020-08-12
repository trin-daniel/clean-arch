import
{
  MissingParamError,
  ServerError
} from '../../errors'
import
{
  AccountModel,
  AddAccount,
  AddAccountModel,
  Validation,
  Authentication,
  AuthenticationModel
} from './signup-controller-protocols'
import
{
  success,
  serverError,
  badRequest
} from '../../helpers/http/http-helper'
import { SignUpController } from './signup-controller'
import { HttpRequest } from '../../protocols'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel):Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input:any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = ():Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel):Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

interface SystemUnderTestTypes{
  systemUnderTest: SignUpController,
  addAccountStub: AddAccount,
  validationStub: Validation
  authenticationStub: Authentication
}
const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const systemUnderTest = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    systemUnderTest,
    addAccountStub,
    validationStub,
    authenticationStub
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
  id: 'valid_id',
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

describe('component signUp controller', () => {
  test('Should return error 500 if an exception occurs in addAccount', async () => {
    const { systemUnderTest, addAccountStub } = makeSystemUnderTest()
    jest.spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => {
          reject(new Error())
        })
      })
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new ServerError(new Error())))
  })

  test('Should call addAccount with correct values', async () => {
    const { systemUnderTest, addAccountStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await systemUnderTest.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(success(makeFakeAccount()))
  })

  test('Should call Validation with correct values', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeRequest()
    await systemUnderTest.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(
        new MissingParamError('any_field')
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(
      badRequest(new MissingParamError('any_field'))
    )
  })
  test('Should call Authentication with correct values', async () => {
    const { systemUnderTest, authenticationStub } = makeSystemUnderTest()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    await systemUnderTest.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@gmail.com', password: 'any_password' })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { systemUnderTest, authenticationStub } = makeSystemUnderTest()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
