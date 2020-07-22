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
    add (account: AddAccountModel):AccountModel {
      return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password'
      }
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
  test('Should return error 400 if not specify name of client', () => {
    const { systemUnderTest } = makeSystemUnderTest()
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
    const { systemUnderTest } = makeSystemUnderTest()
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
    const { systemUnderTest } = makeSystemUnderTest()
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
    const { systemUnderTest } = makeSystemUnderTest()
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

  test('Should return error 400 if password confirmation fails', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_value',
        confirmation: 'invalid_value'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamErrors('confirmation'))
  })

  test('Should return error 400 if an invalid email is provider', () => {
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
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamErrors('email'))
  })

  test('Should call emailValidator with correct email', () => {
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
    systemUnderTest.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should return error 500 if an exception occurs', () => {
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
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  test('Should call addAccount with correct values', () => {
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
    systemUnderTest.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
  })
})
