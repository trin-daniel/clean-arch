import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash (): Promise<string> {
    return new Promise(resolve => resolve('hash_final'))
  }
}))
const salt = 12
const makeSystemUnderTest = ():BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Cryptographic password layer', () => {
  test('Should call bcrypt with correct value', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await systemUnderTest.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const systemUnderTest = makeSystemUnderTest()
    const hash = await systemUnderTest.encrypt('any_value')
    expect(hash).toBe('hash_final')
  })
})
