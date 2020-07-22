import
{
  MissingParamError,
  InvalidParamErrors,
  ServerError
} from '../../errors'
import
{
  SignUpController
} from './signup'
import
{
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel
} from './signup-protocols'
import { rejects } from 'assert'

const makeEmailValidator = ():EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel):Promise<AccountModel> {
      return new Promise((resolve) => resolve(
        {
          id: 'valid_id',
          name: 'valid_name',
          email: 'valid_email',
          password: 'valid_password'
        }
      ))
    }
  }
  return new AddAccountStub()
}

interface SystemUnderTestTypes{
  systemUnderTest: SignUpController,
  emailValidatorStub: EmailValidator,
  addAccountStub: AddAccount
}
const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const systemUnderTest = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    systemUnderTest,
    emailValidatorStub,
    addAccountStub
  }
}

describe('component signUp controller', () => {
  test('Should return error 400 if not specify name of client', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  test('Should return error 400 if not specify e-mail of client', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'any_name',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('Should return error 400 if not specify password of client', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        confirmation: 'value equal of password field'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  test('Should return error 400 if not specify password confirmation of client', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'value equal of password field'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('confirmation'))
  })

  test('Should return error 400 if password confirmation fails', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_value',
        confirmation: 'invalid_value'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamErrors('confirmation'))
  })

  test('Should return error 400 if an invalid email is provided', async () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)
    const request = {
      body: {
        name: 'any_name',
        email: 'invalid_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamErrors('email'))
  })

  test('Should call emailValidator with correct email', async () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    await systemUnderTest.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should return error 500 if an exception occurs', async () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should return error 500 if an exception occurs in addAccount', async () => {
    const { systemUnderTest, addAccountStub } = makeSystemUnderTest()
    jest.spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => {
          reject(new Error())
        })
      })
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should call addAccount with correct values', async () => {
    const { systemUnderTest, addAccountStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }
    }
    await systemUnderTest.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        confirmation: 'valid_password'
      }
    }
    const response = await systemUnderTest.handle(request)
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })
  })
})
